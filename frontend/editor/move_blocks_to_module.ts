/**
 * @license
 * Copyright 2026 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Moves blocks that were dragged onto another tab from one module to another,
 * keeping the blocks that refer to methods and components working where possible:
 * - the blocks being moved, which were written for the module they are leaving, and
 * - the blocks in any module that call a method that is being moved.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { Editor } from './editor';
import { mutateModuleBlocks } from './module_blocks';
import { moveComponentToMechanism } from './move_component_to_mechanism';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageProject from '../storage/project';
import {
    MethodCallTarget,
    getCallReferenceFromBlockJson,
    setComponentCallMechanismInBlockJson,
    setMethodCallTargetInBlockJson } from '../blocks/mrc_call_python_function';
import { getMethodIdFromBlockJson } from '../blocks/mrc_class_method_def';
import { BLOCK_NAME as MRC_COMPONENT, ComponentBlock } from '../blocks/mrc_component';
import {
    getComponentReferenceFromBlockJson,
    setComponentReferenceMechanismInBlockJson } from '../blocks/mrc_component_reference';
import { SenderType, getEventHandlerSenderFromBlockJson } from '../blocks/mrc_event_handler';

/** A module and its content, including its blocks. */
export type ModuleWithContent = {
  module: storageModule.Module,
  content: storageModuleContent.ModuleContent,
};

/** What kind of block a Breakage is about. */
export type BreakageKind = 'call' | 'fireEvent' | 'eventHandler' | 'componentReference';

/** A block that won't work after the move. */
export type Breakage = {
  /** The class name of the module the block is in, or null if the block is one of the moved blocks. */
  moduleName: string | null,
  kind: BreakageKind,
  /** What the block refers to, for example arm.raise() or motor. */
  label: string,
  /**
   * Set if the block will work after all, if the robot component with this componentId is also
   * moved into the mechanism that the blocks are being moved to.
   */
  fixedByMovingComponentId?: string,
};

/** A change to a block's JSON. */
type BlockEdit = (blockJson: {[key: string]: any}) => void;

/** Everything that moving the blocks will change, worked out before anything is changed. */
export type MovePlan = {
  sourceModule: storageModule.Module,
  targetModule: storageModule.Module,
  /** The blocks being moved, as they were in the source module. */
  copyData: Blockly.clipboard.BlockCopyData,
  /**
   * The id of the first moved block in the source workspace, or null if the blocks aren't in the
   * source workspace, because they were dragged from the toolbox.
   */
  sourceBlockId: string | null,
  /** Changes to the moved blocks, by block id. */
  movedBlockEdits: Map<string, BlockEdit>,
  /** Changes to blocks that call a moved method, by module path and then by block id. */
  callerEdits: Map<string, {module: storageModule.Module, edits: Map<string, BlockEdit>}>,
  breakages: Breakage[],
  /** Robot components that can be moved into the target mechanism to fix some breakages. */
  componentsToMove: storageModuleContent.Component[],
};

/** Where a method or component is defined. */
type Owner =
    {kind: 'robot'} |
    {kind: 'mechanism', moduleId: string, mechanismInRobot: storageModuleContent.MechanismInRobot | null} |
    {kind: 'opmode', moduleId: string};

/**
 * Works out everything that moving the given blocks from the source module to the target module
 * will change, without changing anything.
 *
 * @param modules Every module in the project, with its current content.
 * @param canMoveRobotComponents Whether robot components can be moved into a mechanism, which
 *     requires the robot to be open in a tab.
 */
export function analyzeMove(
    copyData: Blockly.clipboard.BlockCopyData,
    sourceBlockId: string | null,
    sourceModule: storageModule.Module,
    targetModule: storageModule.Module,
    modules: ModuleWithContent[],
    canMoveRobotComponents: boolean): MovePlan {
  return new MoveAnalyzer(
      copyData, sourceBlockId, sourceModule, targetModule, modules, canMoveRobotComponents).analyze();
}

class MoveAnalyzer {
  private readonly contentByModuleId = new Map<string, storageModuleContent.ModuleContent>();
  private readonly robotContent: storageModuleContent.ModuleContent | null = null;
  private readonly mechanismsInRobot: storageModuleContent.MechanismInRobot[] = [];
  private readonly plan: MovePlan;

