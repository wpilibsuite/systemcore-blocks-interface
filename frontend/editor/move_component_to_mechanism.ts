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
 * @fileoverview Moves a component out of the robot and into a mechanism, keeping the values the
 * user has already entered for the component's constructor args and keeping the blocks that call
 * the component's methods working.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { Editor } from './editor';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageProject from '../storage/project';
import {
    BLOCK_NAME as MRC_COMPONENT,
    ComponentBlock,
    INPUT_ARG_PREFIX as COMPONENT_INPUT_ARG_PREFIX } from '../blocks/mrc_component';
import {
    BLOCK_NAME as MRC_MECHANISM,
    FIELD_NAME as MECHANISM_FIELD_NAME,
    INPUT_ARG_PREFIX as MECHANISM_INPUT_ARG_PREFIX,
    MechanismBlock } from '../blocks/mrc_mechanism';
import {
    mrcAddComponentBlockToMechanismContent,
    mrcAddMechanismBlockToRobotBlocks } from '../blocks/mrc_mechanism_component_holder';
import { repointComponentCallsIntoMechanism } from '../blocks/mrc_call_python_function';

/**
 * Where the caller wants the component to go: either a mechanism that already exists, or a new
 * mechanism that should be created with the given class name.
 */
export type MoveComponentTarget =
    {mechanism: storageModule.Mechanism} |
    {newClassName: string};

/**
 * The result of a successful move, so that the caller can tell the user what happened.
 */
export type MoveComponentResult = {
  componentName: string,
  mechanismName: string,
  mechanism: storageModule.Mechanism,
  /** Whether the mechanism was created by this move, rather than already existing. */
  createdMechanism: boolean,
};

/**
 * Moves the component defined by the given mrc_component block in the robot into a mechanism,
 * creating the mechanism first if the target is a new one.
 */
export async function moveComponentToMechanism(
    storage: commonStorage.Storage,
    project: storageProject.Project,
    robotEditor: Editor,
    componentBlockId: string,
    target: MoveComponentTarget): Promise<MoveComponentResult> {
  if (robotEditor.getModuleType() !== storageModule.ModuleType.ROBOT) {
    throw new Error('moveComponentToMechanism: the editor is not the robot editor.');
  }

  // 1. Capture everything we need from the component block before anything reloads the workspace.
  const captured = captureComponent(robotEditor, componentBlockId);

  // 2. Create the mechanism if the user asked for a new one. addModuleToProject writes the new
  // module, adds it to project.mechanisms, and adds an mrc_mechanism block to the robot - both to
  // the robot's stored blocks and, through the callback, to the robot's live workspace.
  let mechanism: storageModule.Mechanism;
  if ('mechanism' in target) {
    mechanism = target.mechanism;
  } else {
    await storageProject.addModuleToProject(
        storage, project, storageModule.ModuleType.MECHANISM, target.newClassName,
        (newMechanism) => robotEditor.incorporateNewMechanism(newMechanism));
    const newModule = storageProject.findModuleByClassName(project, target.newClassName);
    if (!newModule) {
      throw new Error('moveComponentToMechanism: failed to create the mechanism ' + target.newClassName + '.');
    }
    mechanism = newModule;
  }

  // 3. Add the component to the mechanism.
  const componentInMechanism = await addComponentToMechanism(
      storage, robotEditor, mechanism, captured);

  // 4. Find the mrc_mechanism block in the robot that adds this mechanism to the robot, adding one
  // first if the robot doesn't have one.
  let mechanismBlock = findMechanismBlock(robotEditor, mechanism);
  if (!mechanismBlock) {
    robotEditor.reloadWithMutatedBlocks((blocks) => {
      mrcAddMechanismBlockToRobotBlocks(blocks, mechanism);
    });
    mechanismBlock = findMechanismBlock(robotEditor, mechanism);
    if (!mechanismBlock) {
      throw new Error('moveComponentToMechanism: failed to add an ' + MRC_MECHANISM +
          ' block for ' + mechanism.className + ' to the robot.');
    }
    // Let the block events from that reload be delivered before we reload the workspace again.
    await deliverBlocklyEvents();
  }
  const mechanismBlockId = mechanismBlock.id;
  const mechanismId = mechanismBlock.mrcMechanismId;
  const mechanismName = mechanismBlock.getFieldValue(MECHANISM_FIELD_NAME);

  // 5. Take the component block out of the robot and repoint the robot's own call blocks. Once
  // the workspace reloads, the mrc_mechanism block rebuilds its arg sockets to include the
  // component's args.
  robotEditor.reloadWithMutatedBlocks((blocks) => {
    removeBlockFromBlocks(blocks, componentBlockId);
    repointComponentCallsIntoMechanism(
        blocks, captured.component.componentId, mechanismId, mechanismName);
  });

  // 6. Rebuild the mrc_mechanism block's arg sockets so they include the component we just moved,
  // then put back the values the user had already entered on the component block. We can't wait
  // for the block's own mrcOnLoad to do the rebuild, because blockly delivers the block events
  // from the reload above asynchronously.
  rebuildMechanismBlockAndRestoreArgBlocks(robotEditor, mechanismBlockId, captured);

  await robotEditor.saveModule();
  robotEditor.updateToolboxAfterDelay();

  // 7. Repoint the call blocks in the op modes, including op modes that aren't open.
  await repointOpModes(
      storage, project, captured.component.componentId, mechanismId, mechanismName);

  return {
    componentName: componentInMechanism.name,
    mechanismName: mechanismName,
    mechanism: mechanism,
    createdMechanism: !('mechanism' in target),
  };
}

