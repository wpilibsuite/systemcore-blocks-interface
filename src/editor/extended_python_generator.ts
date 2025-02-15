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
import { PythonGenerator } from 'blockly/python';
import { Block } from "../toolbox/items";
import { FunctionArg } from '../blocks/mrc_call_python_function';
import * as commonStorage from '../storage/common_storage';

// Extends the python generator to collect some information about functions and
// variables that have been defined so they can be used in other modules.

export class ExtendedPythonGenerator extends PythonGenerator {
  private currentModule: commonStorage.Module | null = null;
  private mapWorkspaceIdToExportedBlocks: { [key: string]: Block[] } = Object.create(null);

  constructor() {
    super('Python');
  }

  setCurrentModule(module: commonStorage.Module | null) {
    this.currentModule = module;
  }

  init(workspace: Blockly.Workspace) {
    super.init(workspace);

    // The exported blocks produced here have the extraState.importModule and fields.MODULE values
    // set to the MODULE_NAME_PLACEHOLDER. This is so blocks modules can be renamed and copied
    // without having to change the contents of the modules.
    // The placeholders will be replaced with the actual module name before they are added to the
    // toolbox.

    const exportedBlocks = [];

    // All functions are exported.
    const allProcedures = Blockly.Procedures.allProcedures(workspace);
    const procedureTuples = allProcedures[0].concat(allProcedures[1]);
    for (const procedureTuple of procedureTuples) {
      const functionName = procedureTuple[0];
      const blockDefinition = Blockly.Procedures.getDefinition(functionName, workspace);
      if (!blockDefinition || !blockDefinition.isEnabled()) {
        continue;
      }
      const actualFunctionName = super.getProcedureName(functionName);
      const hasReturnValue = procedureTuple[2];
      const args: FunctionArg[] = [];
      const parameterNames = procedureTuple[1];
      parameterNames.forEach((parameterName) => {
        args.push({
          'name': parameterName,
          'type': '',
        })
      });
      const callFunctionBlock: Block = {
        'kind': 'block',
        'type': 'mrc_call_python_function',
        'extraState': {
          'functionKind': 'module',
          'returnType': hasReturnValue ? '' : 'None',
          'args': args,
          'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
          'actualFunctionName': actualFunctionName,
          'exportedFunction': true,
        },
        'fields': {
          'MODULE_OR_CLASS': commonStorage.MODULE_NAME_PLACEHOLDER,
          'FUNC': functionName,
        },
      };
      exportedBlocks.push(callFunctionBlock);
    }

    const allVariables = workspace.getAllVariables();
    for (const variableModel of allVariables) {
      // Only variables that are used outside of functions are exported. (I'm not sure if this is
      // the right choice, since all blockly variables are global variables.)
      let exported = false;
      const variableUsesById = workspace.getVariableUsesById(variableModel.getId())
      if (variableUsesById.length === 0) {
        continue;
      }
      variableUsesById.forEach((block) => {
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
      });
      if (exported) {
        const variableName = variableModel.name;
        const actualVariableName = super.getVariableName(variableModel.getId());
        const getPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'mrc_get_python_variable',
          'extraState': {
            'varKind': 'module',
            'moduleOrClassName': commonStorage.MODULE_NAME_PLACEHOLDER,
            'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE_OR_CLASS': commonStorage.MODULE_NAME_PLACEHOLDER,
            'VAR': variableName,
          },
        };
        exportedBlocks.push(getPythonModuleVariableBlock);
        const setPythonModuleVariableBlock = {
          'kind': 'block',
          'type': 'mrc_set_python_variable',
          'extraState': {
            'varKind': 'module',
            'moduleOrClassName': commonStorage.MODULE_NAME_PLACEHOLDER,
            'importModule': commonStorage.MODULE_NAME_PLACEHOLDER,
            'actualVariableName': actualVariableName,
            'exportedVariable': true,
          },
          'fields': {
            'MODULE_OR_CLASS': commonStorage.MODULE_NAME_PLACEHOLDER,
            'VAR': variableName,
          },
        };
        exportedBlocks.push(setPythonModuleVariableBlock);
      }
    }
    this.mapWorkspaceIdToExportedBlocks[workspace.id] = exportedBlocks;
  }

  getExportedBlocks(workspace: Blockly.Workspace): Block[] {
    return this.mapWorkspaceIdToExportedBlocks[workspace.id];
  }

  // Functions used in python code generation for multiple python blocks.
  addImport(importModule: string): void {
    this.definitions_['import_' + importModule] = 'import ' + importModule;
  }

  workspaceToCode(workspace?: Blockly.Workspace): string {
    let code = super.workspaceToCode(workspace);
    if (!this.currentModule) {
      return code;
    }

    const className = this.currentModule.moduleName;
    const classType = this.currentModule.moduleType;

    this.addImport(classType);

    let prefix = "";
    for (let key in this.definitions_) {
      prefix += this.definitions_[key] + "\n";
    }
    if (prefix) {
      prefix += "\n";
    }

    let class_def = "class " + className + "(" + classType + "):\n";
    if (!code) {
      code = "pass";
    }
    return prefix + class_def + this.prefixLines(code, this.INDENT);
  }
}

export const extendedPythonGenerator = new ExtendedPythonGenerator();