  constructor(
      copyData: Blockly.clipboard.BlockCopyData,
      sourceBlockId: string | null,
      sourceModule: storageModule.Module,
      targetModule: storageModule.Module,
      private readonly modules: ModuleWithContent[],
      private readonly canMoveRobotComponents: boolean) {
    for (const {module, content} of modules) {
      this.contentByModuleId.set(module.moduleId, content);
      if (module.moduleType === storageModule.ModuleType.ROBOT) {
        this.robotContent = content;
        this.mechanismsInRobot = content.getMechanisms();
      }
    }
    this.plan = {
      sourceModule: sourceModule,
      targetModule: targetModule,
      copyData: copyData,
      sourceBlockId: sourceBlockId,
      movedBlockEdits: new Map(),
      callerEdits: new Map(),
      breakages: [],
      componentsToMove: [],
    };
  }

  analyze(): MovePlan {
    const movedBlocks = wrapBlockState(this.plan.copyData.blockState);
    const movedBlockIds = new Set<string>();
    const movedMethodIds = new Set<string>();
    storageModuleContent.visitAllBlockJson(movedBlocks, (blockJson) => {
      movedBlockIds.add(blockJson.id);
      const methodId = getMethodIdFromBlockJson(blockJson);
      if (methodId) {
        movedMethodIds.add(methodId);
      }
    });

    storageModuleContent.visitAllBlockJson(movedBlocks, (blockJson) => {
      this.analyzeMovedBlock(blockJson, movedMethodIds);
    });

    // Blocks dragged from the toolbox can't have any callers.
    if (this.plan.sourceBlockId && movedMethodIds.size > 0) {
      for (const {module, content} of this.modules) {
        storageModuleContent.visitAllBlockJson(content.getBlocks(), (blockJson) => {
          if (!movedBlockIds.has(blockJson.id)) {
            this.analyzeCaller(module, blockJson, movedMethodIds);
          }
        });
      }
    }
    return this.plan;
  }

  /** Works out what to do with one of the moved blocks. */
  private analyzeMovedBlock(blockJson: {[key: string]: any}, movedMethodIds: Set<string>): void {
    const target = this.plan.targetModule;

    const callReference = getCallReferenceFromBlockJson(blockJson);
    if (callReference) {
      switch (callReference.kind) {
        case 'method': {
          if (callReference.target === 'within' && movedMethodIds.has(callReference.methodId)) {
            // The method is moving too.
            return;
          }
          const owner = this.getMethodOwner(callReference.target, callReference.mechanismId);
          if (!owner) {
            // The block was already broken.
            return;
          }
          let newTarget = this.getMethodCallTarget(owner, target);
          // A method that was called from within its own module might not be callable from
          // outside it, for example a method that overrides a base class method.
          if (newTarget && newTarget.kind !== 'within' && callReference.target === 'within' &&
              !this.isMethodCallableFromOutside(owner, callReference.methodId)) {
            newTarget = null;
          }
          if (!newTarget) {
            this.addBreakage(null, 'call', callReference.label);
          } else if (!isSameMethodCallTarget(callReference.target, callReference.mechanismId, newTarget)) {
            this.plan.movedBlockEdits.set(
                blockJson.id, (json) => setMethodCallTargetInBlockJson(json, newTarget));
          }
          return;
        }
        case 'component':
          this.analyzeComponent(
              blockJson, callReference.componentId, callReference.mechanismId, 'call',
              callReference.label, setComponentCallMechanismInBlockJson);
          return;
        case 'event':
          // Events can only be fired from the module that defines them.
          this.addBreakage(null, 'fireEvent', callReference.label);
          return;
      }
    }

    const componentReference = getComponentReferenceFromBlockJson(blockJson);
    if (componentReference) {
      this.analyzeComponent(
          blockJson, componentReference.componentId, componentReference.mechanismId,
          'componentReference', componentReference.label, setComponentReferenceMechanismInBlockJson);
      return;
    }

    const eventHandlerSender = getEventHandlerSenderFromBlockJson(blockJson);
    if (eventHandlerSender) {
      // Robot events are handled in opmodes. Mechanism events are handled in the robot and in
      // opmodes.
      const valid =
          eventHandlerSender.senderType === SenderType.ROBOT
              ? target.moduleType === storageModule.ModuleType.OPMODE
              : eventHandlerSender.senderType === SenderType.MECHANISM
                  ? target.moduleType !== storageModule.ModuleType.MECHANISM
                  : true;
      if (!valid) {
        this.addBreakage(null, 'eventHandler', eventHandlerSender.label);
      }
    }
  }