/**
 * Blockly delivers block events asynchronously, so a reload's events haven't been delivered to the
 * editor when the reload returns. Await this to let them be delivered.
 */
function deliverBlocklyEvents(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** What we need to remember about the component block before the robot workspace reloads. */
type CapturedComponent = {
  component: storageModuleContent.Component,
  importModule: string,
  tooltip: string,
  /**
   * The blocks that were plugged into the component block's arg sockets, serialized, indexed the
   * same way as component.args. An entry is null if that socket was empty.
   */
  argBlocks: (Blockly.serialization.blocks.State | null)[],
};

function captureComponent(robotEditor: Editor, componentBlockId: string): CapturedComponent {
  const workspace = robotEditor.getBlocklyWorkspace();
  const block: Blockly.Block | null = workspace.getBlockById(componentBlockId);
  if (!block || block.type !== MRC_COMPONENT) {
    throw new Error('moveComponentToMechanism: could not find the ' + MRC_COMPONENT +
        ' block with id ' + componentBlockId + '.');
  }
  const componentBlock = block as ComponentBlock;
  const component = componentBlock.getComponent();
  if (!component) {
    throw new Error('moveComponentToMechanism: the ' + MRC_COMPONENT + ' block has no component.');
  }

  const argBlocks: (Blockly.serialization.blocks.State | null)[] = [];
  for (let i = 0; i < component.args.length; i++) {
    const argInput = componentBlock.getInput(COMPONENT_INPUT_ARG_PREFIX + i);
    const argBlock = argInput && argInput.connection
        ? argInput.connection.targetBlock()
        : null;
    argBlocks.push(argBlock
        ? Blockly.serialization.blocks.save(argBlock, {addNextBlocks: false})
        : null);
  }

  return {
    component: component,
    importModule: componentBlock.mrcImportModule,
    tooltip: componentBlock.mrcTooltip,
    argBlocks: argBlocks,
  };
}

/**
 * Adds the component to the given mechanism's module, saves it, and makes sure both the mechanism's
 * live editor (if it has one) and the robot editor see the change.
 */
async function addComponentToMechanism(
    storage: commonStorage.Storage,
    robotEditor: Editor,
    mechanism: storageModule.Mechanism,
    captured: CapturedComponent): Promise<storageModuleContent.Component> {
  // If the mechanism is open in a tab, save it first so that we don't lose unsaved changes when we
  // read it from storage below.
  const mechanismEditor = Editor.getEditorForModulePath(mechanism.modulePath);
  if (mechanismEditor) {
    await mechanismEditor.saveModule();
  }

  const mechanismContent = storageModuleContent.parseModuleContentText(
      await storage.fetchFileContentText(mechanism.modulePath));
  const componentInMechanism = mrcAddComponentBlockToMechanismContent(
      mechanismContent, captured.component, captured.importModule, captured.tooltip);
  await storage.saveFile(mechanism.modulePath, mechanismContent.getModuleContentText());

  if (mechanismEditor) {
    mechanismEditor.reloadWithBlocks(mechanismContent.getBlocks());
  }
  // The mrc_mechanism block in the robot rebuilds its arg sockets from the mechanism's components,
  // so the robot editor has to see the updated mechanism before its workspace reloads.
  robotEditor.setMechanismModuleContent(mechanism.className, mechanismContent);

  return componentInMechanism;
}

function findMechanismBlock(
    robotEditor: Editor, mechanism: storageModule.Mechanism): MechanismBlock | null {
  const blocks: Blockly.Block[] = robotEditor.getBlocklyWorkspace().getBlocksByType(MRC_MECHANISM);
  for (const block of blocks) {
    const mechanismBlock = block as MechanismBlock;
    if (mechanismBlock.mrcMechanismModuleId === mechanism.moduleId) {
      return mechanismBlock;
    }
  }
  return null;
}

/**
 * Rebuilds the mrc_mechanism block so that it has arg sockets for the moved component, then moves
 * the blocks that were plugged into the component block's arg sockets onto the matching sockets of
 * the mrc_mechanism block, replacing the default values that the rebuild put there.
 */
function rebuildMechanismBlockAndRestoreArgBlocks(
    robotEditor: Editor, mechanismBlockId: string, captured: CapturedComponent): void {
  const workspace = robotEditor.getBlocklyWorkspace();
  const block: Blockly.Block | null = workspace.getBlockById(mechanismBlockId);
  if (!block) {
    return;
  }
  const mechanismBlock = block as MechanismBlock;
  // Add the arg sockets for the component that was just moved into the mechanism. This fills the
  // new sockets with default values, which we replace below.
  mechanismBlock.checkMechanism(robotEditor);
  for (let i = 0; i < mechanismBlock.mrcParameters.length; i++) {
    const parameter = mechanismBlock.mrcParameters[i];
    if (parameter.componentId !== captured.component.componentId ||
        parameter.componentArgsIndex === undefined) {
      continue;
    }
    const argBlockState = captured.argBlocks[parameter.componentArgsIndex];
    if (!argBlockState) {
      continue;
    }
    const argInput = mechanismBlock.getInput(MECHANISM_INPUT_ARG_PREFIX + i);
    if (!argInput || !argInput.connection) {
      continue;
    }
    // Get rid of the default value block that checkMechanism put here.
    const defaultBlock = argInput.connection.targetBlock();
    if (defaultBlock) {
      argInput.connection.disconnect();
      defaultBlock.dispose(false);
    }
    const argBlock = Blockly.serialization.blocks.append(argBlockState, workspace);
    if (argBlock.outputConnection) {
      argInput.connection.connect(argBlock.outputConnection);
    }
  }
}

/**
 * Repoints the blocks in every op mode that call a method on the moved component.
 */
async function repointOpModes(
    storage: commonStorage.Storage,
    project: storageProject.Project,
    componentId: string,
    mechanismId: string,
    mechanismName: string): Promise<void> {
  for (const opMode of project.opModes) {
    const opModeEditor = Editor.getEditorForModulePath(opMode.modulePath);
    if (opModeEditor) {
      const blocks = Blockly.serialization.workspaces.save(opModeEditor.getBlocklyWorkspace());
      if (repointComponentCallsIntoMechanism(blocks, componentId, mechanismId, mechanismName)) {
        opModeEditor.reloadWithBlocks(blocks);
        await opModeEditor.saveModule();
      }
      continue;
    }
    const moduleContent = storageModuleContent.parseModuleContentText(
        await storage.fetchFileContentText(opMode.modulePath));
    const blocks = moduleContent.getBlocks();
    if (repointComponentCallsIntoMechanism(blocks, componentId, mechanismId, mechanismName)) {
      moduleContent.setBlocks(blocks);
      await storage.saveFile(opMode.modulePath, moduleContent.getModuleContentText());
    }
  }
}

/**
 * Removes the block with the given id from the given workspace blocks JSON, healing the stack it
 * was in so that the block that followed it takes its place.
 */
function removeBlockFromBlocks(blocks: {[key: string]: any}, blockId: string): boolean {
  const topLevelBlocks = storageModuleContent.getTopLevelBlocksJson(blocks);
  for (let i = 0; i < topLevelBlocks.length; i++) {
    const topLevelBlock = topLevelBlocks[i];
    if (topLevelBlock.id === blockId) {
      const nextBlock = topLevelBlock.next ? topLevelBlock.next.block : null;
      if (nextBlock) {
        nextBlock.x = topLevelBlock.x;
        nextBlock.y = topLevelBlock.y;
        topLevelBlocks[i] = nextBlock;
      } else {
        topLevelBlocks.splice(i, 1);
      }
      return true;
    }
    if (removeBlockFromDescendants(topLevelBlock, blockId)) {
      return true;
    }
  }
  return false;
}

function removeBlockFromDescendants(blockJson: {[key: string]: any}, blockId: string): boolean {
  // Look at the block connected to each input.
  if (blockJson.inputs) {
    for (const inputName in blockJson.inputs) {
      const input = blockJson.inputs[inputName];
      if (input.block) {
        if (input.block.id === blockId) {
          const nextBlock = input.block.next ? input.block.next.block : null;
          if (nextBlock) {
            input.block = nextBlock;
          } else {
            delete input.block;
            if (!Object.keys(input).length) {
              delete blockJson.inputs[inputName];
            }
          }
          return true;
        }
        if (removeBlockFromDescendants(input.block, blockId)) {
          return true;
        }
      }
      if (input.shadow && removeBlockFromDescendants(input.shadow, blockId)) {
        return true;
      }
    }
  }
  // Look at the next block in the stack.
  if (blockJson.next && blockJson.next.block) {
    if (blockJson.next.block.id === blockId) {
      const nextBlock = blockJson.next.block.next ? blockJson.next.block.next.block : null;
      if (nextBlock) {
        blockJson.next.block = nextBlock;
      } else {
        delete blockJson.next;
      }
      return true;
    }
    return removeBlockFromDescendants(blockJson.next.block, blockId);
  }
  return false;
}
