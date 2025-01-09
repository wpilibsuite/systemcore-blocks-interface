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

import * as pythonUtils from './utils/generated/python';
import { createNonEditableField } from './utils/blocks';
import { getAllowedTypesForSetCheck, getOutputCheck, addImport } from './utils/python';


const COLOR_FUNCTION = 270;        // blue-magenta

export type FunctionArg = {
  name: string,
  type: string,
};

/** Extra state for serialising call_python_* blocks. */
type CallPythonFunctionExtraState = {
  /**
   * The return type of the function.
   * Use 'None' for no return value.
   * Use '' for an untyped return value.
   */
  returnType: string,
  /**
   * Specified for a custom tooltip.
   */
  tooltip?: string,
  /**
   * The arguments of the function.
   * For instance methods, args[0].name is the self label and args[0].type is
   * the self type.
   */
  args: FunctionArg[],
  /**
   * Specified if an import statement is needed for the generated python code.
   */
  importModule?: string,
  /**
   * Specified if the actual function name is different than the name given in
   * the FIELD_FUNCTION_NAME field.
   */
  actualFunctionName?: string,
  /**
   * True if this blocks refers to an exported function.
   */
  exportedFunction: boolean,
};

// Block definitions for function blocks

// Block types:
// call_python_module_function - requires fields FIELD_MODULE_NAME FIELD_FUNCTION_NAME
// call_python_static_method - requires fields FIELD_CLASS_NAME and FIELD_FUNCTION_NAME
// call_python_constructor - requires fields FIELD_CLASS_NAME
// call_python_instance_method - requires fields FIELD_CLASS_NAME and FIELD_FUNCTION_NAME

/** Type of a block using the CALL_PYTHON_FUNCTION_COMMON mixin. */
type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  firstAttributes_: any; // HeyLiz fix this!
}
type CallPythonFunctionMixinType = typeof CALL_PYTHON_FUNCTION_COMMON;

/**
 * Common properties for call_python_* blocks.
 */
