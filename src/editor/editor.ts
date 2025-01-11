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

function onChangeBeforeFinishedLoading(event: Blockly.Events.Abstract) {
  if (!event.workspaceId) {
    return;
  }
  if (event.type === Blockly.Events.FINISHED_LOADING) {
    const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
    if (blocklyWorkspace) {
      // Remove the before-finish-loading listener.
      blocklyWorkspace.removeChangeListener(onChangeBeforeFinishedLoading);

      // Add the after-finish-loading listener.
      blocklyWorkspace.addChangeListener(onChangeAfterFinishedLoading);
    }
  }
  // TODO(lizlooney): Look at blocks where block.firstAttributes_?.exportedVariable === true:
  // Look at block.firstAttributes_.importModule and get the exported blocks for that module.
  // Check whether block.firstAttributes_.actualVariableName matches any exportedBlock's
  // extraState.actualVariableName. If there is no match, put a warning on the block.

  // TODO(lizlooney): Look at blocks where block.firstAttributes_?.exportedFunction === true:
  // Look at block.firstAttributes_.importModule and get the exported blocks for that module.
  // Check whether block.firstAttributes_.actualFunctionName matches any exportedBlock's
  // extraState.actualFunctionName. If there is no match, put a warning on the block.
  // If there is a match, check whether
  // block.firstAttributes.args.length === exportedBlock.extraState.args.length and
  // block.firstAttributes.args[i].name === exportedBlock.extraState.args[i].name for all args.
  // If there is any differences, put a warning on the block.
}

function onChangeAfterFinishedLoading(event: Blockly.Events.Abstract) {
  if (event.isUiEvent) {
    // UI events are things like scrolling, zooming, etc.
    return;
  }
  if (!event.workspaceId) {
    return;
  }
  const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
  if (!blocklyWorkspace) {
    return;
  }
  if ((blocklyWorkspace as Blockly.WorkspaceSvg).isDragging()) {
    return;
  }
  // TODO(lizlooney): do we need to do anything here?
}

export function loadModuleBlocks(blocklyWorkspace: Blockly.WorkspaceSvg, modulePath: string) {
  storage.fetchModuleContent(
    modulePath,
    (moduleContent: string | null, errorMessage: string) => {
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      if (moduleContent != null) {
        // Remove all of the listeners we may have added.
        blocklyWorkspace.removeChangeListener(onChangeAfterFinishedLoading);
        blocklyWorkspace.removeChangeListener(onChangeBeforeFinishedLoading);
        blocklyWorkspace.clear();
        // Add the before-finish-loading listener.
        blocklyWorkspace.addChangeListener(onChangeBeforeFinishedLoading);
        const blocksContent = commonStorage.extractBlocksContent(moduleContent);
        if (blocksContent) {
          Blockly.serialization.workspaces.load(JSON.parse(blocksContent), blocklyWorkspace);
        }
        updateToolbox(blocklyWorkspace, modulePath);
      }
    }
  );
}

function updateToolbox(blocklyWorkspace: Blockly.WorkspaceSvg, modulePath: string): void {
  const workspaceName = commonStorage.getWorkspaceName(modulePath);
  const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);
  if (modulePath === workspacePath) {
    // If we are editing a Workspace, we don't add any additional blocks to the toolbox.
    blocklyWorkspace.updateToolbox(getToolboxJSON([]));
    return;
  }
  // Otherwise, we add the exported blocks from the Workspace.
  storage.fetchModuleContent(
    workspacePath,
    (workspaceContent: string | null, errorMessage: string) => {
      if (errorMessage) {
        alert(errorMessage);
        blocklyWorkspace.updateToolbox(getToolboxJSON([]));
        return;
      }
      if (workspaceContent != null) {
        const exportedBlocks = commonStorage.extractExportedBlocks(
            workspaceName, workspaceContent);
        blocklyWorkspace.updateToolbox(getToolboxJSON(exportedBlocks));
      }
    });
}

export function saveModule(blocklyWorkspace: Blockly.WorkspaceSvg, modulePath: string): void {
  const pythonCode = extendedPythonGenerator.workspaceToCode(blocklyWorkspace);
  const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(blocklyWorkspace));
  const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(blocklyWorkspace));
  const moduleContent = commonStorage.makeModuleContent(pythonCode, exportedBlocks, blocksContent);

  storage.saveModule(
    modulePath, moduleContent,
    function(success, errorMessage) {
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      // TODO(lizlooney): Indicate that the module was saved successfully.
    }
  );
}
