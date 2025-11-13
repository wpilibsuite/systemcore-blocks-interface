/**
 * @license
 * Copyright 2024 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly/core';

import { extendedPythonGenerator } from './extended_python_generator';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageNames from '../storage/names';
import * as storageProject from '../storage/project';
import * as eventHandler from '../blocks/mrc_event_handler';
import * as classMethodDef from '../blocks/mrc_class_method_def';
import * as opmodeDetails from '../blocks/mrc_opmode_details';
import * as blockSteps from '../blocks/mrc_steps';
import * as mechanismComponentHolder from '../blocks/mrc_mechanism_component_holder';
import * as workspaces from '../blocks/utils/workspaces';
//import { testAllBlocksInToolbox } from '../toolbox/toolbox_tests';
import { applyExpandedCategories, getToolboxJSON } from '../toolbox/toolbox';

const EMPTY_TOOLBOX: Blockly.utils.toolbox.ToolboxInfo = {
  kind: 'categoryToolbox',
  contents: [],
};

const MRC_ON_LOAD = 'mrcOnLoad';
const MRC_ON_MOVE = 'mrcOnMove';
const MRC_ON_DESCENDANT_DISCONNECT = 'mrcOnDescendantDisconnect';
const MRC_ON_ANCESTOR_MOVE = 'mrcOnAncestorMove';
const MRC_ON_MODULE_CURRENT = 'mrcOnModuleCurrent';
const MRC_ON_MUTATOR_OPEN = 'mrcOnMutatorOpen';

export class Editor {
  private static workspaceIdToEditor: { [workspaceId: string]: Editor } = {};
  private static currentEditor: Editor | null = null;

  private readonly blocklyWorkspace: Blockly.WorkspaceSvg;
  private readonly module: storageModule.Module;
  private readonly projectName: string;
  private readonly storage: commonStorage.Storage;
  private readonly modulePath: string;
  private readonly robotPath: string;
  private moduleContentText: string;
  private modulePathToModuleContent: {[modulePath: string]: storageModuleContent.ModuleContent} = {};
  private robotContent: storageModuleContent.ModuleContent | null = null;
  private mechanisms: storageModule.Mechanism[] = [];
  private mechanismClassNameToModuleContent: {[mechanismClassName: string]: storageModuleContent.ModuleContent} = {};
  private bindedOnChange: any = null;
  private shownPythonToolboxCategories: Set<string> | null = null;
  private toolbox: Blockly.utils.toolbox.ToolboxInfo = EMPTY_TOOLBOX;

  constructor(
      blocklyWorkspace: Blockly.WorkspaceSvg,
      module: storageModule.Module,
      project: storageProject.Project,
      storage: commonStorage.Storage,
      modulePathToContentText: {[modulePath: string]: string}) {
    workspaces.addWorkspace(blocklyWorkspace, module.moduleType);
    this.blocklyWorkspace = blocklyWorkspace;
    this.module = module;
    this.projectName = project.projectName;
    this.storage = storage;
    this.modulePath = module.modulePath;
    this.robotPath = project.robot.modulePath;
    this.moduleContentText = modulePathToContentText[module.modulePath];
    this.parseModules(project, modulePathToContentText);
    Editor.workspaceIdToEditor[blocklyWorkspace.id] = this;
  }

  private onChangeWhileLoading(event: Blockly.Events.Abstract) {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      return;
    }
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      this.onFinishedLoading();
      return;
    }

    // Look at mrc_call_python_function blocks that might need updating if the
    // function definition has changed.
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      const blockCreateEvent = event as Blockly.Events.BlockCreate;
      if (blockCreateEvent.ids) {
        blockCreateEvent.ids.forEach(id => {
          const block = this.blocklyWorkspace.getBlockById(id);
          if (block) {
            if (MRC_ON_LOAD in block && typeof block[MRC_ON_LOAD] === 'function') {
              block[MRC_ON_LOAD](this);
            }
          }
        });
      }
    }
  }

  private onFinishedLoading(): void {
    // Remove the while-loading listener.
    this.blocklyWorkspace.removeChangeListener(this.bindedOnChange);

    // Add the after-loading listener.
    this.bindedOnChange = this.onChangeAfterLoading.bind(this);
    this.blocklyWorkspace.addChangeListener(this.bindedOnChange);

    if (this.module.moduleType === storageModule.ModuleType.OPMODE) {
      opmodeDetails.checkOpMode(this.blocklyWorkspace, this);
    }
  }

  private onChangeAfterLoading(event: Blockly.Events.Abstract) {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      return;
    }
    if (this.blocklyWorkspace.isDragging()) {
      return;
    }

    if (event.type === Blockly.Events.BLOCK_MOVE) {
      const blockMoveEvent = event as Blockly.Events.BlockMove;
      const reason: string[] = blockMoveEvent.reason ?? [];
      if (reason.includes('disconnect') && blockMoveEvent.oldParentId) {
        const oldParent = this.blocklyWorkspace.getBlockById(blockMoveEvent.oldParentId!);
        if (oldParent) {
          const rootBlock = oldParent.getRootBlock();
          if (rootBlock) {
            // Call MRC_ON_DESCENDANT_DISCONNECT on the root block of the block that was disconnected.
            if (MRC_ON_DESCENDANT_DISCONNECT in rootBlock && typeof rootBlock[MRC_ON_DESCENDANT_DISCONNECT] === 'function') {
              rootBlock[MRC_ON_DESCENDANT_DISCONNECT]();
            }
          }
        }
      }

      const block = this.blocklyWorkspace.getBlockById(blockMoveEvent.blockId!);
      if (!block) {
        return;
      }
      // Call MRC_ON_MOVE on the block that was moved.
      if (MRC_ON_MOVE in block && typeof block[MRC_ON_MOVE] === 'function') {
        block[MRC_ON_MOVE](reason);
      }
      // Call MRC_ON_ANCESTOR_MOVE on all descendents of the block that was moved.
      block.getDescendants(false).forEach(descendant => {
        if (MRC_ON_ANCESTOR_MOVE in descendant && typeof descendant[MRC_ON_ANCESTOR_MOVE] === 'function') {
          descendant[MRC_ON_ANCESTOR_MOVE]();
        }
      });
    }
    if (event.type === Blockly.Events.BUBBLE_OPEN) {
      const bubbleOpenEvent = event as Blockly.Events.BubbleOpen;
      if (bubbleOpenEvent.bubbleType === 'mutator' && bubbleOpenEvent.isOpen) {
        const block = this.blocklyWorkspace.getBlockById(bubbleOpenEvent.blockId!);
        if (!block) {
          return;
        }
        // Call MRC_ON_MUTATOR_OPEN on the block.
        if (MRC_ON_MUTATOR_OPEN in block && typeof block[MRC_ON_MUTATOR_OPEN] === 'function') {
          block[MRC_ON_MUTATOR_OPEN]();
        }
      }
    }

    if (this.module.moduleType === storageModule.ModuleType.OPMODE) {
      opmodeDetails.checkOpMode(this.blocklyWorkspace, this);
    }
  }

  public makeCurrent(
      project: storageProject.Project,
      modulePathToContentText: {[modulePath: string]: string}): void {
    Editor.currentEditor = this;

    // Parse modules since they might have changed.
    this.parseModules(project, modulePathToContentText);
    this.updateToolboxImpl();

    // Go through all the blocks in the workspace and call their mrcOnModuleCurrent method.
    this.blocklyWorkspace.getAllBlocks().forEach(block => {
      if (MRC_ON_MODULE_CURRENT in block && typeof block[MRC_ON_MODULE_CURRENT] === 'function') {
        block[MRC_ON_MODULE_CURRENT](this);
      }
    });
  }

  public abandon(): void {
    workspaces.removeWorkspace(this.blocklyWorkspace);
    if (Editor.currentEditor === this) {
      Editor.currentEditor = null;
    }
    if (this.blocklyWorkspace.id in Editor.workspaceIdToEditor) {
      delete Editor.workspaceIdToEditor[this.blocklyWorkspace.id];
    }
  }

  private parseModules(
      project: storageProject.Project,
      modulePathToContentText: {[modulePath: string]: string}): void {
    // Parse the modules.
    this.modulePathToModuleContent = {}
    for (const modulePath in modulePathToContentText) {
      const moduleContentText = modulePathToContentText[modulePath];
      this.modulePathToModuleContent[modulePath] = storageModuleContent.parseModuleContentText(
          moduleContentText);
    }

    this.robotContent = this.modulePathToModuleContent[this.robotPath];

    this.mechanisms = project.mechanisms;
    this.mechanismClassNameToModuleContent = {};
    for (const mechanism of this.mechanisms) {
      const moduleContent = this.modulePathToModuleContent[mechanism.modulePath];
      if (!moduleContent) {
        console.error(this.modulePath + ' editor.parseModules - modulePathToModuleContent["' +
            mechanism.modulePath + '"] is undefined');
        continue;
      }
      this.mechanismClassNameToModuleContent[mechanism.className] = moduleContent;
    }
  }

  public loadModuleBlocks() {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      return;
    }
    // Add the while-loading listener.
    this.bindedOnChange = this.onChangeWhileLoading.bind(this);
    this.blocklyWorkspace.addChangeListener(this.bindedOnChange);
    const moduleContent = this.modulePathToModuleContent[this.modulePath];
    Blockly.serialization.workspaces.load(moduleContent.getBlocks(), this.blocklyWorkspace);
  }

  public updateToolbox(shownPythonToolboxCategories: Set<string>): void {
    this.shownPythonToolboxCategories = shownPythonToolboxCategories;
    this.updateToolboxImpl();
  }

  private updateToolboxImpl(): void {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      return;
    }
    const toolbox = getToolboxJSON(this.shownPythonToolboxCategories, this);
    const previousToolbox = this.blocklyWorkspace.getToolbox();
    if (previousToolbox) {
      applyExpandedCategories(previousToolbox, toolbox);
    }
    if (toolbox != this.toolbox) {
      this.toolbox = toolbox;
      this.blocklyWorkspace.updateToolbox(toolbox);
      // testAllBlocksInToolbox(toolbox, this.module.moduleType);
    }
  }

  public isModified(): boolean {
    /*
    // This code is helpful for debugging issues where the editor says
    // 'Blocks have been modified!'.
    if (this.getModuleContentText() !== this.moduleContentText) {
      console.log('isModified will return true');
      console.log('this.getModuleContentText() is ' + this.getModuleContentText());
      console.log('this.moduleContentText is ' + this.moduleContentText);
    }
    */
    return this.getModuleContentText() !== this.moduleContentText;
  }

  public getBlocklyWorkspace(): Blockly.WorkspaceSvg {
    return this.blocklyWorkspace;
  }

  public getModuleType(): storageModule.ModuleType {
    return this.module.moduleType;
  }

  private getModuleContentText(): string {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('getModuleContentText: this.blocklyWorkspace has been disposed.');
    }

    // Generate python because some parts of components, events, and methods are affected.
    extendedPythonGenerator.mrcWorkspaceToCode(this.blocklyWorkspace, this.module);

    const blocks = Blockly.serialization.workspaces.save(this.blocklyWorkspace);
    const mechanisms: storageModuleContent.MechanismInRobot[] = this.getMechanismsFromWorkspace();
    const components: storageModuleContent.Component[] = this.getComponentsFromWorkspace();
    const privateComponents: storageModuleContent.Component[] = this.getPrivateComponentsFromWorkspace();
    const events: storageModuleContent.Event[] = this.getEventsFromWorkspace();
    const methods: storageModuleContent.Method[] = (
        this.module.moduleType === storageModule.ModuleType.ROBOT ||
        this.module.moduleType === storageModule.ModuleType.MECHANISM)
        ? this.getMethodsForOutsideFromWorkspace()
        : [];
    return storageModuleContent.makeModuleContentText(
      this.module, blocks, mechanisms, components, privateComponents, events, methods);
  }

  private getMechanismsFromWorkspace(): storageModuleContent.MechanismInRobot[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const mechanisms: storageModuleContent.MechanismInRobot[] = [];
    if (this.module.moduleType === storageModule.ModuleType.ROBOT) {
      mechanismComponentHolder.getMechanisms(this.blocklyWorkspace, mechanisms);
    }
    return mechanisms;
  }

  private getComponentsFromWorkspace(): storageModuleContent.Component[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const components: storageModuleContent.Component[] = [];
    if (this.module.moduleType === storageModule.ModuleType.ROBOT ||
        this.module.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getComponents(this.blocklyWorkspace, components);
    }
    return components;
  }

  private getPrivateComponentsFromWorkspace(): storageModuleContent.Component[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const components: storageModuleContent.Component[] = [];
    if (this.module.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getPrivateComponents(this.blocklyWorkspace, components);
    }
    return components;
  }

  public getAllComponentsFromWorkspace(): storageModuleContent.Component[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const components: storageModuleContent.Component[] = [];
    if (this.module.moduleType === storageModule.ModuleType.ROBOT ||
        this.module.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getAllComponents(this.blocklyWorkspace, components);
    }
    return components;
  }

  public getMethodsForWithinFromWorkspace(): storageModuleContent.Method[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const methods: storageModuleContent.Method[] = [];
    classMethodDef.getMethodsForWithin(this.blocklyWorkspace, methods);
    return methods;
  }

  private getMethodsForOutsideFromWorkspace(): storageModuleContent.Method[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const methods: storageModuleContent.Method[] = [];
    classMethodDef.getMethodsForOutside(this.blocklyWorkspace, methods);
    return methods;
  }

  public getMethodNamesAlreadyOverriddenInWorkspace(): string[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const methodNamesAlreadyOverridden: string[] = [];
    classMethodDef.getMethodNamesAlreadyOverriddenInWorkspace(
        this.blocklyWorkspace, methodNamesAlreadyOverridden);
    return methodNamesAlreadyOverridden;
  }
  public isStepsInWorkspace(): boolean {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    return blockSteps.isStepsInWorkspace(this.blocklyWorkspace);
  }

  public getEventsFromWorkspace(): storageModuleContent.Event[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const events: storageModuleContent.Event[] = [];
    if (this.module.moduleType === storageModule.ModuleType.ROBOT ||
        this.module.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getEvents(this.blocklyWorkspace, events);
    }
    return events;
  }

  public getRobotEventHandlersAlreadyInWorkspace(): eventHandler.EventHandlerBlock[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const eventHandlerBlocks: eventHandler.EventHandlerBlock[] = [];
    eventHandler.getRobotEventHandlerBlocks(this.blocklyWorkspace, eventHandlerBlocks);
    return eventHandlerBlocks;
  }

  public getMechanismEventHandlersAlreadyInWorkspace(
      mechanismInRobot: storageModuleContent.MechanismInRobot): eventHandler.EventHandlerBlock[] {
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      throw new Error('this.blocklyWorkspace has been disposed.');
    }
    const eventHandlerBlocks: eventHandler.EventHandlerBlock[] = [];
    eventHandler.getMechanismEventHandlerBlocks(
        this.blocklyWorkspace, mechanismInRobot.mechanismId, eventHandlerBlocks);
    return eventHandlerBlocks;
  }

  public async saveModule(): Promise<string> {
    const moduleContentText = this.getModuleContentText();
    try {
      await this.storage.saveFile(this.modulePath, moduleContentText);
      this.moduleContentText = moduleContentText;
      await storageProject.saveProjectInfo(this.storage, this.projectName);
    } catch (e) {
      throw e;
    }
    return moduleContentText;
  }

  /**
   * Returns the mechanisms defined in the robot.
   */
  public getMechanismsFromRobot(): storageModuleContent.MechanismInRobot[] {
    if (this.module.moduleType === storageModule.ModuleType.ROBOT) {
      return this.getMechanismsFromWorkspace();
    }
    if (this.robotContent) {
      return this.robotContent.getMechanisms();
    }
    throw new Error('getMechanismsFromRobot: this.robotContent is null.');
  }

  /**
   * Returns the components defined in the robot.
   */
  public getComponentsFromRobot(): storageModuleContent.Component[] {
    if (this.module.moduleType === storageModule.ModuleType.ROBOT) {
      return this.getComponentsFromWorkspace();
    }
    if (this.robotContent) {
      return this.robotContent.getComponents();
    }
    throw new Error('getComponentsFromRobot: this.robotContent is null.');
  }

  /**
   * Returns the events defined in the robot.
   */
  public getEventsFromRobot(): storageModuleContent.Event[] {
    if (this.module.moduleType === storageModule.ModuleType.ROBOT) {
      return this.getEventsFromWorkspace();
    }
    if (this.robotContent) {
      return this.robotContent.getEvents();
    }
    throw new Error('getEventsFromRobot: this.robotContent is null.');
  }

  /**
   * Returns the methods defined in the robot.
   */
  public getMethodsFromRobot(): storageModuleContent.Method[] {
    if (this.module.moduleType === storageModule.ModuleType.ROBOT) {
      return this.getMethodsForWithinFromWorkspace();
    }
    if (this.robotContent) {
      return this.robotContent.getMethods();
    }
    throw new Error('getMethodsFromRobot: this.robotContent is null.');
  }

  /**
   * Returns the mechanisms in this project.
   */
  public getMechanisms(): storageModule.Mechanism[] {
    return this.mechanisms;
  }

  /**
   * Returns the Mechanism matching the given MechanismInRobot.
   */
  public getMechanism(mechanismInRobot: storageModuleContent.MechanismInRobot): storageModule.Mechanism | null {
    for (const mechanism of this.mechanisms) {
      const fullClassName = storageNames.pascalCaseToSnakeCase(mechanism.className) + '.' + mechanism.className;
      if (fullClassName === mechanismInRobot.className) {
        return mechanism;
      }
    }
    return null;
  }

  /**
   * Returns the regular components defined in the given mechanism.
   */
  public getComponentsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Component[] {
    if (this.module.modulePath === mechanism.modulePath) {
      return this.getComponentsFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      return this.mechanismClassNameToModuleContent[mechanism.className].getComponents();
    }
    throw new Error('getComponentsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  /**
   * Returns the private components defined in the given mechanism.
   */
  public getPrivateComponentsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Component[] {
    if (this.module.modulePath === mechanism.modulePath) {
      return this.getPrivateComponentsFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      return this.mechanismClassNameToModuleContent[mechanism.className].getPrivateComponents();
    }
    throw new Error('getPrivateComponentsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  /**
   * Returns ALL components (including private components) defined in the given mechanism.
   * This is used when creating mechanism blocks that need all components for port parameters.
   */
  public getAllComponentsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Component[] {
    if (this.module.modulePath === mechanism.modulePath) {
      return this.getAllComponentsFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      const moduleContent = this.mechanismClassNameToModuleContent[mechanism.className];
      const allComponents: storageModuleContent.Component[] = [
        ...moduleContent.getComponents(),
        ...moduleContent.getPrivateComponents(),
      ]
      return allComponents;
    }
    throw new Error('getAllComponentsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  /**
   * Returns the events defined in the given mechanism.
   */
  public getEventsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Event[] {
    if (this.module.modulePath === mechanism.modulePath) {
      return this.getEventsFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      return this.mechanismClassNameToModuleContent[mechanism.className].getEvents();
    }
    throw new Error('getEventsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  /**
   * Returns the methods defined in the given mechanism.
   */
  public getMethodsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Method[] {
    if (this.module.modulePath === mechanism.modulePath) {
      return this.getMethodsForWithinFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      return this.mechanismClassNameToModuleContent[mechanism.className].getMethods();
    }
    throw new Error('getMethodsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  public static getEditorForBlocklyWorkspace(workspace: Blockly.Workspace): Editor | null {
    if (workspace.id in Editor.workspaceIdToEditor) {
      return Editor.workspaceIdToEditor[workspace.id];
    }

    // If the workspace id was not found, it might be because the workspace is associated with a
    // block mutator's flyout. Try this workspaces's root workspace.
    const rootWorkspace = workspace.getRootWorkspace();
    if (rootWorkspace &&
        rootWorkspace.id in Editor.workspaceIdToEditor) {
      return Editor.workspaceIdToEditor[rootWorkspace.id];
    }

    console.error('getEditorForBlocklyWorkspace: workspace with id ' + workspace.id + ' is not associated with an editor.');
    return null;
  }

  public static getEditorForBlocklyWorkspaceId(workspaceId: string): Editor | null {
    const workspace = Blockly.Workspace.getById(workspaceId);
    return workspace ? Editor.getEditorForBlocklyWorkspace(workspace) : null;
  }

  public static getCurrentEditor(): Editor | null {
    return Editor.currentEditor;
  }
}
