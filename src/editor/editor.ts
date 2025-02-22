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
import { getToolboxJSON } from '../toolbox/toolbox';


const EMPTY_TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
   kind: 'categoryToolbox',
   contents: [],
};

export class Editor {
  private blocklyWorkspace: Blockly.WorkspaceSvg;
  private storage: commonStorage.Storage;
  private currentModule: commonStorage.Module | null = null;
  private modulePath: string = '';
  private projectPath: string = '';
  private moduleContent: string = '';
  private projectContent: string = '';
  private bindedOnChange: any = null;
  private toolbox: Blockly.utils.toolbox.ToolboxDefinition = EMPTY_TOOLBOX;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg, storage: commonStorage.Storage) {
    this.blocklyWorkspace = blocklyWorkspace;
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

    // TODO(lizlooney): As blocks are loaded, determine whether any blocks
    // are accessing variable or calling functions thar are defined in another
    // blocks file (like a Project) and check whether the variable or function
    // definition has changed. This might happen if the user defines a variable
    // or function in the Project, uses the variable or function in the
    // OpMode, and then removes or changes the variable or function in the
    // Project.

    // TODO(lizlooney): We will need a way to identify which variable or
    // function, other than by the variable name or function name, because the
    // user might change the name. This will take some thought and I should
    // write up a design doc and discuss it with others to make sure we have a
    // good solution.

    // TODO(lizlooney): Look at blocks with type 'mrc_get_python_variable' or
    // 'mrc_set_python_variable', and where block.mrcExportedVariable === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // (It should be the project and we already have the project content.)
    // Check whether block.mrcActualVariableName matches any exportedBlock's
    // extraState.actualVariableName. If there is no match, put a warning on the
    // block.

    // TODO(lizlooney): Look at blocks with type 'mrc_call_python_function' and
    // where block.mrcExportedFunction === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // (It should be the project and we already have the project content.)
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
    this.currentModule = currentModule;
    if (currentModule) {
      this.modulePath = currentModule.modulePath;
      this.projectPath = commonStorage.makeProjectPath(currentModule.projectName);
    } else {
      this.modulePath = '';
      this.projectPath = '';
    }
    this.moduleContent = '';
    this.projectContent = '';
    this.clearBlocklyWorkspace();

    if (currentModule) {
      const promises: {[key: string]: Promise<string>} = {}; // key is module path, value is promise of module content.
      promises[this.modulePath] = this.storage.fetchModuleContent(this.modulePath);
      if (this.projectPath !== this.modulePath) {
        // Also fetch the project module content. It contains exported blocks that can be used.
        promises[this.projectPath] = this.storage.fetchModuleContent(this.projectPath)
      }

      const moduleContents: {[key: string]: string} = {}; // key is module path, value is module content
      await Promise.all(
        Object.entries(promises).map(async ([modulePath, promise]) => {
          moduleContents[modulePath] = await promise;
        })
      );
      this.moduleContent = moduleContents[this.modulePath];
      if (this.projectPath === this.modulePath) {
        this.projectContent = this.moduleContent
      } else {
        this.projectContent = moduleContents[this.projectPath];
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
      if (this.currentModule.moduleType === commonStorage.MODULE_TYPE_PROJECT) {
        // If we are editing a Project, we don't add any additional blocks to
        // the toolbox.
        this.setToolbox(getToolboxJSON([], shownPythonToolboxCategories));
        return;
      }
      // Otherwise, we add the exported blocks from the Project.
      if (!this.projectContent) {
        // The Project content hasn't been fetched yet. Try again in a bit.
        setTimeout(() => {
          this.updateToolbox(shownPythonToolboxCategories)
        }, 50);
        return;
      }
      const exportedBlocks = commonStorage.extractExportedBlocks(
         this.currentModule.projectName, this.projectContent);
      this.setToolbox(getToolboxJSON(exportedBlocks, shownPythonToolboxCategories));
    }
  }

  public isModified(): boolean {
    return this.getModuleContent() !== this.moduleContent;
  }

  private getModuleContent(): string {
    extendedPythonGenerator.setCurrentModule(this.currentModule);
    const pythonCode = extendedPythonGenerator.workspaceToCode(this.blocklyWorkspace);
    const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(this.blocklyWorkspace));
    const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(this.blocklyWorkspace));
    return commonStorage.makeModuleContent(this.currentModule, pythonCode, exportedBlocks, blocksContent);
  }

  public async saveBlocks(): void {
    const moduleContent = this.getModuleContent();
    try {
      await this.storage.saveModule(this.modulePath, moduleContent);
      this.moduleContent = moduleContent;
    } catch (e: Error) {
      throw e;
    }
  }
}
