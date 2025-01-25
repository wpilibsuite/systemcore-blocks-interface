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
import * as storage from '../storage/client_side_storage';
import * as commonStorage from '../storage/common_storage';
import { getToolboxJSON } from '../toolbox/toolbox';


const EMPTY_TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
   kind: 'categoryToolbox',
   contents: [],
};

export class Editor {
  private blocklyWorkspace: Blockly.WorkspaceSvg;
  private modulePath: string = '';
  private workspacePath: string = '';
  private moduleContent: string = '';
  private workspaceContent: string = '';
  private bindedOnChange: any = null;
  private toolbox: Blockly.utils.toolbox.ToolboxDefinition = EMPTY_TOOLBOX;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    this.blocklyWorkspace = blocklyWorkspace;
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
    // blocks file (like a Workspace) and check whether the variable or function
    // definition has changed. This might happen if the user defines a variable
    // or function in the Workspace, uses the variable or function in the
    // OpMode, and then removes or changes the variable or function in the
    // Workspace.

    // TODO(lizlooney): We will need a way to identify which variable or
    // function, other than by the variable name or function name, because the
    // user might change the name. This will take some thought and I should
    // write up a design doc and discuss it with others to make sure we have a
    // good solution.

    // TODO(lizlooney): Look at blocks with type 'mrc_get_python_variable' or
    // 'mrc_set_python_variable', and where block.mrcExportedVariable === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // (It should be the workspace and we already have the workspace content.)
    // Check whether block.mrcActualVariableName matches any exportedBlock's
    // extraState.actualVariableName. If there is no match, put a warning on the
    // block.

    // TODO(lizlooney): Look at blocks with type 'mrc_call_python_function' and
    // where block.mrcExportedFunction === true.
    // Look at block.mrcImportModule and get the exported blocks for that module.
    // (It should be the workspace and we already have the workspace content.)
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

  public loadModuleBlocks(modulePath: string, workspacePath: string) {
    this.modulePath = modulePath;
    this.workspacePath = workspacePath;
    this.moduleContent = '';
    this.workspaceContent = '';
    this.clearBlocklyWorkspace();

    if (modulePath) {
      storage.fetchModuleContent(
        this.modulePath,
        (moduleContent: string | null, errorMessage: string) => {
          if (errorMessage) {
            alert(errorMessage);
            return;
          }
          if (moduleContent) {
            this.moduleContent = moduleContent;
            if (this.workspacePath === this.modulePath) {
              this.workspaceContent = moduleContent
            }

            // If both the workspace and the module have been loaded, load the
            // blocks into the blockly workspace.
            if (this.workspaceContent) {
              this.loadBlocksIntoBlocklyWorkspace();
            }
          }
        }
      );
      if (this.workspacePath !== this.modulePath) {
        storage.fetchModuleContent(
          this.workspacePath,
          (workspaceContent: string | null, errorMessage: string) => {
            if (errorMessage) {
              alert(errorMessage);
              return;
            }
            if (workspaceContent) {
              this.workspaceContent = workspaceContent;

              // If both the workspace and the module have been loaded, load the
              // blocks into the blockly workspace.
              if (this.moduleContent) {
                this.loadBlocksIntoBlocklyWorkspace();
              }
            }
          }
        );
      }
    }
  }

  private clearBlocklyWorkspace() {
    if (this.bindedOnChange) {
      this.blocklyWorkspace.removeChangeListener(this.bindedOnChange);
    }
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
    if (this.modulePath) {
      if (this.modulePath === this.workspacePath) {
        // If we are editing a Workspace, we don't add any additional blocks to
        // the toolbox.
        this.setToolbox(getToolboxJSON([], shownPythonToolboxCategories));
        return;
      }
      // Otherwise, we add the exported blocks from the Workspace.
      if (!this.workspaceContent) {
        // The workspace content hasn't been fetched yet. Try again in a bit.
        setTimeout(() => {
          this.updateToolbox(shownPythonToolboxCategories)
        }, 50);
        return;
      }
      const workspaceName = commonStorage.getWorkspaceName(this.modulePath);
      const exportedBlocks = commonStorage.extractExportedBlocks(
         workspaceName, this.workspaceContent);
      this.setToolbox(getToolboxJSON(exportedBlocks, shownPythonToolboxCategories));
    }
  }

  public isModified(): boolean {
    return this.getModuleContent() !== this.moduleContent;
  }

  private getModuleContent(): string {
    const pythonCode = extendedPythonGenerator.workspaceToCode(this.blocklyWorkspace);
    const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(this.blocklyWorkspace));
    const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(this.blocklyWorkspace));
    return commonStorage.makeModuleContent(pythonCode, exportedBlocks, blocksContent);
  }

  public saveModule(callback: storage.BooleanCallback): void {
    const moduleContent = this.getModuleContent();
    storage.saveModule(this.modulePath, moduleContent, (success, errorMessage) => {
      if (success) {
        this.moduleContent = moduleContent;
      }
      callback(success, errorMessage);
    });
  }
}
