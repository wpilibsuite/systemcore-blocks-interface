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
import { pythonGenerator } from 'blockly/python';

import * as pythonUtils from './generated/python_utils.js';
import * as wpilibUtils from './generated/wpilib_utils.js';
import { createNonEditableField, createFieldDropdownForVariable } from './blocks_utils.js';


// Colors for python blocks.

const COLOR_VARIABLE_SETTER = 120; // green
const COLOR_VARIABLE_GETTER = 120; // green
const COLOR_FUNCTION = 270;        // blue-magenta
const COLOR_ENUM = 180;            // cyan


// Functions used in python block definitions.

function getAllowedTypesForSetCheck(type) {
  // For the given python type, returns an array of compatible input types.

  // Type Aliases
  const alias = wpilibUtils.getAlias(type);
  if (alias) {
    return [type].concat(getAllowedTypesForSetCheck(alias));
  }

  // Builtin python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return check;
  }

  const allowedTypes = wpilibUtils.getAllowedTypes(type);
  if (allowedTypes) {
    return allowedTypes;
  }

  return type;
}

function getCheckForBuiltInType(type) {
  // If type is a built-in python type, return the blockly check for it.
  if (type === 'bool') {
    return 'Boolean';
  }
  if (type === 'str') {
    return 'String';
  }
  if (type === 'float' || type === 'int') {
    return 'Number';
  }
  if (type.startsWith('tuple[') && type.endsWith(']')) {
    return 'Tuple';
  }
  if (type.startsWith('dict[') && type.endsWith(']')) {
    return 'Dict';
  }
  if (type.startsWith('Optional[') && type.endsWith(']')) {
    return type.substring('Optional['.length, type.length-1);
  }
  // If type is not a built-in python type, return empty string.
  return '';
}

function getOutputCheck(type) {
  // For the given python type, returns the output type.
  if (type === 'None') {
    return '';
  }

  // Type Aliases
  const alias = wpilibUtils.getAlias(type);
  if (alias) {
    return getOutputCheck(alias);
  }

  // Builtin python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return check;
  }

  return type;
}

//..............................................................................
// Block Definitions

// Variable getter blocks

// Block types:
// get_python_module_variable - requires fields FIELD_MODULE_NAME and FIELD_VARIABLE_NAME
// get_python_class_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME
// get_python_instance_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME

// Extra state fields:
// varType - specified if the type of the variable is known.
// key - specified if the variable names (for a dropdown field) were put in
//       PythonVariableGetterNames and/or the tooltip was put in PythonVariableGetterTooltips.
// selfLabel - specified only for get_python_instance_variable.
// selfType - specified only for get_python_instance_variable.
// importModule - specified if an import statement is needed for the generated python code.
// actualVariableName - specified if the actual variable name is different than the name in the
//     FIELD_VARIABLE_NAME field.
// exportedVariable - true if this blocks refers to an exported variable

