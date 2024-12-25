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
import { PythonGenerator, pythonGenerator } from 'blockly/python';
import * as commonStorage from '../storage/common_storage.js';

// Extends the python generator to collect some information about functions and
// variables that have been defined so they can be used in other modules.

class ExtendedPythonGenerator extends PythonGenerator {
  constructor() {
    super('Python');
    this.mapWorkspaceIdToExportedBlocks = {};
  }
  init(workspace) {
    super.init(workspace);

    // The exported blocks produced here have the extraState.importModule and fields.MODULE values
    // set to the MODULE_NAME_PLACEHOLDER. This is so blocks files can be renamed and copied without
    // having to change the contents of the files.
    // The placeholders will be replaced with the actual module name before they are added to the
    // toolbox.

    const exportedBlocks = [];

    // All functions are exported.
    const allProcedures = Blockly.Procedures.allProcedures(workspace);
    const procedureTuples = allProcedures[0].concat(allProcedures[1]);
    for (let i = 0; i < procedureTuples.length; i++) {
      const procedureTuple = procedureTuples[i];
      const functionName = procedureTuple[0];
      const blockDefinition = Blockly.Procedures.getDefinition(functionName, workspace);
      if (!blockDefinition.isEnabled()) {
        continue;
      }
      const actualFunctionName = super.getProcedureName(functionName);
      const hasReturnValue = procedureTuple[2];
      const callFunctionBlock = {
        'kind': 'block',
        'type': 'call_python_module_function',
        'extraState': {
          'returnType': hasReturnValue ? '' : 'None',
          'args': [],
          'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
          'actualFunctionName': actualFunctionName,
          'exportedFunction': true,
        },
        'fields': {
          'MODULE': commonStorage.MODULE_NAME_PLACEHOLDER,
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
      exportedBlocks.push(callFunctionBlock);
    }

    const allVariables = workspace.getAllVariables();
    for (let i = 0; i < allVariables.length; i++) {
      const variableModel = allVariables[i];

      // Only variables that are used outside of functions are exported. (I'm not sure if this is
      // the right choice, since all variables in blockly are global variables.)
      let exported = false;
      const variableUsesById = workspace.getVariableUsesById(variableModel.getId())
      if (variableUsesById.length === 0) {
        continue;
      }
      for (let iBlock = 0; iBlock < variableUsesById.length; iBlock++) {
        const block = variableUsesById[iBlock];
        if (block.type === 'variables_get' ||
            block.type === 'variables_set' ||
            block.type === 'math_change' ||
            block.type === 'text_append') {
          const rootBlock = block.getRootBlock();
          if (rootBlock.type !== 'procedures_defnoreturn' &&
              rootBlock.type !== 'procedures_defreturn') {
            exported = true;
          }
        }
      }
      if (exported) {
        const variableName = variableModel.name;
        const actualVariableName = super.getVariableName(variableModel.getId());
        const getPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'get_python_module_variable',
          'extraState': {
            'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE': commonStorage.MODULE_NAME_PLACEHOLDER,
            'VAR': variableName,
          },
        };
        exportedBlocks.push(getPythonModuleVariableBlock);
        const setPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'set_python_module_variable',
          'extraState': {
            'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE': commonStorage.MODULE_NAME_PLACEHOLDER,
            'VAR': variableName,
          },
        };
        exportedBlocks.push(setPythonModuleVariableBlock);
      }
    }
    this.mapWorkspaceIdToExportedBlocks[workspace.id] = exportedBlocks;
  }
  getExportedBlocks(workspace) {
    return this.mapWorkspaceIdToExportedBlocks[workspace.id];
  }
}

function createExtendedPythonGenerator() {
  const extendedPythonGenerator = new ExtendedPythonGenerator();

  extendedPythonGenerator.forBlock = {};
  for (const property in pythonGenerator.forBlock) {
    extendedPythonGenerator.forBlock[property] = pythonGenerator.forBlock[property];
  }

  return extendedPythonGenerator;
}

export const extendedPythonGenerator = createExtendedPythonGenerator();
