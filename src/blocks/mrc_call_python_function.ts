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
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { getAllowedTypesForSetCheck, getOutputCheck } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles'

// A block to call a python function.

export const BLOCK_NAME = 'mrc_call_python_function';

const FUNCTION_KIND_MODULE = 'module';
const FUNCTION_KIND_STATIC = 'static';
const FUNCTION_KIND_CONSTRUCTOR = 'constructor';
const FUNCTION_KIND_INSTANCE = 'instance';
const FUNCTION_KIND_INSTANCE_WITHIN = 'instance_within';

const RETURN_TYPE_NONE = 'None';

export type FunctionArg = {
  name: string,
  type: string,
};

type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  mrcFunctionKind: string, // module, static, constructor, or instance
  mrcReturnType: string,
  mrcArgs: FunctionArg[],
  mrcTooltip: string,
  mrcImportModule: string,
  mrcActualFunctionName: string,
  mrcExportedFunction: boolean,
}
type CallPythonFunctionMixinType = typeof CALL_PYTHON_FUNCTION;

/** Extra state for serialising call_python_* blocks. */
type CallPythonFunctionExtraState = {
  /**
   * The kind of function: module, static, constructor, or instance.
   */
  functionKind: string,
  /**
   * The return type of the function.
   * Use 'None' for no return value.
   * Use '' for an untyped return value.
   */
  returnType: string,
  /**
   * The arguments of the function.
   * For instance methods, args[0].name is the self label and args[0].type is
   * the self type.
   */
  args: FunctionArg[],
  /**
   * Specified for a custom tooltip.
   */
  tooltip?: string,
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
   * True if this blocks refers to an exported function (for example, from a
   * user's Project).
   */
  exportedFunction: boolean,
};

const CALL_PYTHON_FUNCTION = {
  /**
   * Block initialization.
   */
  init: function(this: CallPythonFunctionBlock): void {
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.setTooltip(() => {
      let tooltip: string;
      switch (this.mrcFunctionKind) {
        case FUNCTION_KIND_MODULE: {
          const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + moduleName + '.' + functionName + '.';
          break;
        }
        case FUNCTION_KIND_STATIC: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + className + '.' + functionName + '.';
          break;
        }
        case FUNCTION_KIND_CONSTRUCTOR: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Constructs an instance of the class ' + className + '.';
          break;
        }
        case FUNCTION_KIND_INSTANCE: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + className + '.' + functionName + '.';
          break;
        }
        case FUNCTION_KIND_INSTANCE_WITHIN: {
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the method ' + functionName + '.';
          break;
        }
        default:
          throw new Error('mrcVarKind must be "module", "static", "constructor", or "instance".')
      }
      const funcTooltip = this.mrcTooltip;
      if (funcTooltip) {
        tooltip += '\n\n' + funcTooltip;
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: CallPythonFunctionBlock): CallPythonFunctionExtraState {
    const extraState: CallPythonFunctionExtraState = {
      functionKind: this.mrcFunctionKind,
      returnType: this.mrcReturnType,
      args: [],
      exportedFunction: this.mrcExportedFunction,
    };
    this.mrcArgs.forEach((arg) => {
      extraState.args.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    if (this.mrcTooltip) {
      extraState.tooltip = this.mrcTooltip;
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcActualFunctionName) {
      extraState.actualFunctionName = this.mrcActualFunctionName;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: CallPythonFunctionBlock,
      extraState: CallPythonFunctionExtraState
  ): void {
    this.mrcFunctionKind = extraState.functionKind;
    this.mrcReturnType = extraState.returnType;
    this.mrcArgs = [];
    extraState.args.forEach((arg) => {
      this.mrcArgs.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    this.mrcTooltip = extraState.tooltip ? extraState.tooltip : '';
    this.mrcImportModule = extraState.importModule
        ? extraState.importModule : '';
    this.mrcActualFunctionName = extraState.actualFunctionName
        ? extraState.actualFunctionName : '';
    this.mrcExportedFunction = extraState.exportedFunction
        ? extraState.exportedFunction : false;
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: CallPythonFunctionBlock): void {
    if (this.mrcReturnType !== RETURN_TYPE_NONE) {
      // Set the output plug.
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      const outputCheck = getOutputCheck(this.mrcReturnType);
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
    // Add the dummy input.
    switch (this.mrcFunctionKind) {
      case FUNCTION_KIND_MODULE:
        this.appendDummyInput()
            .appendField('call')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
            .appendField('.')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
        break;
      case FUNCTION_KIND_STATIC:
        this.appendDummyInput()
            .appendField('call')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
            .appendField('.')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
        break;
      case FUNCTION_KIND_CONSTRUCTOR:
        this.appendDummyInput()
            .appendField('create')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
        break;
      case FUNCTION_KIND_INSTANCE:
        this.appendDummyInput()
            .appendField('call')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
            .appendField('.')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
        break;
      case FUNCTION_KIND_INSTANCE_WITHIN:
        this.appendDummyInput()
            .appendField('call')
            .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
        break;
      default:
        throw new Error('mrcVarKind must be "module", "static", "constructor", or "instance".')
    }
    // Add input sockets for the arguments.
    for (let i = 0; i < this.mrcArgs.length; i++) {
      const input = this.appendValueInput('ARG' + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.mrcArgs[i].name);
      if (this.mrcArgs[i].type) {
        input.setCheck(getAllowedTypesForSetCheck(this.mrcArgs[i].type));
      }
    }
  }
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = CALL_PYTHON_FUNCTION;
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: ExtendedPythonGenerator,
) {
  const callPythonFunctionBlock = block as CallPythonFunctionBlock;
  if (callPythonFunctionBlock.mrcImportModule) {
    generator.addImport(callPythonFunctionBlock.mrcImportModule);
  }
  let code;
  let argStartIndex = 0;
  switch (callPythonFunctionBlock.mrcFunctionKind) {
    case FUNCTION_KIND_MODULE: {
      const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = moduleName + '.' + functionName;
      break;
    }
    case FUNCTION_KIND_STATIC: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const className = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = className + '.' + functionName;
      break;
    }
    case FUNCTION_KIND_CONSTRUCTOR: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const className = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      code = className;
      break;
    }
    case FUNCTION_KIND_INSTANCE: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const selfValue = generator.valueToCode(block, 'ARG0', Order.MEMBER);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = selfValue + '.' + functionName;
      argStartIndex = 1; // Skip the self argument.
      break;
    }
    case FUNCTION_KIND_INSTANCE_WITHIN: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = 'self.' + functionName;
      break;
    }
  }
  code += '(' + generateCodeForArguments(callPythonFunctionBlock, generator, argStartIndex) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code; + '\n';
  }
};

function generateCodeForArguments(
    block: CallPythonFunctionBlock,
    generator: ExtendedPythonGenerator,
    startIndex: number) {
  let code = '';
  if (block.mrcArgs.length - startIndex === 1) {
    code += generator.valueToCode(block, 'ARG' + startIndex, Order.NONE) || 'None';
  } else {
    let delimiter = '\n' + generator.INDENT + generator.INDENT;
    for (let i = startIndex; i < block.mrcArgs.length; i++) {
      code += delimiter;
      code += generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'None';
      delimiter = ',\n' + generator.INDENT + generator.INDENT;
    }
  }
  return code;
}
