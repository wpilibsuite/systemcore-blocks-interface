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

// Extends the python generator to collect some information about functions and
// variables that have been defined.

class ExtendedPythonGenerator extends PythonGenerator {
  constructor() {
    super('Python');
  }
  getBlocksForExports(workspace) {
    const blocksForExports = [];

    // The exported blocks produced here have the extraState.importModule and fields.MODULE values
    // set to %module_name%. These will need to be replaced with the actual module name before they
    // are added to the toolbox.
    const moduleNamePlaceholder = '%module_name%';

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
          'importModule': moduleNamePlaceholder,
          'actualFunctionName': actualFunctionName,
          'exportedFunction': true,
        },
        'fields': {
          'MODULE': moduleNamePlaceholder,
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

    const allVariables = workspace.getAllVariables();
    for (let i = 0; i < allVariables.length; i++) {
      const variableModel = allVariables[i];

      // Only variables that are used outside of functions are exported. (I'm not sure if this is
      // the right choice, since all variables in blockly are global variables.)
      let exported = false;
      const variableUsesById = workspace.getVariableUsesById(variableModel.getId())
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
        const actualVariableName = super.getVariableName(variableModel.getId());
        const getPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'get_python_module_variable',
          'extraState': {
            'importModule': moduleNamePlaceholder,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE': moduleNamePlaceholder,
            'VAR': variableName,
          },
        };
        blocksForExports.push(getPythonModuleVariableBlock);
        const setPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'set_python_module_variable',
          'extraState': {
            'importModule': moduleNamePlaceholder,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE': moduleNamePlaceholder,
            'VAR': variableName,
          },
        };
        blocksForExports.push(setPythonModuleVariableBlock);
      }
    }
    return blocksForExports;
  }
}

function createExtendedPythonGenerator() {
  const extendedPythonGenerator = new ExtendedPythonGenerator();

  extendedPythonGenerator.forBlock = new Object();
  for (const property in pythonGenerator.forBlock) {
    extendedPythonGenerator.forBlock[property] = pythonGenerator.forBlock[property];
  }

  return extendedPythonGenerator;
}

export const extendedPythonGenerator = createExtendedPythonGenerator();
