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
import { GeneratorContext } from './generator_context';
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

  private blocklyWorkspace: Blockly.WorkspaceSvg;
  private generatorContext: GeneratorContext;
  private storage: commonStorage.Storage;
  private currentModule: storageModule.Module | null = null;
  private currentProject: storageProject.Project | null = null;
  private modulePath: string = '';
  private robotPath: string = '';
  private moduleContentText: string = '';
  private robotContent: storageModuleContent.ModuleContent | null = null;
  private mechanismClassNameToModuleContent: {[mechanismClassName: string]: storageModuleContent.ModuleContent} = {};
  private bindedOnChange: any = null;
  private toolbox: Blockly.utils.toolbox.ToolboxDefinition = EMPTY_TOOLBOX;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg, generatorContext: GeneratorContext, storage: commonStorage.Storage) {
    Editor.workspaceIdToEditor[blocklyWorkspace.id] = this;
    this.blocklyWorkspace = blocklyWorkspace;
    this.generatorContext = generatorContext;
    this.storage = storage;
  }

  private onChangeWhileLoading(event: Blockly.Events.Abstract) {
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
    if (this.blocklyWorkspace.isDragging()) {
      return;
    }
    // TODO(lizlooney): do we need to do anything here?
  }

  public makeCurrent(): void {
    Editor.currentEditor = this;
  }

  public abandon(): void {
    if (Editor.currentEditor === this) {
      Editor.currentEditor = null;
    }
    if (this.blocklyWorkspace.id in Editor.workspaceIdToEditor) {
      delete Editor.workspaceIdToEditor[this.blocklyWorkspace.id];
    }
  }

  public async loadModuleBlocks(
      currentModule: storageModule.Module | null,
      currentProject: storageProject.Project | null) {
    this.generatorContext.setModule(currentModule);
    this.currentModule = currentModule;
    this.currentProject = currentProject;

    if (this.currentModule && this.currentProject) {
      this.modulePath = this.currentModule.modulePath;
      this.robotPath = this.currentProject.robot.modulePath;
    } else {
      this.modulePath = '';
      this.robotPath = '';
    }
    this.moduleContentText = '';
    this.robotContent = null;
    this.mechanismClassNameToModuleContent = {}
    this.clearBlocklyWorkspace();

    if (this.currentModule && this.currentProject) {
      // Fetch the content for the current module, the robot, and the mechanisms.
      const promises: { [modulePath: string]: Promise<string> } = {}; // value is promise of module content.
      promises[this.modulePath] = this.storage.fetchModuleContentText(this.modulePath);
      if (this.robotPath !== this.modulePath) {
        // Also fetch the robot module content. It contains components, etc, that can be used in OpModes.
        promises[this.robotPath] = this.storage.fetchModuleContentText(this.robotPath)
      }
      for (const mechanism of this.currentProject.mechanisms) {
        // Fetch the module content text for the mechanism.
        if (mechanism.modulePath !== this.modulePath) {
          promises[mechanism.modulePath] = this.storage.fetchModuleContentText(mechanism.modulePath)
        }
      }

      const modulePathToContentText: { [modulePath: string]: string } = {}; // value is module content
      await Promise.all(
        Object.entries(promises).map(async ([modulePath, promise]) => {
          modulePathToContentText[modulePath] = await promise;
        })
      );
      this.moduleContentText = modulePathToContentText[this.modulePath];
      this.robotContent = storageModuleContent.parseModuleContentText(
          (this.robotPath === this.modulePath)
              ? this.moduleContentText
              : modulePathToContentText[this.robotPath]);
      for (const mechanism of this.currentProject.mechanisms) {
        this.mechanismClassNameToModuleContent[mechanism.className] =
            storageModuleContent.parseModuleContentText(
                (mechanism.modulePath === this.modulePath)
                    ? this.moduleContentText
                    : modulePathToContentText[mechanism.modulePath]);
      }
      this.loadBlocksIntoBlocklyWorkspace();
    }
  }

  private clearBlocklyWorkspace() {
    if (this.bindedOnChange) {
      this.blocklyWorkspace.removeChangeListener(this.bindedOnChange);
    }
    this.blocklyWorkspace.hideChaff();
    this.blocklyWorkspace.clear();
    this.blocklyWorkspace.scroll(0, 0);
    this.setToolbox(EMPTY_TOOLBOX);
  }

  private setToolbox(toolbox: Blockly.utils.toolbox.ToolboxDefinition) {
    if (toolbox != this.toolbox) {
      this.toolbox = toolbox;
      this.blocklyWorkspace.updateToolbox(toolbox);
      //    testAllBlocksInToolbox(toolbox);
    }
  }

  private loadBlocksIntoBlocklyWorkspace() {
    // Add the while-loading listener.
    this.bindedOnChange = this.onChangeWhileLoading.bind(this);
    this.blocklyWorkspace.addChangeListener(this.bindedOnChange);
    const moduleContent = storageModuleContent.parseModuleContentText(this.moduleContentText);
    Blockly.serialization.workspaces.load(moduleContent.getBlocks(), this.blocklyWorkspace);
  }

  public updateToolbox(shownPythonToolboxCategories: Set<string>): void {
    if (this.currentModule) {
      if (!this.robotContent) {
        // The Robot content hasn't been fetched yet. Try again in a bit.
        setTimeout(() => {
          this.updateToolbox(shownPythonToolboxCategories)
        }, 50);
        return;
      }
      this.setToolbox(getToolboxJSON(shownPythonToolboxCategories, this));
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

  public getCurrentModuleType(): storageModule.ModuleType | null {
    if (this.currentModule) {
      return this.currentModule.moduleType;
    }
    return null;
  }

  private getModuleContentText(): string {
    if (!this.currentModule) {
      throw new Error('getModuleContentText: this.currentModule is null.');
    }

    // Generate python because some parts of components, events, and methods are affected.
    extendedPythonGenerator.init(this.blocklyWorkspace);
    extendedPythonGenerator.mrcWorkspaceToCode(this.blocklyWorkspace, this.generatorContext);

    const blocks = Blockly.serialization.workspaces.save(this.blocklyWorkspace);
    const mechanisms: storageModuleContent.MechanismInRobot[] = this.getMechanismsFromWorkspace();
    const components: storageModuleContent.Component[] = this.getComponentsFromWorkspace();
    const events: storageModuleContent.Event[] = this.getEventsFromWorkspace();
    const methods: storageModuleContent.Method[] = (
        this.currentModule?.moduleType === storageModule.ModuleType.ROBOT ||
        this.currentModule?.moduleType === storageModule.ModuleType.MECHANISM)
        ? this.getMethodsForOutsideFromWorkspace()
        : [];
    return storageModuleContent.makeModuleContentText(
      this.currentModule, blocks, mechanisms, components, events, methods);
  }

  public getMechanismsFromWorkspace(): storageModuleContent.MechanismInRobot[] {
    const mechanisms: storageModuleContent.MechanismInRobot[] = [];
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT) {
      mechanismComponentHolder.getMechanisms(this.blocklyWorkspace, mechanisms);
    }
    return mechanisms;
  }

  public getComponentsFromWorkspace(): storageModuleContent.Component[] {
    const components: storageModuleContent.Component[] = [];
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT ||
        this.currentModule?.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getComponents(this.blocklyWorkspace, components);
    }
    return components;
  }

  public getMethodsForWithinFromWorkspace(): storageModuleContent.Method[] {
    const methods: storageModuleContent.Method[] = [];
    classMethodDef.getMethodsForWithin(this.blocklyWorkspace, methods);
    return methods;
  }

  public getMethodsForOutsideFromWorkspace(): storageModuleContent.Method[] {
    const methods: storageModuleContent.Method[] = [];
    classMethodDef.getMethodsForOutside(this.blocklyWorkspace, methods);
    return methods;
  }

  public getMethodNamesAlreadyOverriddenInWorkspace(): string[] {
    const methodNamesAlreadyOverridden: string[] = [];
    classMethodDef.getMethodNamesAlreadyOverriddenInWorkspace(
        this.blocklyWorkspace, methodNamesAlreadyOverridden);
    return methodNamesAlreadyOverridden;
  }

  public getEventsFromWorkspace(): storageModuleContent.Event[] {
    const events: storageModuleContent.Event[] = [];
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT ||
        this.currentModule?.moduleType === storageModule.ModuleType.MECHANISM) {
      mechanismComponentHolder.getEvents(this.blocklyWorkspace, events);
    }
    return events;
  }

  public getRobotEventHandlersAlreadyInWorkspace(): eventHandler.EventHandlerBlock[] {
    const eventHandlerBlocks: eventHandler.EventHandlerBlock[] = [];
    eventHandler.getRobotEventHandlerBlocks(this.blocklyWorkspace, eventHandlerBlocks);
    return eventHandlerBlocks;
  }

  public getMechanismEventHandlersAlreadyInWorkspace(
      mechanismInRobot: storageModuleContent.MechanismInRobot): eventHandler.EventHandlerBlock[] {
    const eventHandlerBlocks: eventHandler.EventHandlerBlock[] = [];
    eventHandler.getMechanismEventHandlerBlocks(
        this.blocklyWorkspace, mechanismInRobot.mechanismId, eventHandlerBlocks);
    return eventHandlerBlocks;
  }

  public async saveBlocks() {
    const moduleContentText = this.getModuleContentText();
    try {
      await this.storage.saveModule(this.modulePath, moduleContentText);
      this.moduleContentText = moduleContentText;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Returns the mechanisms defined in the robot.
   */
  public getMechanismsFromRobot(): storageModuleContent.MechanismInRobot[] {
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT) {
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
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT) {
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
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT) {
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
    if (this.currentModule?.moduleType === storageModule.ModuleType.ROBOT) {
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
    return this.currentProject ? this.currentProject.mechanisms : [];
  }

  /**
   * Returns the Mechanism matching the given MechanismInRobot.
   */
  public getMechanism(mechanismInRobot: storageModuleContent.MechanismInRobot): storageModule.Mechanism | null {
    if (this.currentProject) {
      for (const mechanism of this.currentProject.mechanisms) {
        const fullClassName = storageNames.pascalCaseToSnakeCase(mechanism.className) + '.' + mechanism.className;
        if (fullClassName === mechanismInRobot.className) {
          return mechanism;
        }
      }
    }
    return null;
  }

  /**
   * Returns the components defined in the given mechanism.
   */
  public getComponentsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Component[] {
    if (this.currentModule?.modulePath === mechanism.modulePath) {
      return this.getComponentsFromWorkspace();
    }
    if (mechanism.className in this.mechanismClassNameToModuleContent) {
      return this.mechanismClassNameToModuleContent[mechanism.className].getComponents();
    }
    throw new Error('getComponentsFromMechanism: mechanism not found: ' + mechanism.className);
  }

  /**
   * Returns the events defined in the given mechanism.
   */
  public getEventsFromMechanism(mechanism: storageModule.Mechanism): storageModuleContent.Event[] {
    if (this.currentModule?.modulePath === mechanism.modulePath) {
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
    if (this.currentModule?.modulePath === mechanism.modulePath) {
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

    // If the workspace id was not found, it might be because the workspace is associated with a block mutator's flyout.
    // Try this workspaces's root workspace.
    const rootWorkspace = workspace.getRootWorkspace();
    if (rootWorkspace &&
        rootWorkspace.id in Editor.workspaceIdToEditor) {
      return Editor.workspaceIdToEditor[rootWorkspace.id];
    }

    // Otherwise, return the current editor.
    return Editor.currentEditor;
  }

  public static getCurrentEditor(): Editor | null {
    return Editor.currentEditor;
  }
}