const CALL_PYTHON_FUNCTION_COMMON = {
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: CallPythonFunctionBlock): CallPythonFunctionExtraState {
    const extraState: CallPythonFunctionExtraState = {
      returnType: '',
      args: [],
      exportedFunction: false,
    };
    if (this.firstAttributes_.returnType) {
      extraState.returnType = this.firstAttributes_.returnType;
    }
    if (this.firstAttributes_.tooltip) {
      extraState.tooltip = this.firstAttributes_.tooltip;
    }
    this.firstAttributes_.args.forEach((arg) => {
      extraState.args.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    if (this.firstAttributes_.importModule) {
      extraState.importModule = this.firstAttributes_.importModule;
    }
    if (this.firstAttributes_.actualFunctionName) {
      extraState.actualFunctionName = this.firstAttributes_.actualFunctionName;
    }
    extraState.exportedFunction = this.firstAttributes_.exportedFunction;
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: CallPythonFunctionBlock,
      extraState: CallPythonFunctionExtraState
  ): void {
    if (!this.firstAttributes_) {
      this.firstAttributes_ = Object.create(null);
    }
    this.firstAttributes_.returnType = extraState.returnType ? extraState.returnType : '';
    this.firstAttributes_.tooltip = extraState.tooltip ? extraState.tooltip : '';
    this.firstAttributes_.args = [];
    extraState.args.forEach((arg) => {
      this.firstAttributes_.args.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    this.firstAttributes_.importModule = extraState.importModule
        ? extraState.importModule : '';
    this.firstAttributes_.actualFunctionName = extraState.actualFunctionName
        ? extraState.actualFunctionName : '';
    this.firstAttributes_.exportedFunction = extraState.exportedFunction
        ? extraState.exportedFunction : false;
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: CallPythonFunctionBlock): void {
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

Blockly.Blocks['call_python_module_function'] = {
  ...CALL_PYTHON_FUNCTION_COMMON,
  init: function(this: CallPythonFunctionBlock): void {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_MODULE_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    this.setTooltip(() => {
      const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
      const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + moduleName + '.' + functionName + '.';
      const funcTooltip = this.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
  }
};

pythonGenerator.forBlock['call_python_module_function'] = function(
    block: Blockly.Block, generator: PythonGenerator) {
  const callPythonFunctionBlock = block as CallPythonFunctionBlock;
  const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_NAME);
  const functionName = (callPythonFunctionBlock.firstAttributes_.actualFunctionName)
      ? callPythonFunctionBlock.firstAttributes_.actualFunctionName
      : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  if (callPythonFunctionBlock.firstAttributes_.importModule) {
    addImport(generator, callPythonFunctionBlock.firstAttributes_.importModule);
  }
  let code = moduleName + '.' + functionName + '(' +
      generateCodeForArguments(callPythonFunctionBlock, generator, 0) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

Blockly.Blocks['call_python_static_method'] = {
  ...CALL_PYTHON_FUNCTION_COMMON,
  init: function(this: CallPythonFunctionBlock): void {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + className + '.' + functionName + '.';
      const funcTooltip = this.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
  }
};

pythonGenerator.forBlock['call_python_static_method'] = function(
    block: Blockly.Block, generator: PythonGenerator) {
  const callPythonFunctionBlock = block as CallPythonFunctionBlock;
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  const functionName = (callPythonFunctionBlock.firstAttributes_.actualFunctionName)
      ? callPythonFunctionBlock.firstAttributes_.actualFunctionName
      : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  if (callPythonFunctionBlock.firstAttributes_.importModule) {
    addImport(generator, callPythonFunctionBlock.firstAttributes_.importModule);
  }
  let code = className + '.' + functionName + '(' +
      generateCodeForArguments(callPythonFunctionBlock, generator, 0) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

Blockly.Blocks['call_python_constructor'] = {
  ...CALL_PYTHON_FUNCTION_COMMON,
  init: function(this: CallPythonFunctionBlock): void {
    this.appendDummyInput()
        .appendField('create')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME);
    this.setColour(COLOR_FUNCTION);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      let tooltip = 'Constructs an instance of the class ' + className + '.';
      const constructorTooltip = this.firstAttributes_.tooltip;
      if (constructorTooltip) {
        tooltip += '\n\n' + constructorTooltip;
      }
      return tooltip;
    });
  }
};

pythonGenerator.forBlock['call_python_constructor'] = function(
    block: Blockly.Block, generator: PythonGenerator) {
  const callPythonFunctionBlock = block as CallPythonFunctionBlock;
  const className = block.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
  if (callPythonFunctionBlock.firstAttributes_.importModule) {
    addImport(generator, callPythonFunctionBlock.firstAttributes_.importModule);
  }
  let code = className + '(' +
      generateCodeForArguments(callPythonFunctionBlock, generator, 0) + ')';
  return [code, Order.FUNCTION_CALL];
};

Blockly.Blocks['call_python_instance_method'] = {
  ...CALL_PYTHON_FUNCTION_COMMON,
  init: function(this: CallPythonFunctionBlock): void {
    this.appendDummyInput()
        .appendField('call')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_CLASS_NAME)
        .appendField('.')
        .appendField(createNonEditableField(''), pythonUtils.FIELD_FUNCTION_NAME);
    this.setColour(COLOR_FUNCTION);
    this.setTooltip(() => {
      const className = this.getFieldValue(pythonUtils.FIELD_CLASS_NAME);
      const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      let tooltip = 'Calls the function ' + className + '.' + functionName + '.';
      const funcTooltip = this.firstAttributes_.tooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
  }
};

pythonGenerator.forBlock['call_python_instance_method'] = function(
    block: Blockly.Block, generator: PythonGenerator) {
  const callPythonFunctionBlock = block as CallPythonFunctionBlock;
  const selfValue = generator.valueToCode(block, 'ARG0', Order.MEMBER);
  const functionName = (callPythonFunctionBlock.firstAttributes_.actualFunctionName)
      ? callPythonFunctionBlock.firstAttributes_.actualFunctionName
      : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
  // Pass 1 to generateCodeForArguments so we skip the self argument.
  let code = selfValue + '.' + functionName + '(' +
      generateCodeForArguments(callPythonFunctionBlock, generator, 1) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code + ';\n';
  }
};

function generateCodeForArguments(
    block: CallPythonFunctionBlock, generator: PythonGenerator,
    startIndex: number) {
  let code = '';
  if (block.firstAttributes_.args.length - startIndex === 1) {
    code += generator.valueToCode(block, 'ARG' + startIndex, Order.NONE) || 'None';
  }
  else {
    let delimiter = '\n' + generator.INDENT + generator.INDENT;
    for (let i = startIndex; i < block.firstAttributes_.args.length; i++) {
      code += delimiter;
      code += generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'None';
      delimiter = ',\n' + generator.INDENT + generator.INDENT;
    }
  }
  return code;
}
