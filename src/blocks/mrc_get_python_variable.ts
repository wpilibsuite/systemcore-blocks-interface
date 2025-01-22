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


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';

import * as pythonUtils from './utils/generated/python';
import { createFieldDropdown, createNonEditableField } from './utils/blocks';
import { getAllowedTypesForSetCheck, getOutputCheck, addImport } from './utils/python';
import { MRC_STYLE_VARIABLES } from '../themes/styles';
// A block to get a python variable.

export const BLOCK_NAME = 'mrc_get_python_variable';

const VAR_KIND_MODULE = 'module';
const VAR_KIND_CLASS = 'class';
const VAR_KIND_INSTANCE = 'instance';

// Variables and functions used for populating the drop down field for the variable names.

const PythonVariableGetterNames = Object.create(null);
const PythonVariableGetterTooltips = Object.create(null);

function createKey(
    varKind: string, moduleOrClassName: string, varType: string): string {
  return varKind + ' ' + moduleOrClassName + ' ' + varType;
}

export function initializeModuleVariableGetter(
    moduleName: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VAR_KIND_MODULE, moduleName, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeClassVariableGetter(
    className: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VAR_KIND_CLASS, className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeInstanceVariableGetter(
    className: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VAR_KIND_INSTANCE, className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

//..............................................................................

type GetPythonVariableBlock = Blockly.Block & GetPythonVariableMixin;
interface GetPythonVariableMixin extends GetPythonVariableMixinType {
  mrcVarKind: string, // module, class, or instance
  mrcModuleOrClassName: string,
  mrcVarType: string,
  mrcSelfLabel: string,
  mrcSelfType: string,
  mrcImportModule: string,
  mrcActualVariableName: string,
  mrcExportedVariable: boolean,
  mrcKey: string,
}
type GetPythonVariableMixinType = typeof GET_PYTHON_VARIABLE;

/** Extra state for serialising mrc_get_python_variable blocks. */
type GetPythonVariableExtraState = {
  /**
   * The kind of variable: module, class, or instance.
   */
  varKind: string,
  /**
   * The module name (if varKind is module) or class name (if varKind is class or instance).
   */
  moduleOrClassName: string,
  /**
   * Specified if the type of the variable is known.
   */
  varType?: string,
  /**
   * The label for the self socket. Specified only for instance variables.
   */
  selfLabel?: string,
  /**
   * The type of the self input. Specified only for instance variables.
   */
  selfType?: string,
  /**
   * Specified if an import statement is needed for the generated python code.
   */
  importModule?: string,
  /**
   * Specified if the actual variable name is different than the name given in
   * the FIELD_VARIABLE_NAME field.
   */
  actualVariableName?: string,
  /**
   * True if this blocks refers to an exported variable (for example, from a
   * user's Workspace).
   */
  exportedVariable: boolean,
};

const GET_PYTHON_VARIABLE = {
  /**
   * Block initialization.
   */
  init: function(this: GetPythonVariableBlock): void {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
        .appendField('.');
    this.setStyle(MRC_STYLE_VARIABLES);
    this.setTooltip(() => {
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip: string;
      switch (this.mrcVarKind) {
        case VAR_KIND_MODULE: {
          const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Gets the variable ' + moduleName + '.' + varName + '.';
          break;
        }
        case VAR_KIND_CLASS: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Gets the variable ' + className + '.' + varName + '.';
          break;
        }
        case VAR_KIND_INSTANCE: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Gets the variable ' + varName + ' for the given ' + className + ' object.';
          break;
        }
        default:
          throw new Error('mrcVarKind must be "module", "class", or "instance".')
      }
      const varTooltips = PythonVariableGetterTooltips[this.mrcKey];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[this.mrcKey];
        for (let i = 0; i < varNames.length; i++) {
          if (varNames[i] === varName) {
            const varTooltip = varTooltips[i];
            if (varTooltip) {
              tooltip += '\n\n' + varTooltip;
              break;
            }
          }
        }
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: GetPythonVariableBlock): GetPythonVariableExtraState {
    const extraState: GetPythonVariableExtraState = {
      varKind: this.mrcVarKind,
      moduleOrClassName: this.mrcModuleOrClassName,
      exportedVariable: this.mrcExportedVariable,
    };
    if (this.mrcVarType) {
      extraState.varType = this.mrcVarType;
    }
    if (this.mrcSelfLabel) {
      extraState.selfLabel = this.mrcSelfLabel;
    }
    if (this.mrcSelfType) {
      extraState.selfType = this.mrcSelfType;
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcActualVariableName) {
      extraState.actualVariableName = this.mrcActualVariableName;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: GetPythonVariableBlock,
      extraState: GetPythonVariableExtraState
  ): void {
    this.mrcVarKind = extraState.varKind;
    this.mrcModuleOrClassName = extraState.moduleOrClassName;
    this.mrcVarType = extraState.varType ? extraState.varType : '';
    this.mrcSelfLabel = extraState.selfLabel ? extraState.selfLabel : '';
    this.mrcSelfType = extraState.selfType ? extraState.selfType : '';
    this.mrcImportModule = extraState.importModule
        ? extraState.importModule : '';
    this.mrcActualVariableName = extraState.actualVariableName
        ? extraState.actualVariableName : '';
    this.mrcExportedVariable = extraState.exportedVariable
        ? extraState.exportedVariable : false;
    this.mrcKey = createKey(this.mrcVarKind, this.mrcModuleOrClassName, this.mrcVarType);
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: GetPythonVariableBlock): void {
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.mrcVarType);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    const input = this.getInput('VAR');
    if (input) {
      const varNames = PythonVariableGetterNames[this.mrcKey];
      if (varNames) {
        // Create the drop-down with the variable names.
        input.appendField(createFieldDropdown(varNames), pythonUtils.FIELD_VARIABLE_NAME);
      } else {
        input.appendField(createNonEditableField(''), pythonUtils.FIELD_VARIABLE_NAME);
      }
    }
    // Add input socket for self, if necessary.
    if (this.mrcSelfLabel && this.mrcSelfType) {
      this.appendValueInput('SELF')
          .setCheck(getAllowedTypesForSetCheck(this.mrcSelfType))
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.mrcSelfLabel);
    }
  }
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = GET_PYTHON_VARIABLE;
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const getPythonVariableBlock = block as GetPythonVariableBlock;
  const varName = getPythonVariableBlock.mrcActualVariableName
      ? getPythonVariableBlock.mrcActualVariableName
      : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  switch (getPythonVariableBlock.mrcVarKind) {
    case VAR_KIND_MODULE: {
      const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      if (getPythonVariableBlock.mrcImportModule) {
        addImport(generator, getPythonVariableBlock.mrcImportModule);
      }
      const code = moduleName + '.' + varName;
      return [code, Order.MEMBER];
    }
    case VAR_KIND_CLASS: {
      const className = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      if (getPythonVariableBlock.mrcImportModule) {
        addImport(generator, getPythonVariableBlock.mrcImportModule);
      }
      const code = className + '.' + varName;
      return [code, Order.MEMBER];
    }
    case VAR_KIND_INSTANCE: {
      const selfValue = generator.valueToCode(block, 'SELF', Order.MEMBER);
      const code = selfValue + '.' + varName;
      return [code, Order.MEMBER];
    }
    default:
      throw new Error('mrcVarKind must be "module", "class", or "instance".')
  }
};
