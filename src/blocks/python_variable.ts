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
import { Order } from 'blockly/python';

import * as pythonUtils from './generated/python_utils';
import { createFieldDropdown, createNonEditableField } from './blocks_utils';
import { getAllowedTypesForSetCheck, getOutputCheck} from './wpilib_utils';


const COLOR_VARIABLE_GETTER = 120; // green
const COLOR_VARIABLE_SETTER = 120; // green

// Variables and functions used for populating the drop down field for the variable names.

const PythonVariableGetterNames = Object.create(null);
const PythonVariableGetterTooltips = Object.create(null);
const PythonVariableSetterNames = Object.create(null);
const PythonVariableSetterTooltips = Object.create(null);

export function createInitializationKeyForModuleVariable(
    moduleName: string, varType: string): string {
  return 'module ' + moduleName + ' ' + varType;
}

export function createInitializationKeyForClassVariable(
    className: string, varType: string): string {
  return 'class ' + className + ' ' + varType;
}

export function createInitializationKeyForInstanceVariable(
    className: string, varType: string): string {
  return 'instance ' + className + ' ' + varType;
}

export function initializeModuleVariableGetter(moduleName, varType, varNames, tooltips) {
  const key = createInitializationKeyForModuleVariable(moduleName, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeModuleVariableSetter(moduleName, varType, varNames, tooltips) {
  const key = createInitializationKeyForModuleVariable(moduleName, varType);
  PythonVariableSetterNames[key] = varNames;
  PythonVariableSetterTooltips[key] = tooltips;
}

export function initializeClassVariableGetter(className, varType, varNames, tooltips) {
  const key = createInitializationKeyForClassVariable(className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeClassVariableSetter(className, varType, varNames, tooltips) {
  const key = createInitializationKeyForClassVariable(className, varType);
  PythonVariableSetterNames[key] = varNames;
  PythonVariableSetterTooltips[key] = tooltips;
}

export function initializeInstanceVariableGetter(className, varType, varNames, tooltips) {
  const key = createInitializationKeyForInstanceVariable(className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeInstanceVariableSetter(className, varType, varNames, tooltips) {
  const key = createInitializationKeyForInstanceVariable(className, varType);
  PythonVariableSetterNames[key] = varNames;
  PythonVariableSetterTooltips[key] = tooltips;
}

//..............................................................................

/** Extra state for serialising get_python_*_variable and set_python_*_variable blocks. */
type PythonVariableExtraState = {
  /**
   * Specified if the type of the variable is known.
   */
  varType: string,
  /**
   * The key returned by createInitializationKeyForModuleVariable,
   * createInitializationKeyForClassVariable, or
   * createInitializationKeyForInstanceVariable.
   */
  key: string,
  /**
   * The label for the self socket. Specified only for get_python_instance_variable.
   */
  selfLabel?: string,
  /**
   * The type of the self input. Specified only for get_python_instance_variable.
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
   * True if this blocks refers to an exported function.
   */
 exportedVariable: boolean,
};


//..............................................................................
// Block Definitions

// Variable getter blocks

// Block types:
// get_python_module_variable - requires fields FIELD_MODULE_NAME and FIELD_VARIABLE_NAME
// get_python_class_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME
// get_python_instance_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME

/** Type of a block using the GET_PYTHON_VARIABLE_COMMON mixin. */
type GetPythonVariableBlock = Blockly.Block & GetPythonVariableMixin;
interface GetPythonVariableMixin extends GetPythonVariableMixinType {
  firstAttributes_: any; // HeyLiz fix this!
}
type GetPythonVariableMixinType = typeof GET_PYTHON_VARIABLE_COMMON;

/**
 * Common properties for get_python_*_variable blocks.
 */
const GET_PYTHON_VARIABLE_COMMON = {
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: GetPythonVariableBlock): PythonVariableExtraState {
    const extraState: PythonVariableExtraState = {
      varType: '',
      key: '',
      exportedVariable: false,
    };
    if (this.firstAttributes_.varType) {
      extraState.varType = this.firstAttributes_.varType;
    }
    if (this.firstAttributes_.key) {
      extraState.key = this.firstAttributes_.key;
    }
    if (this.firstAttributes_.selfLabel) {
      extraState.selfLabel = this.firstAttributes_.selfLabel;
    }
    if (this.firstAttributes_.selfType) {
      extraState.selfType = this.firstAttributes_.selfType;
    }
    if (this.firstAttributes_.importModule) {
      extraState.importModule = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualVariableName) {
      extraState.actualVariableName = this.firstAttributes_.actualVariableName;
    }
    extraState.exportedVariable = this.firstAttributes_.exportedVariable;
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: GetPythonVariableBlock,
      extraState: PythonVariableExtraState
  ): void {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.varType = extraState.varType ? extraState.varType : '';
    this.firstAttributes_.key = extraState.key ? extraState.key : '';
    this.firstAttributes_.selfLabel = extraState.selfLabel ? extraState.selfLabel : '';
    this.firstAttributes_.selfType = extraState.selfType ? extraState.selfType : '';
    this.firstAttributes_.importModule = extraState.importModule
        ? extraState.importModule : '';
    this.firstAttributes_.actualVariableName = extraState.actualVariableName
        ? extraState.actualVariableName : '';
    this.firstAttributes_.exportedVariable = extraState.exportedVariable
        ? extraState.exportedVariable : false;
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: GetPythonVariableBlock): void {
    // The getter has an output plug.
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.firstAttributes_.varType);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    const input = this.getInput('VAR');
    const varNames = PythonVariableGetterNames[this.firstAttributes_.key];
    if (varNames) {
      // Create the drop-down with the variable names.
      input.appendField(createFieldDropdown(varNames), pythonUtils.FIELD_VARIABLE_NAME);
    } else {
      input.appendField(createNonEditableField(''), pythonUtils.FIELD_VARIABLE_NAME);
    }
    // Add input socket for self, if necessary.
    if (this.firstAttributes_.selfLabel && this.firstAttributes_.selfType) {
      this.appendValueInput('SELF')
          .setCheck(getAllowedTypesForSetCheck(this.firstAttributes_.selfType))
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.firstAttributes_.selfLabel);
    }
  }
};

Blockly.Blocks['get_python_module_variable'] = {
  ...GET_PYTHON_VARIABLE_COMMON,
  init: function(this: GetPythonVariableBlock): void {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    this.setTooltip(() => {
      const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + moduleName + '.' + varName + '.';
      const varTooltips = PythonVariableGetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['get_python_module_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  if (block.firstAttributes_.importModule) {
    (generator as any).definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = moduleName + '.' + varName;
  return [code, Order.MEMBER];
};

Blockly.Blocks['get_python_class_variable'] = {
  ...GET_PYTHON_VARIABLE_COMMON,
  init: function(this: GetPythonVariableBlock): void {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + className + '.' + varName + '.';

      const varTooltips = PythonVariableGetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['get_python_class_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  if (block.firstAttributes_.importModule) {
    (generator as any).definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = className + '.' + varName;
  return [code, Order.MEMBER];
};

Blockly.Blocks['get_python_instance_variable'] = {
  ...GET_PYTHON_VARIABLE_COMMON,
  init: function(this: GetPythonVariableBlock): void {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + varName + ' for the given ' + className + ' object.';

      const varTooltips = PythonVariableGetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['get_python_instance_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const selfValue = generator.valueToCode(block, 'SELF', Order.MEMBER);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const code = selfValue + '.' + varName;
  return [code, Order.MEMBER];
};

// Variable setter blocks

// Block types:
// set_python_module_variable - requires fields FIELD_MODULE_NAME and FIELD_VARIABLE_NAME
// set_python_class_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME
// set_python_instance_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME

/** Type of a block using the SET_PYTHON_VARIABLE_COMMON mixin. */
type SetPythonVariableBlock = Blockly.Block & SetPythonVariableMixin;
interface SetPythonVariableMixin extends SetPythonVariableMixinType {
  firstAttributes_: any; // HeyLiz fix this!
}
type SetPythonVariableMixinType = typeof SET_PYTHON_VARIABLE_COMMON;

/**
 * Common properties for set_python_*_variable blocks.
 */
const SET_PYTHON_VARIABLE_COMMON = {
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: SetPythonVariableBlock): PythonVariableExtraState {
    const extraState: PythonVariableExtraState = {
      varType: '',
      key: '',
      exportedVariable: false,
    };
    if (this.firstAttributes_.varType) {
      extraState.varType = this.firstAttributes_.varType;
    }
    if (this.firstAttributes_.key) {
      extraState.key = this.firstAttributes_.key;
    }
    if (this.firstAttributes_.selfLabel) {
      extraState.selfLabel = this.firstAttributes_.selfLabel;
    }
    if (this.firstAttributes_.selfType) {
      extraState.selfType = this.firstAttributes_.selfType;
    }
    if (this.firstAttributes_.importModule) {
      extraState.importModule = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualVariableName) {
      extraState.actualVariableName = this.firstAttributes_.actualVariableName;
    }
    extraState.exportedVariable = this.firstAttributes_.exportedVariable;
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: SetPythonVariableBlock,
      extraState: PythonVariableExtraState
  ): void {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.varType = extraState.varType ? extraState.varType : '';
    this.firstAttributes_.key = extraState.key ? extraState.key : '';
    this.firstAttributes_.selfLabel = extraState.selfLabel ? extraState.selfLabel : '';
    this.firstAttributes_.selfType = extraState.selfType ? extraState.selfType : '';
    this.firstAttributes_.importModule = extraState.importModule
        ? extraState.importModule : '';
    this.firstAttributes_.actualVariableName = extraState.actualVariableName
        ? extraState.actualVariableName : '';
    this.firstAttributes_.exportedVariable = extraState.exportedVariable
        ? extraState.exportedVariable : false;
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: SetPythonVariableBlock): void {
    // The setter has no output plug.
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(false);
    const input = this.getInput('VALUE');
    const varNames = PythonVariableSetterNames[this.firstAttributes_.key];
    if (varNames) {
      // Create the drop-down with the variable names.
      input.appendField(createFieldDropdown(varNames), pythonUtils.FIELD_VARIABLE_NAME)
    } else {
      input.appendField(createNonEditableField(''), pythonUtils.FIELD_VARIABLE_NAME)
    }
    input.appendField('to');
    if (this.firstAttributes_.varType) {
      input.setCheck(getAllowedTypesForSetCheck(this.firstAttributes_.varType));
    }
    // Add input socket for self, if necessary.
    if (this.firstAttributes_.selfLabel && this.firstAttributes_.selfType) {
      this.appendValueInput('SELF')
          .setCheck(getAllowedTypesForSetCheck(this.firstAttributes_.selfType))
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.firstAttributes_.selfLabel);
    }
  }
};

Blockly.Blocks['set_python_module_variable'] = {
  ...SET_PYTHON_VARIABLE_COMMON,
  init: function(this: SetPythonVariableBlock):void {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    this.setTooltip(() => {
      const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + moduleName + '.' + varName + '.';
      const varTooltips = PythonVariableSetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['set_python_module_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', Order.NONE);
  if (block.firstAttributes_.importModule) {
    (generator as any).definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = moduleName + '.' + varName + ' = ' + value + ';\n';
  return code;
};

Blockly.Blocks['set_python_class_variable'] = {
  ...SET_PYTHON_VARIABLE_COMMON,
  init: function(this: SetPythonVariableBlock):void {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + className + '.' + varName + '.';

      const varTooltips = PythonVariableSetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['set_python_class_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', Order.NONE);
  if (block.firstAttributes_.importModule) {
    (generator as any).definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = className + '.' + varName + ' = ' + value + ';\n';
  return code;
};

Blockly.Blocks['set_python_instance_variable'] = {
  ...SET_PYTHON_VARIABLE_COMMON,
  init: function(this: SetPythonVariableBlock):void {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = this.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + varName + ' for the given ' + className + ' object.';

      const varTooltips = PythonVariableSetterTooltips[this.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[this.firstAttributes_.key];
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
  }
};

pythonGenerator.forBlock['set_python_instance_variable'] = function(
    block: GetPythonVariableBlock, generator: PythonGenerator) {
  const selfValue = generator.valueToCode(block, 'SELF', Order.MEMBER);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', Order.NONE);
  const code = selfValue + '.' + varName + ' = ' + value + ';\n';
  return code;
};
