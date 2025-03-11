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
import { Order } from 'blockly/python';

import * as pythonUtils from './utils/generated/python';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { getAllowedTypesForSetCheck, getOutputCheck } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles'
import { ClassMethodDefExtraState } from './mrc_class_method_def'

// A block to call a python function.

export const BLOCK_NAME = 'mrc_call_python_function';

enum FunctionKind {
  MODULE = 'module',
  STATIC = 'static',
  CONSTRUCTOR = 'constructor',
  INSTANCE = 'instance',
  INSTANCE_WITHIN = 'instance_within',
}

const RETURN_TYPE_NONE = 'None';

export type FunctionArg = {
  name: string,
  type: string,
};

export type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  mrcFunctionKind: FunctionKind,
  mrcReturnType: string,
  mrcArgs: FunctionArg[],
  mrcTooltip: string,
  mrcImportModule: string,
  mrcActualFunctionName: string,
  mrcExportedFunction: boolean,
  renameMethod(this: CallPythonFunctionBlock, newName: string): void;
  mutateMethod(this: CallPythonFunctionBlock, defBlockExtraState: ClassMethodDefExtraState): void;
}
type CallPythonFunctionMixinType = typeof CALL_PYTHON_FUNCTION;

/** Extra state for serialising call_python_* blocks. */
type CallPythonFunctionExtraState = {
  /**
   * The kind of function. Must be one of the FunctionKind enum values as a string.
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
        case FunctionKind.MODULE: {
          const moduleName = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + moduleName + '.' + functionName + '.';
          break;
        }
        case FunctionKind.STATIC: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + className + '.' + functionName + '.';
          break;
        }
        case FunctionKind.CONSTRUCTOR: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Constructs an instance of the class ' + className + '.';
          break;
        }
        case FunctionKind.INSTANCE: {
          const className = this.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the function ' + className + '.' + functionName + '.';
          break;
        }
        case FunctionKind.INSTANCE_WITHIN: {
          const functionName = this.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
          tooltip = 'Calls the method ' + functionName + '.';
          break;
        }
        default:
          throw new Error('mrcFunctionKind has unexpected value: ' + this.mrcFunctionKind)
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
    this.mrcFunctionKind = extraState.functionKind as FunctionKind;
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

    if (!this.getInput('TITLE')) {
      // Add the dummy input.
      switch (this.mrcFunctionKind) {
        case FunctionKind.MODULE:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.STATIC:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.CONSTRUCTOR:
          this.appendDummyInput('TITLE')
              .appendField('create')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
          break;
        case FunctionKind.INSTANCE:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.INSTANCE_WITHIN: {
          const input = this.getInput('TITLE');
          if (!input) {
            this.appendDummyInput('TITLE')
                .appendField('call')
                .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_FUNCTION_NAME);
          }
          break;
        }
        default:
          throw new Error('mrcFunctionKind has unexpected value: ' + this.mrcFunctionKind)
      }
    }

    // Update input sockets for the arguments.
    for (let i = 0; i < this.mrcArgs.length; i++) {
      const argName = this.mrcArgs[i].name;
      let argInput = this.getInput('ARG' + i);
      const argField = this.getField('ARGNAME' + i);
      if (argInput && argField) {
        // Ensure argument name is up to date. No need to fire a change event.
        Blockly.Events.disable();
        try {
          argField.setValue(argName);
        } finally {
          Blockly.Events.enable();
        }
      } else {
        // Add new input.
        argInput = this.appendValueInput('ARG' + i)
            .setAlign(Blockly.inputs.Align.RIGHT)
            .appendField(argName, 'ARGNAME' + i);
      }
      if (this.mrcArgs[i].type) {
        argInput.setCheck(getAllowedTypesForSetCheck(this.mrcArgs[i].type));
      }
    }
    // Remove deleted inputs.
    for (let i = this.mrcArgs.length; this.getInput('ARG' + i); i++) {
      this.removeInput('ARG' + i);
    }
  },
  renameMethod: function(this: CallPythonFunctionBlock, newName: string): void {
    this.setFieldValue(newName, pythonUtils.FIELD_FUNCTION_NAME);
  },
  mutateMethod: function(
      this: CallPythonFunctionBlock,
      defBlockExtraState: ClassMethodDefExtraState
  ): void {
    this.mrcReturnType = defBlockExtraState.returnType;
    this.mrcArgs = [];
    defBlockExtraState.params.forEach((param) => {
      this.mrcArgs.push({
        'name': param.name,
        'type': param.type ?? '',
      });
    });
    this.updateBlock_();
  },
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
    case FunctionKind.MODULE: {
      const moduleName = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = moduleName + '.' + functionName;
      break;
    }
    case FunctionKind.STATIC: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const className = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = className + '.' + functionName;
      break;
    }
    case FunctionKind.CONSTRUCTOR: {
      const className = block.getFieldValue(pythonUtils.FIELD_MODULE_OR_CLASS_NAME);
      code = className;
      break;
    }
    case FunctionKind.INSTANCE: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const selfValue = generator.valueToCode(block, 'ARG0', Order.MEMBER);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      code = selfValue + '.' + functionName;
      argStartIndex = 1; // Skip the self argument.
      break;
    }
    case FunctionKind.INSTANCE_WITHIN: {
      const blocklyName = block.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME);
      const functionName = generator.getProcedureName(blocklyName);
      code = 'self.' + functionName;
      break;
    }
    default:
      throw new Error('mrcFunctionKind has unexpected value: ' + callPythonFunctionBlock.mrcFunctionKind)
  }
  code += '(' + generateCodeForArguments(callPythonFunctionBlock, generator, argStartIndex) + ')';
  if (block.outputConnection) {
    return [code, Order.FUNCTION_CALL];
  } else {
    return code + '\n';
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

function getMethodCallers(workspace: Blockly.Workspace, name: string): Blockly.Block[] {
  return workspace.getBlocksByType('mrc_call_python_function').filter((block) => {
    const callBlock = block as CallPythonFunctionBlock;
    return (
      callBlock.mrcFunctionKind === FunctionKind.INSTANCE_WITHIN &&
      callBlock.getFieldValue(pythonUtils.FIELD_FUNCTION_NAME) === name
    );
  });
}

export function renameMethodCallers(workspace: Blockly.Workspace, oldName: string, newName: string): void {
  for (const block of getMethodCallers(workspace, oldName)) {
    (block as CallPythonFunctionBlock).renameMethod(newName);
  }
}

export function mutateMethodCallers(
    workspace: Blockly.Workspace, methodName: string, defBlockExtraState: ClassMethodDefExtraState) {
  const oldRecordUndo = Blockly.Events.getRecordUndo();

  for (const block of getMethodCallers(workspace, methodName)) {
    const callBlock = block as CallPythonFunctionBlock;
    // Get the extra state before changing the call block.
    const oldExtraState = callBlock.saveExtraState();

    // Apply the changes.
    callBlock.mutateMethod(defBlockExtraState);

    // Get the extra state after changing the call block.
    const newExtraState = callBlock.saveExtraState();
    if (oldExtraState !== newExtraState) {
      // Fire a change event, but don't record it as an undoable action.
      Blockly.Events.setRecordUndo(false);
      Blockly.Events.fire(
        new (Blockly.Events.get(Blockly.Events.BLOCK_CHANGE))(
          callBlock,
          'mutation',
          null,
          oldExtraState,
          newExtraState,
        ),
      );
      Blockly.Events.setRecordUndo(oldRecordUndo);
    }
  }
}
