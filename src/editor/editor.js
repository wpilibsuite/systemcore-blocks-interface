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

import { extendedPythonGenerator } from './extended_python_generator.js';
import * as storage from '../storage/client_side_storage.js'
import * as commonStorage from '../storage/common_storage.js'

function onChangeBeforeFinishedLoading(event) {
  if (event.type == Blockly.Events.FINISHED_LOADING) {
    const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
    if (blocklyWorkspace) {
      // Remove the before-finish-loading listener.
      blocklyWorkspace.removeChangeListener(onChangeBeforeFinishedLoading);

      // Add the after-finish-loading listener.
      blocklyWorkspace.addChangeListener(onChangeAfterFinishedLoading);
    }
  }
  // TODO(lizlooney): Look at blocks where block.firstAttributes_?.exportedVariable == true:
  // Look at block.firstAttributes_.importModule and get the exported blocks for that module.
  // Check whether block.firstAttributes_.actualVariableName matches any exportedBlock's
  // extraState.actualVariableName. If there is no match, put a warning on the block.

  // TODO(lizlooney): Look at blocks where block.firstAttributes_?.exportedFunction == true:
  // Look at block.firstAttributes_.importModule and get the exported blocks for that module.
  // Check whether block.firstAttributes_.actualFunctionName matches any exportedBlock's
  // extraState.actualFunctionName. If there is no match, put a warning on the block.
  // If there is a match, check whether
  // block.firstAttributes.args.length == exportedBlock.extraState.args.length and
  // block.firstAttributes.args[i].name == exportedBlock.extraState.args[i].name for all args.
  // If there is any differences, put a warning on the block.
}

function onChangeAfterFinishedLoading(event) {
  if (event.isUiEvent) {
    // UI events are things like scrolling, zooming, etc.
    return;
  }
  const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
  if (blocklyWorkspace && blocklyWorkspace.isDragging()) {
    return;
  }
  // TODO(lizlooney): do we need to do anything here?
}

export function loadModuleBlocks(blocklyWorkspace, moduleFilePath) {
  storage.fetchModuleFileContent(
    moduleFilePath,
    function(moduleFileContent, errorMessage) {
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      // Remove all of the listeners we may have added.
      blocklyWorkspace.removeChangeListener(onChangeAfterFinishedLoading);
      blocklyWorkspace.removeChangeListener(onChangeBeforeFinishedLoading);
      blocklyWorkspace.clear();
      // Add the before-finish-loading listener.
      blocklyWorkspace.addChangeListener(onChangeBeforeFinishedLoading);
      const blocksContent = commonStorage.extractBlocksContent(moduleFileContent);
      if (blocksContent) {
        Blockly.serialization.workspaces.load(JSON.parse(blocksContent), blocklyWorkspace);
      }
    }
  );
}

export function saveModuleBlocks(blocklyWorkspace, moduleType, moduleFilePath) {
  const pythonCode = extendedPythonGenerator.workspaceToCode(blocklyWorkspace);
  const blocksForExports = JSON.stringify(extendedPythonGenerator.getBlocksForExports(blocklyWorkspace));
  const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(blocklyWorkspace));
  const moduleFileContent = commonStorage.makeFileContent(pythonCode, blocksForExports, blocksContent);

  storage.saveModule(
    moduleType, moduleFilePath, moduleFileContent,
    function(success, errorMessage) {
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      // TODO(lizlooney): Indicate that the file was saved successfully.
    }
  );
}
