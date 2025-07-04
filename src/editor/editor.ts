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

//import { testAllBlocksInToolbox } from '../toolbox/toolbox_tests';
import { MethodsCategory} from '../toolbox/methods_category';
import { EventsCategory} from '../toolbox/event_category';
import { getToolboxJSON } from '../toolbox/toolbox';

const EMPTY_TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
   kind: 'categoryToolbox',
   contents: [],
};

export class Editor {
  private static workspaceIdToEditor: {[key: string]: Editor} = {};

  private blocklyWorkspace: Blockly.WorkspaceSvg;
  private generatorContext: GeneratorContext;
  private storage: commonStorage.Storage;
  private methodsCategory: MethodsCategory;
  private eventsCategory: EventsCategory;
  private currentModule: commonStorage.Module | null = null;
  private modulePath: string = '';
  private robotPath: string = '';
  private moduleContent: string = '';
  private robotContent: string = '';
  private bindedOnChange: any = null;
  private toolbox: Blockly.utils.toolbox.ToolboxDefinition = EMPTY_TOOLBOX;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg, generatorContext: GeneratorContext, storage: commonStorage.Storage) {
    Editor.workspaceIdToEditor[blocklyWorkspace.id] = this;
    this.blocklyWorkspace = blocklyWorkspace;
    this.generatorContext = generatorContext;
    this.storage = storage;
    this.methodsCategory = new MethodsCategory(blocklyWorkspace);
    this.eventsCategory = new EventsCategory(blocklyWorkspace);
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

    // TODO(lizlooney): As blocks are loaded, determine whether any blocks
    // are accessing variable or calling functions thar are defined in another
    // blocks file (like the Robot) and check whether the variable or function
    // definition has changed. This might happen if the user defines a variable
    // or function in the Robot, uses the variable or function in the
    // OpMode, and then removes or changes the variable or function in the
    // Robot.

    // TODO(lizlooney): We will need a way to identify which variable or
    // function, other than by the variable name or function name, because the
    // user might change the name. This will take some thought and I should
    // write up a design doc and discuss it with others to make sure we have a
    // good solution.

    // TODO(lizlooney): Look at blocks with type 'mrc_get_python_variable' or
    // 'mrc_set_python_variable', and where block.mrcExportedVariable === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // It could be from the Robot (or a Mechanism?) and we already have the Robot content.
    // Check whether block.mrcActualVariableName matches any exportedBlock's
    // extraState.actualVariableName. If there is no match, put a warning on the
    // block.

    // TODO(lizlooney): Look at blocks with type 'mrc_call_python_function' and
    // where block.mrcExportedFunction === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // It could be from the Robot (or a Mechanism?) and we already have the Robot content.
    // Check whether block.mrcActualFunctionName matches any exportedBlock's
    // extraState.actualFunctionName. If there is no match, put a warning on the block.
    // If there is a match, check whether
    // block.mrcArgs.length === exportedBlock.extraState.args.length and
    // block.mrcArgs[i].name === exportedBlock.extraState.args[i].name for all args.
    // If there is any differences, put a warning on the block.
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

  public async loadModuleBlocks(currentModule: commonStorage.Module | null) {
    this.generatorContext.setModule(currentModule);
    this.currentModule = currentModule;
    this.methodsCategory.setCurrentModule(currentModule);
    this.eventsCategory.setCurrentModule(currentModule);

    if (currentModule) {
      this.modulePath = currentModule.modulePath;
      this.robotPath = commonStorage.makeRobotPath(currentModule.projectName);
    } else {
      this.modulePath = '';
      this.robotPath = '';
    }
    this.moduleContent = '';
    this.robotContent = '';
    this.clearBlocklyWorkspace();

    if (currentModule) {
      // Fetch the content for the current module and the robot.
      // TODO: Also fetch the content for the mechanisms?
      const promises: {[key: string]: Promise<string>} = {}; // key is module path, value is promise of module content.
      promises[this.modulePath] = this.storage.fetchModuleContent(this.modulePath);
      if (this.robotPath !== this.modulePath) {
        // Also fetch the robot module content. It contains components, etc, that can be used.
        promises[this.robotPath] = this.storage.fetchModuleContent(this.robotPath)
      }

      const moduleContents: {[key: string]: string} = {}; // key is module path, value is module content
      await Promise.all(
        Object.entries(promises).map(async ([modulePath, promise]) => {
          moduleContents[modulePath] = await promise;
        })
      );
      this.moduleContent = moduleContents[this.modulePath];
      if (this.robotPath === this.modulePath) {
        this.robotContent = this.moduleContent
      } else {
        this.robotContent = moduleContents[this.robotPath];
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
    const blocksContent = commonStorage.extractBlocksContent(this.moduleContent);
    if (blocksContent) {
      Blockly.serialization.workspaces.load(JSON.parse(blocksContent), this.blocklyWorkspace);
    }
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
      this.setToolbox(
        getToolboxJSON(
          shownPythonToolboxCategories, this.currentModule));
    }
  }

  public isModified(): boolean {
    /*
    // This code is helpful for debugging issues where the editor says
    // 'Blocks have been modified!'.
    if (this.getModuleContent() !== this.moduleContent) {
      console.log('isModified will return true');
      console.log('this.getModuleContent() is ' + this.getModuleContent());
      console.log('this.moduleContent is ' + this.moduleContent);
    }
    */
    return this.getModuleContent() !== this.moduleContent;
  }

  private getModuleContent(): string {
    if (!this.currentModule) {
      throw new Error('getModuleContent: this.currentModule is null.');
    }
    const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(
        this.blocklyWorkspace, this.generatorContext);
    const exportedBlocks = JSON.stringify(this.generatorContext.getExportedBlocks());
    const blocksContent = JSON.stringify(
        Blockly.serialization.workspaces.save(this.blocklyWorkspace));
    const componentsContent = JSON.stringify(this.getComponents());
    return commonStorage.makeModuleContent(
        this.currentModule, pythonCode, blocksContent, exportedBlocks, componentsContent);
  }

  private getComponents(): commonStorage.Component[] {
    const components: commonStorage.Component[] = [];
    if (this.currentModule?.moduleType === commonStorage.MODULE_TYPE_ROBOT ||
        this.currentModule?.moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
      // TODO(lizlooney): Fill the components array.
    }
    return components;
  }

  public async saveBlocks() {
    const moduleContent = this.getModuleContent();
    try {
      await this.storage.saveModule(this.modulePath, moduleContent);
      this.moduleContent = moduleContent;
    } catch (e) {
      throw e;
    }
  }
}