const GET_PYTHON_VARIABLE_MUTATOR_MIXIN = {
  saveExtraState: function() {
    const extraState = {
    };
    if (this.firstAttributes_.varType) {
      extraState['varType'] = this.firstAttributes_.varType;
    }
    if (this.firstAttributes_.key) {
      extraState['key'] = this.firstAttributes_.key;
    }
    if (this.firstAttributes_.selfLabel) {
      extraState['selfLabel'] = this.firstAttributes_.selfLabel;
    }
    if (this.firstAttributes_.selfType) {
      extraState['selfType'] = this.firstAttributes_.selfType;
    }
    if (this.firstAttributes_.importModule) {
      extraState['importModule'] = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualVariableName) {
      extraState['actualVariableName'] = this.firstAttributes_.actualVariableName;
    }
    extraState['exportedVariable'] = this.firstAttributes_.exportedVariable;
    return extraState;
  },
  loadExtraState: function(extraState) {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.varType = extraState['varType'] ? extraState['varType'] : '';
    this.firstAttributes_.key = extraState['key'] ? extraState['key'] : '';
    this.firstAttributes_.selfLabel = extraState['selfLabel'] ? extraState['selfLabel'] : '';
    this.firstAttributes_.selfType = extraState['selfType'] ? extraState['selfType'] : '';
    this.firstAttributes_.importModule = extraState['importModule']
        ? extraState['importModule'] : '';
    this.firstAttributes_.actualVariableName = extraState['actualVariableName']
        ? extraState['actualVariableName'] : '';
    this.firstAttributes_.exportedVariable = extraState['exportedVariable']
        ? extraState['exportedVariable'] : false;
    this.updateBlock_();
  },
  updateBlock_: function() {
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
      input.appendField(createFieldDropdownForVariable(varNames), pythonUtils.FIELD_VARIABLE_NAME);
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

Blockly.Extensions.registerMutator('get_python_variable', GET_PYTHON_VARIABLE_MUTATOR_MIXIN);


export const PythonVariableGetterNames = Object.create(null);
export const PythonVariableGetterTooltips = Object.create(null);
export const PythonVariableSetterNames = Object.create(null);
export const PythonVariableSetterTooltips = Object.create(null);


Blockly.Blocks['get_python_module_variable'] = {
  init: function() {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const moduleName = thisBlock.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + moduleName + '.' + varName + '.';

      const varTooltips = PythonVariableGetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('get_python_variable', this, true);
  }
};

pythonGenerator.forBlock['get_python_module_variable'] = function(block, generator) {
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = moduleName + '.' + varName;
  return [code, generator.ORDER_MEMBER];
};

Blockly.Blocks['get_python_class_variable'] = {
  init: function() {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + className + '.' + varName + '.';

      const varTooltips = PythonVariableGetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('get_python_variable', this, true);
  }
};

pythonGenerator.forBlock['get_python_class_variable'] = function(block, generator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = className + '.' + varName;
  return [code, generator.ORDER_MEMBER];
};

Blockly.Blocks['get_python_instance_variable'] = {
  init: function() {
    this.appendDummyInput('VAR')
        .appendField('get')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_GETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Gets the variable ' + varName + ' for the given ' + className + ' object.';

      const varTooltips = PythonVariableGetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('get_python_variable', this, true);
  }
};

pythonGenerator.forBlock['get_python_instance_variable'] = function(block, generator) {
  const selfValue = generator.valueToCode(block, 'SELF', generator.ORDER_MEMBER);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const code = selfValue + '.' + varName;
  return [code, generator.ORDER_MEMBER];
};

// Variable setter blocks

// Block types:
// set_python_module_variable - requires fields FIELD_MODULE_NAME and FIELD_VARIABLE_NAME
// set_python_class_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME
// set_python_instance_variable - requires fields FIELD_CLASS_NAME and FIELD_VARIABLE_NAME

// Extra state fields:
// varType - specified if the type of the variable is known.
// key - specified if the variable names (for a dropdown field) were put in
//       PythonVariableSetterNames and/or the tooltip was put in PythonVariableSetterTooltips.
// selfLabel - specified only for set_python_instance_variable.
// selfType - specified only for set_python_instance_variable.
// importModule - specified if an import statement is needed for the generated python code.
// actualVariableName - specified if the actual variable name is different than the name in the
//     FIELD_VARIABLE_NAME field
// exportedVariable - true if this blocks refers to an exported variable

const SET_PYTHON_VARIABLE_MUTATOR_MIXIN = {
  saveExtraState: function() {
    const extraState = {
    };
    if (this.firstAttributes_.varType) {
      extraState['varType'] = this.firstAttributes_.varType;
    }
    if (this.firstAttributes_.key) {
      extraState['key'] = this.firstAttributes_.key;
    }
    if (this.firstAttributes_.selfLabel) {
      extraState['selfLabel'] = this.firstAttributes_.selfLabel;
    }
    if (this.firstAttributes_.selfType) {
      extraState['selfType'] = this.firstAttributes_.selfType;
    }
    if (this.firstAttributes_.importModule) {
      extraState['importModule'] = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualVariableName) {
      extraState['actualVariableName'] = this.firstAttributes_.actualVariableName;
    }
    extraState['exportedVariable'] = this.firstAttributes_.exportedVariable;
    return extraState;
  },
  loadExtraState: function(extraState) {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.varType = extraState['varType'] ? extraState['varType'] : '';
    this.firstAttributes_.key = extraState['key'] ? extraState['key'] : '';
    this.firstAttributes_.selfLabel = extraState['selfLabel'] ? extraState['selfLabel'] : '';
    this.firstAttributes_.selfType = extraState['selfType'] ? extraState['selfType'] : '';
    this.firstAttributes_.importModule = extraState['importModule']
        ? extraState['importModule'] : '';
    this.firstAttributes_.actualVariableName = extraState['actualVariableName']
        ? extraState['actualVariableName'] : '';
    this.firstAttributes_.exportedVariable = extraState['exportedVariable']
        ? extraState['exportedVariable'] : false;
    this.updateBlock_();
  },
  updateBlock_: function() {
    // The setter has no output plug.
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(false);
    const input = this.getInput('VALUE');
    const varNames = PythonVariableSetterNames[this.firstAttributes_.key];
    if (varNames) {
      // Create the drop-down with the variable names.
      input.appendField(createFieldDropdownForVariable(varNames), pythonUtils.FIELD_VARIABLE_NAME)
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

Blockly.Extensions.registerMutator('set_python_variable', SET_PYTHON_VARIABLE_MUTATOR_MIXIN);

Blockly.Blocks['set_python_module_variable'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const moduleName = thisBlock.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + moduleName + '.' + varName + '.';

      const varTooltips = PythonVariableSetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('set_python_variable', this, true);
  }
};

pythonGenerator.forBlock['set_python_module_variable'] = function(block, generator) {
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = moduleName + '.' + varName + ' = ' + value + ';\n';
  return code;
};

Blockly.Blocks['set_python_class_variable'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + className + '.' + varName + '.';

      const varTooltips = PythonVariableSetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('set_python_variable', this, true);
  }
};

pythonGenerator.forBlock['set_python_class_variable'] = function(block, generator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = className + '.' + varName + ' = ' + value + ';\n';
  return code;
};

Blockly.Blocks['set_python_instance_variable'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_VARIABLE_SETTER);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const varName = thisBlock.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
      let tooltip = 'Sets the variable ' + varName + ' for the given ' + className + ' object.';

      const varTooltips = PythonVariableSetterTooltips[thisBlock.firstAttributes_.key];
      if (varTooltips) {
        const varNames = PythonVariableSetterNames[thisBlock.firstAttributes_.key];
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
    Blockly.Extensions.apply('set_python_variable', this, true);
  }
};

pythonGenerator.forBlock['set_python_instance_variable'] = function(block, generator) {
  const selfValue = generator.valueToCode(block, 'SELF', generator.ORDER_MEMBER);
  const varName = (block.firstAttributes_.actualVariableName)
      ? block.firstAttributes_.actualVariableName : block.getFieldValue(pythonUtils.FIELD_VARIABLE_NAME);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE);
  const code = selfValue + '.' + varName + ' = ' + value + ';\n';
  return code;
};

// Function blocks

// Block types:
// call_python_module_function - requires fields FIELD_MODULE_NAME FIELD_FUNCTION_NAME
// call_python_static_method - requires fields FIELD_CLASS_NAME and FIELD_FUNCTION_NAME
// call_python_constructor - requires fields FIELD_CLASS_NAME
// call_python_instance_method - requires fields FIELD_CLASS_NAME and FIELD_FUNCTION_NAME

// Extra state fields:
// returnType - 'None' no return value. '' for untyped return value.
// args - for instance methods, args[0].name is the self label and args[0].type is the self type.
// tooltip - specified for a custom tooltip.
// importModule - specified if an import statement is needed for the generated python code.
// actualFunctionName - specified if the actual function name is different than the name in the
//     FIELD_FUNCTION_NAME field.
// exportedFunction - true if this blocks refers to an exported function

const CALL_PYTHON_FUNCTION_MUTATOR_MIXIN = {
  saveExtraState: function() {
    const extraState = {
      'args': [],
    };
    if (this.firstAttributes_.returnType) {
      extraState['returnType'] = this.firstAttributes_.returnType;
    }
    if (this.firstAttributes_.tooltip) {
      extraState['tooltip'] = this.firstAttributes_.tooltip;
    }
    for (let i = 0; i < this.firstAttributes_.args.length; i++) {
      extraState['args'].push({
        'name': this.firstAttributes_.args[i].name,
        'type': this.firstAttributes_.args[i].type,
      });
    }
    if (this.firstAttributes_.importModule) {
      extraState['importModule'] = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualFunctionName) {
      extraState['actualFunctionName'] = this.firstAttributes_.actualFunctionName;
    }
    extraState['exportedFunction'] = this.firstAttributes_.exportedFunction;
    return extraState;
  },
  loadExtraState: function(extraState) {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.returnType = extraState['returnType'] ? extraState['returnType'] : '';
    this.firstAttributes_.tooltip = extraState['tooltip'] ? extraState['tooltip'] : '';
    this.firstAttributes_.args = [];
    for (let i = 0; i < extraState['args'].length; i++) {
      this.firstAttributes_.args.push({
        'name': extraState['args'][i].name,
        'type': extraState['args'][i].type,
      });
    }
    this.firstAttributes_.importModule = extraState['importModule']
        ? extraState['importModule'] : '';
    this.firstAttributes_.actualFunctionName = extraState['actualFunctionName']
        ? extraState['actualFunctionName'] : '';
    this.firstAttributes_.exportedFunction = extraState['exportedFunction']
        ? extraState['exportedFunction'] : false;
    this.updateBlock_();
  },
  updateBlock_: function() {
    if (this.firstAttributes_.returnType !== 'None') {
      // Set the output plug.
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      const outputCheck = getOutputCheck(this.firstAttributes_.returnType);
      if (outputCheck) {
        this.setOutput(true, outputCheck);
      } else {
        this.setOutput(true);
      }
    } else {
      // No output plug.
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setOutput(false);
    }
    // Add input sockets.
    for (let i = 0; i < this.firstAttributes_.args.length; i++) {
      const input = this.appendValueInput('ARG' + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.firstAttributes_.args[i].name);
      if (this.firstAttributes_.args[i].type) {
        input.setCheck(getAllowedTypesForSetCheck(this.firstAttributes_.args[i].type));
      }
    }
  }
};

Blockly.Extensions.registerMutator('call_python_function', CALL_PYTHON_FUNCTION_MUTATOR_MIXIN);

Blockly.Blocks['call_python_module_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const moduleName = thisBlock.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const functionName = thisBlock.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + moduleName + '.' + functionName + '.';
      const funcTooltip = thisBlock.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
    Blockly.Extensions.apply('call_python_function', this, true);
  }
};