  /** Works out what to do with one of the moved blocks that refers to a component. */
  private analyzeComponent(
      blockJson: {[key: string]: any},
      componentId: string,
      mechanismId: string,
      kind: BreakageKind,
      label: string,
      setMechanism: (json: {[key: string]: any}, m: storageModuleContent.MechanismInRobot | null) => void): void {
    const source = this.plan.sourceModule;
    const target = this.plan.targetModule;

    let owner: Owner | null;
    let isPrivate = false;
    if (mechanismId) {
      const mechanismInRobot = this.getMechanismInRobot(mechanismId);
      owner = mechanismInRobot
          ? {kind: 'mechanism', moduleId: mechanismInRobot.moduleId, mechanismInRobot: mechanismInRobot}
          : null;
    } else if (source.moduleType === storageModule.ModuleType.MECHANISM) {
      owner = this.getModuleOwner(source);
      const content = this.contentByModuleId.get(source.moduleId);
      isPrivate = !!content && content.getPrivateComponents().some(c => c.componentId === componentId);
    } else {
      // Components used in the robot and in opmodes without a mechanism are robot components.
      owner = {kind: 'robot'};
    }
    if (!owner) {
      // The block was already broken.
      return;
    }

    const newMechanism = this.getComponentMechanism(owner, isPrivate, target);
    if (newMechanism === undefined) {
      this.addBreakage(null, kind, label, this.getRobotComponentToMove(owner, componentId));
    } else if ((newMechanism ? newMechanism.mechanismId : '') !== mechanismId) {
      this.plan.movedBlockEdits.set(blockJson.id, (json) => setMechanism(json, newMechanism));
    }
  }

  /** Works out what to do with a block outside the moved blocks that may call a moved method. */
  private analyzeCaller(
      module: storageModule.Module, blockJson: {[key: string]: any}, movedMethodIds: Set<string>): void {
    const callReference = getCallReferenceFromBlockJson(blockJson);
    if (!callReference || callReference.kind !== 'method' ||
        !movedMethodIds.has(callReference.methodId)) {
      return;
    }
    const newOwner = this.getModuleOwner(this.plan.targetModule);
    const newTarget = this.getMethodCallTarget(newOwner, module);
    if (!newTarget) {
      this.addBreakage(module.className, 'call', callReference.label);
      return;
    }
    if (isSameMethodCallTarget(callReference.target, callReference.mechanismId, newTarget)) {
      return;
    }
    let moduleEdits = this.plan.callerEdits.get(module.modulePath);
    if (!moduleEdits) {
      moduleEdits = {module: module, edits: new Map()};
      this.plan.callerEdits.set(module.modulePath, moduleEdits);
    }
    moduleEdits.edits.set(blockJson.id, (json) => setMethodCallTargetInBlockJson(json, newTarget));
  }

  private addBreakage(
      moduleName: string | null, kind: BreakageKind, label: string, fixedByMovingComponentId?: string): void {
    const breakage: Breakage = {moduleName: moduleName, kind: kind, label: label};
    if (fixedByMovingComponentId) {
      breakage.fixedByMovingComponentId = fixedByMovingComponentId;
    }
    this.plan.breakages.push(breakage);
  }

  /**
   * Returns the componentId of the given robot component if moving it into the target mechanism
   * would let the moved blocks use it, adding it to the components that can be moved.
   */
  private getRobotComponentToMove(owner: Owner, componentId: string): string | undefined {
    const target = this.plan.targetModule;
    if (owner.kind !== 'robot' || !this.canMoveRobotComponents || !this.robotContent ||
        target.moduleType !== storageModule.ModuleType.MECHANISM ||
        !this.getUniqueMechanismInRobot(target.moduleId)) {
      return undefined;
    }
    const component = this.robotContent.getComponents().find(c => c.componentId === componentId);
    if (!component) {
      return undefined;
    }
    if (!this.plan.componentsToMove.some(c => c.componentId === componentId)) {
      this.plan.componentsToMove.push(component);
    }
    return componentId;
  }

  /** Returns where a method called by one of the moved blocks is defined, or null if not found. */
  private getMethodOwner(target: 'within' | 'robot' | 'mechanism', mechanismId: string): Owner | null {
    switch (target) {
      case 'within':
        return this.getModuleOwner(this.plan.sourceModule);
      case 'robot':
        return {kind: 'robot'};
      case 'mechanism': {
        const mechanismInRobot = this.getMechanismInRobot(mechanismId);
        return mechanismInRobot
            ? {kind: 'mechanism', moduleId: mechanismInRobot.moduleId, mechanismInRobot: mechanismInRobot}
            : null;
      }
    }
  }

