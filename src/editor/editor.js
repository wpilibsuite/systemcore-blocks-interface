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
import * as storage from './client_side_storage.js'
import * as commonStorage from './common_storage.js'

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
  // TODO(lizlooney): what do we need to do here?
}

function loadWorkspaceBlocks(blocklyWorkspace, workspaceName) {
  storage.fetchWorkspaceFileContent(
    workspaceName,
    function(workspaceFileContent, errorMessage) {
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
      const blocksContent = commonStorage.extractBlocksContent(workspaceFileContent);
      if (blocksContent) {
        Blockly.serialization.workspaces.load(JSON.parse(blocksContent), blocklyWorkspace);
      }
    }
  );
}

function saveWorkspaceBlocks(blocklyWorkspace, workspaceName) {
  const [pythonCode, blocksForExports] = generatePythonCodeAndBlocksForExports(blocklyWorkspace);
  const blocksContent = getCurrentBlocksContent(blocklyWorkspace);
  const workspaceFileContent = commonStorage.makeFileContent(pythonCode, blocksForExports, blocksContent);

  storage.saveWorkspace(
    workspaceName, workspaceFileContent,
    function(success, errorMessage) {
      if (errorMessage) {
        alert(errorMessage);
        return;
      }
      // TODO(lizlooney): Indicate that the file was saved successfully.
    }
  );
}

function generatePythonCodeAndBlocksForExports(blocklyWorkspace) {
  const pythonCode = extendedPythonGenerator.workspaceToCode(blocklyWorkspace);

  const blocksForExports = [];

  // The exported blocks produced here have the extraState.importModule and fields.MODULE values set
  // to %module_name%. This will need to be replaced with the actual module name (which is the
  // workspace name) before they are added to the toolbox.
  const moduleName = '%module_name%';

  // All functions are exported.
  const allProcedures = Blockly.Procedures.allProcedures(blocklyWorkspace);
  const procedureTuples = allProcedures[0].concat(allProcedures[1]);
  for (let i = 0; i < procedureTuples.length; i++) {
    const procedureTuple = procedureTuples[i];
    const functionName = procedureTuple[0];
    const blockDefinition = Blockly.Procedures.getDefinition(functionName, blocklyWorkspace);
    if (!blockDefinition.isEnabled()) {
      continue;
    }
    const actualFunctionName = extendedPythonGenerator.getActualProcedureName(functionName);
    const hasReturnValue = procedureTuple[2];
    const callFunctionBlock = {
      'kind': 'block',
      'type': 'call_python_module_function',
      'extraState': {
        'returnType': hasReturnValue ? '' : 'None',
        'args': [],
        'importModule': moduleName,
        'actualFunctionName': actualFunctionName,
      },
      'fields': {
        'MODULE': moduleName,
        'FUNC': functionName,
      },
    };
    const parameterNames = procedureTuple[1];
    for (let iParam = 0; iParam < parameterNames.length; iParam++) {
      callFunctionBlock['extraState']['args'].push({
        'name': parameterNames[iParam],
        'type': '',
      })
    }
    blocksForExports.push(callFunctionBlock);
  }

  // Only variables that are used outside of functions are exported. (I'm not sure if this is the
  // right choice, since all variables in blockly are global variables.)
  const allVariables = blocklyWorkspace.getAllVariables();
  for (let i = 0; i < allVariables.length; i++) {
    const variableModel = allVariables[i];

    let exported = false;
    const variableUsesById = blocklyWorkspace.getVariableUsesById(variableModel.getId())
    if (variableUsesById.length == 0) {
      continue;
    }
    for (let iBlock = 0; iBlock < variableUsesById.length; iBlock++) {
      const block = variableUsesById[iBlock];
      if (block.type == 'variables_get' ||
          block.type == 'variables_set' ||
          block.type == 'math_change' ||
          block.type == 'text_append') {
        const rootBlock = block.getRootBlock();
        if (rootBlock.type != 'procedures_defnoreturn' &&
            rootBlock.type != 'procedures_defreturn') {
          exported = true;
        }
      }
    }
    if (exported) {
      const variableName = variableModel.name;
      const actualVariableName = extendedPythonGenerator.getActualVariableName(variableName);

      const getPythonModuleVariableBlock = {
        'kind': 'block',
        'type': 'get_python_module_variable',
        'extraState': {
          'importModule': moduleName,
          'actualVariableName': actualVariableName,
        },
        'fields': {
          'MODULE': moduleName,
          'VAR': variableName,
        },
      };
      blocksForExports.push(getPythonModuleVariableBlock);
      const setPythonModuleVariableBlock = {
        'kind': 'block',
        'type': 'set_python_module_variable',
        'extraState': {
          'importModule': moduleName,
          'actualVariableName': actualVariableName,
        },
        'fields': {
          'MODULE': moduleName,
          'VAR': variableName,
        },
      };
      blocksForExports.push(setPythonModuleVariableBlock);
    }
  }

  return JSON.stringify(blocksForExports);
}

function getCurrentBlocksContent(blocklyWorkspace) {
  return JSON.stringify(Blockly.serialization.workspaces.save(blocklyWorkspace));
}

export {
  loadWorkspaceBlocks,
  saveWorkspaceBlocks
}
