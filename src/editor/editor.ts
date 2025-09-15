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
import * as mechanismComponentHolder from '../blocks/mrc_mechanism_component_holder';
//import { testAllBlocksInToolbox } from '../toolbox/toolbox_tests';
import { getToolboxJSON } from '../toolbox/toolbox';

const EMPTY_TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [],
};

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
  private toolbox: Blockly.utils.toolbox.ToolboxDefinition = EMPTY_TOOLBOX;

  constructor(
      blocklyWorkspace: Blockly.WorkspaceSvg,
      module: storageModule.Module,
      project: storageProject.Project,
      storage: commonStorage.Storage,
      modulePathToContentText: {[modulePath: string]: string}) {
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
      // Remove the while-loading listener.
      this.blocklyWorkspace.removeChangeListener(this.bindedOnChange);

      // Add the after-loading listener.
      this.bindedOnChange = this.onChangeAfterLoading.bind(this);
      this.blocklyWorkspace.addChangeListener(this.bindedOnChange);
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
            if ('mrcOnLoad' in block && typeof block.mrcOnLoad === "function") {
              block.mrcOnLoad();
            }
          }
        });
      }
    }
  }

  private onChangeAfterLoading(event: Blockly.Events.Abstract) {
    if (event.isUiEvent) {
      // UI events are things like scrolling, zooming, etc.
      return;
    }
    if (!this.blocklyWorkspace.rendered) {
      // This editor has been abandoned.
      return;
    }
    if (this.blocklyWorkspace.isDragging()) {
      return;
    }
    // TODO(lizlooney): do we need to do anything here?
  }

  public makeCurrent(
      project: storageProject.Project,
      modulePathToContentText: {[modulePath: string]: string}): void {
    Editor.currentEditor = this;

    // Parse modules since they might have changed.
    this.parseModules(project, modulePathToContentText);
    this.updateToolboxImpl();
  }

  public abandon(): void {
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
        console.error(this.modulePath + " editor.parseModules - modulePathToModuleContent['" +
            mechanism.modulePath + "'] is undefined");
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
    if (toolbox != this.toolbox) {
      this.toolbox = toolbox;
      this.blocklyWorkspace.updateToolbox(toolbox);
      // testAllBlocksInToolbox(toolbox);
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
   * Returns the components defined in the given mechanism.
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

  public static getEditorForBlocklyWorkspace(workspace: Blockly.Workspace, opt_returnCurrentIfNotFound?: boolean): Editor | null {
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

    return opt_returnCurrentIfNotFound ? Editor.currentEditor : null;
  }

  public static getEditorForBlocklyWorkspaceId(workspaceId: string): Editor | null {
    const workspace = Blockly.Workspace.getById(workspaceId);
    return workspace ? Editor.getEditorForBlocklyWorkspace(workspace) : null;
  }

  public static getCurrentEditor(): Editor | null {
    return Editor.currentEditor;
  }
}