  /**
   * Returns the owner for things defined in the given module. For a mechanism, the owner includes
   * the mechanism's instance in the robot if the robot has exactly one.
   */
  private getModuleOwner(module: storageModule.Module): Owner {
    switch (module.moduleType) {
      case storageModule.ModuleType.ROBOT:
        return {kind: 'robot'};
      case storageModule.ModuleType.MECHANISM:
        return {
          kind: 'mechanism',
          moduleId: module.moduleId,
          mechanismInRobot: this.getUniqueMechanismInRobot(module.moduleId),
        };
      case storageModule.ModuleType.OPMODE:
        return {kind: 'opmode', moduleId: module.moduleId};
    }
  }

  /**
   * Returns how a block in the given module can call a method defined by the given owner, or null
   * if it can't.
   */
  private getMethodCallTarget(owner: Owner, from: storageModule.Module): MethodCallTarget | null {
    switch (owner.kind) {
      case 'robot':
        switch (from.moduleType) {
          case storageModule.ModuleType.ROBOT:
            return {kind: 'within'};
          case storageModule.ModuleType.OPMODE:
            return {kind: 'robot'};
          case storageModule.ModuleType.MECHANISM:
            // Mechanisms can't use the robot.
            return null;
        }
        return null;
      case 'mechanism':
        if (from.moduleId === owner.moduleId) {
          return {kind: 'within'};
        }
        if (from.moduleType !== storageModule.ModuleType.MECHANISM && owner.mechanismInRobot) {
          return {kind: 'mechanism', mechanismInRobot: owner.mechanismInRobot};
        }
        return null;
      case 'opmode':
        // Opmode methods can only be called from within the opmode.
        return from.moduleId === owner.moduleId ? {kind: 'within'} : null;
    }
  }

  /**
   * Returns which mechanism a block in the given module refers to a component defined by the given
   * owner through: null if the component is used directly, or undefined if the block can't use it.
   */
  private getComponentMechanism(
      owner: Owner, isPrivate: boolean,
      from: storageModule.Module): storageModuleContent.MechanismInRobot | null | undefined {
    switch (owner.kind) {
      case 'robot':
        return from.moduleType === storageModule.ModuleType.MECHANISM ? undefined : null;
      case 'mechanism':
        if (from.moduleId === owner.moduleId) {
          return null;
        }
        if (from.moduleType !== storageModule.ModuleType.MECHANISM && owner.mechanismInRobot &&
            !isPrivate) {
          return owner.mechanismInRobot;
        }
        return undefined;
      case 'opmode':
        return undefined;
    }
  }

  private isMethodCallableFromOutside(owner: Owner, methodId: string): boolean {
    let content: storageModuleContent.ModuleContent | null | undefined = null;
    if (owner.kind === 'robot') {
      content = this.robotContent;
    } else if (owner.kind === 'mechanism') {
      content = this.contentByModuleId.get(owner.moduleId);
    }
    // A module's content only has the methods that can be called from outside the module.
    return !!content && content.getMethods().some(m => m.methodId === methodId);
  }

  private getMechanismInRobot(mechanismId: string): storageModuleContent.MechanismInRobot | null {
    return this.mechanismsInRobot.find(m => m.mechanismId === mechanismId) || null;
  }

  /** Returns the mechanism's instance in the robot, or null if the robot has none or several. */
  private getUniqueMechanismInRobot(moduleId: string): storageModuleContent.MechanismInRobot | null {
    const instances = this.mechanismsInRobot.filter(m => m.moduleId === moduleId);
    return instances.length === 1 ? instances[0] : null;
  }
}

function isSameMethodCallTarget(
    target: 'within' | 'robot' | 'mechanism', mechanismId: string, newTarget: MethodCallTarget): boolean {
  return target === newTarget.kind &&
      (newTarget.kind !== 'mechanism' || newTarget.mechanismInRobot.mechanismId === mechanismId);
}

/** Wraps a single block's state so it can be used like the blocks JSON of a workspace. */
function wrapBlockState(blockState: Blockly.serialization.blocks.State): {[key: string]: any} {
  return {blocks: {languageVersion: 0, blocks: [blockState]}};
}

/**
 * Applies the given edits, by block id, to the given blocks JSON.
 *
 * @returns the number of blocks that were changed.
 */