function generateCodeForArguments(block, generator, startIndex) {
  let code = '';
  if (block.firstAttributes_.args.length - startIndex === 1) {
    code += generator.valueToCode(block, 'ARG' + startIndex, generator.ORDER_NONE) || 'None';
  }
  else {
    let delimiter = '\n' + generator.INDENT + generator.INDENT;
    for (let i = startIndex; i < block.firstAttributes_.args.length; i++) {
      code += delimiter;
      code += generator.valueToCode(block, 'ARG' + i, generator.ORDER_NONE) || 'None';
      delimiter = ',\n' + generator.INDENT + generator.INDENT;
    }
  }
  return code;
}

pythonGenerator.forBlock['call_python_module_function'] = function(block, generator) {
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const functionName = (block.firstAttributes_.actualFunctionName)
      ? block.firstAttributes_.actualFunctionName : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  let code = moduleName + '.' + functionName + '(' +
      generateCodeForArguments(block, generator, 0) + ')';
  if (block.outputConnection) {
    return [code, generator.ORDER_FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

Blockly.Blocks['call_python_static_method'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const functionName = thisBlock.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + className + '.' + functionName + '.';
      const funcTooltip = thisBlock.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
    Blockly.Extensions.apply('call_python_function', this, true);
  }
};

pythonGenerator.forBlock['call_python_static_method'] = function(block, generator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const functionName = (block.firstAttributes_.actualFunctionName)
      ? block.firstAttributes_.actualFunctionName : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  let code = className + '.' + functionName + '(' +
      generateCodeForArguments(block, generator, 0) + ')';
  if (block.outputConnection) {
    return [code, generator.ORDER_FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

Blockly.Blocks['call_python_constructor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('create')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME);
    this.setColour(COLOR_FUNCTION);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      let tooltip = 'Constructs an instance of the class ' + className + '.';
      const constructorTooltip = thisBlock.firstAttributes_.tooltip;
      if (constructorTooltip) {
        tooltip += '\n\n' + constructorTooltip;
      }
      return tooltip;
    });
    Blockly.Extensions.apply('call_python_function', this, true);
  }
};

pythonGenerator.forBlock['call_python_constructor'] = function(block, generator) {
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  let code = className + '(' +
      generateCodeForArguments(block, generator, 0) + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['call_python_instance_method'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const className = thisBlock.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const functionName = thisBlock.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + className + '.' + functionName + '.';
      const funcTooltip = thisBlock.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
    Blockly.Extensions.apply('call_python_function', this, true);
  }
};

pythonGenerator.forBlock['call_python_instance_method'] = function(block, generator) {
  const selfValue = generator.valueToCode(block, 'ARG0', generator.ORDER_MEMBER);
  const functionName = (block.firstAttributes_.actualFunctionName)
      ? block.firstAttributes_.actualFunctionName : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  // Pass 1 to generateCodeForArguments so we skip the self argument.
  let code = selfValue + '.' + functionName + '(' +
      generateCodeForArguments(block, generator, 1) + ')';
  if (block.outputConnection) {
    return [code, generator.ORDER_FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

// Enum blocks

// Block type:
// get_python_enum_value - requires fields FIELD_ENUM_CLASS_NAME and FIELD_ENUM_VALUE

// Required extra state fields:
// enumType

// Optional extra state fields:
// importModule - specified if an import statement is needed for the generated python code.

const GET_PYTHON_ENUM_VALUE_MUTATOR_MIXIN = {
  saveExtraState: function() {
    const extraState = {
      'enumType': this.firstAttributes_.enumType,
    };
    if (this.firstAttributes_.importModule) {
      extraState['importModule'] = this.firstAttributes_.importModule;
    }
    return extraState;
  },
  loadExtraState: function(extraState) {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.enumType = extraState['enumType'];
    this.firstAttributes_.importModule = extraState['importModule'] ? extraState['importModule'] : '';
    this.updateBlock_();
  },
  updateBlock_: function() {
    // Set the output plug.
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.firstAttributes_.enumType);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    // Create the drop-down with the enum values.
    const enumValues = PythonEnumValues[this.firstAttributes_.enumType];
    const enumValueChoices = [];
    for (let i = 0; i < enumValues.length; i++) {
      enumValueChoices.push([enumValues[i], enumValues[i]]);
    }
    this.getInput('ENUM')
        .appendField(new Blockly.FieldDropdown(enumValueChoices), pythonUtils.FIELD_ENUM_VALUE);
  }
};

Blockly.Extensions.registerMutator('get_python_enum_value', GET_PYTHON_ENUM_VALUE_MUTATOR_MIXIN);


export const PythonEnumValues = Object.create(null);
export const PythonEnumTooltips = Object.create(null);

Blockly.Blocks['get_python_enum_value'] = {
  init: function() {
    this.appendDummyInput('ENUM')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_ENUM_CLASS_NAME)
        .appendField('.');
    this.setColour(COLOR_ENUM);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      const enumClassName = thisBlock.getFieldValue(pythonUtils.FIELD_ENUM_CLASS_NAME);
      const enumValue = thisBlock.getFieldValue(pythonUtils.FIELD_ENUM_VALUE);
      let tooltip = 'Gets the enum value ' + enumClassName + '.' + enumValue + '.';
      const enumTooltip = PythonEnumTooltips[enumClassName]
      if (enumTooltip) {
        tooltip += '\n\n' + enumTooltip;
      }
      return tooltip;
    });
    Blockly.Extensions.apply('get_python_enum_value', this, true);
  }
};

pythonGenerator.forBlock['get_python_enum_value'] = function(block, generator) {
  const enumClassName = block.getFieldValue(pythonUtils.FIELD_ENUM_CLASS_NAME);
  const enumValue = block.getFieldValue(pythonUtils.FIELD_ENUM_VALUE);
  if (block.firstAttributes_.importModule) {
    generator.definitions_['import_' + block.firstAttributes_.importModule] =
        'import ' + block.firstAttributes_.importModule;
  }
  const code = enumClassName + '.' + enumValue;
  return [code, generator.ORDER_MEMBER];
};