export function applyBlockEdits(
    blocks: {[key: string]: any}, edits: Map<string, BlockEdit>): number {
  let count = 0;
  storageModuleContent.visitAllBlockJson(blocks, (blockJson) => {
    const edit = edits.get(blockJson.id);
    if (edit) {
      edit(blockJson);
      count++;
    }
  });
  return count;
}

/** Returns the moved blocks with their edits applied. */
export function getMovedBlockState(plan: MovePlan): Blockly.serialization.blocks.State {
  const blockState = structuredClone(plan.copyData.blockState);
  applyBlockEdits(wrapBlockState(blockState), plan.movedBlockEdits);
  return blockState;
}

/**
 * Saves every open module and works out everything that moving the given blocks will change.
 */
export async function prepareMove(
    storage: commonStorage.Storage,
    project: storageProject.Project,
    copyData: Blockly.clipboard.BlockCopyData,
    sourceBlockId: string | null,
    sourceModule: storageModule.Module,
    targetModule: storageModule.Module): Promise<MovePlan> {
  const modules: ModuleWithContent[] = [];
  for (const module of [project.robot, ...project.mechanisms, ...project.opModes]) {
    const editor = Editor.getEditorForModulePath(module.modulePath);
    const moduleContentText = editor
        ? await editor.saveModule()
        : await storage.fetchFileContentText(module.modulePath);
    modules.push({
      module: module,
      content: storageModuleContent.parseModuleContentText(moduleContentText),
    });
  }
  const canMoveRobotComponents = !!Editor.getEditorForModulePath(project.robot.modulePath);
  return analyzeMove(
      copyData, sourceBlockId, sourceModule, targetModule, modules, canMoveRobotComponents);
}

/**
 * Makes the changes in the given plan: moves the chosen robot components into the target
 * mechanism, changes the blocks that call moved methods, and removes the moved blocks from the
 * source module. The blocks aren't removed until everything else has worked.
 *
 * @returns the moved blocks to paste into the target module, and how many blocks outside the moved
 *     blocks were changed.
 */
export async function executeMove(
    storage: commonStorage.Storage,
    project: storageProject.Project,
    plan: MovePlan,
    moveComponents: boolean): Promise<{copyData: Blockly.clipboard.BlockCopyData, changedCount: number}> {
  let changedCount = 0;

  if (moveComponents && plan.componentsToMove.length > 0) {
    const robotEditor = Editor.getEditorForModulePath(project.robot.modulePath);
    if (!robotEditor) {
      throw new Error('executeMove: the robot is not open.');
    }
    for (const component of plan.componentsToMove) {
      const componentBlockId = findComponentBlockId(robotEditor, component.componentId);
      if (componentBlockId) {
        await moveComponentToMechanism(
            storage, project, robotEditor, componentBlockId, {mechanism: plan.targetModule});
      }
    }
  }

  for (const {module, edits} of plan.callerEdits.values()) {
    await mutateModuleBlocks(storage, module, (blocks) => {
      const count = applyBlockEdits(blocks, edits);
      changedCount += count;
      return count > 0;
    });
  }

  if (plan.sourceBlockId) {
    const sourceEditor = Editor.getEditorForModulePath(plan.sourceModule.modulePath);
    if (sourceEditor) {
      removeMovedBlocks(
          sourceEditor.getBlocklyWorkspace(), plan.sourceBlockId, plan.copyData.blockState);
      await sourceEditor.saveModule();
    }
  }

  return {
    copyData: {...plan.copyData, blockState: getMovedBlockState(plan)},
    changedCount: changedCount,
  };
}

function findComponentBlockId(robotEditor: Editor, componentId: string): string | null {
  for (const block of robotEditor.getBlocklyWorkspace().getBlocksByType(MRC_COMPONENT)) {
    if ((block as ComponentBlock).mrcComponentId === componentId) {
      return block.id;
    }
  }
  return null;
}

/** Removes the moved blocks from the source workspace. */
function removeMovedBlocks(
    workspace: Blockly.WorkspaceSvg, blockId: string,
    blockState: Blockly.serialization.blocks.State): void {
  const block = workspace.getBlockById(blockId);
  if (!block) {
    return;
  }
  // A drag takes the blocks after the dragged block with it, unless the drag healed the stack.
  // If it did, heal the stack again when removing the block.
  const healStack = !blockState.next && block.getNextBlock() !== null;
  Blockly.Events.setGroup(true);
  try {
    block.dispose(healStack);
  } finally {
    Blockly.Events.setGroup(false);
  }
}
