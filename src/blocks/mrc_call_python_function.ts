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

import { ClassMethodDefExtraState } from './mrc_class_method_def'
import { getClassData, getAllowedTypesForSetCheck, getOutputCheck } from './utils/python';
import { FunctionData, findSuperFunctionData } from './utils/python_json_types';
import * as Value from './utils/value';
import * as Variable from './utils/variable';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles'
import * as ToolboxItems from '../toolbox/items';
import * as CommonStorage from '../storage/common_storage';


// A block to call a python function.

export const BLOCK_NAME = 'mrc_call_python_function';

export enum FunctionKind {
  MODULE = 'module',
  STATIC = 'static',
  CONSTRUCTOR = 'constructor',
  INSTANCE = 'instance',
  INSTANCE_WITHIN = 'instance_within',
  INSTANCE_COMPONENT = 'instance_component',
  EVENT = 'event',
}

export const RETURN_TYPE_NONE = 'None';

const FIELD_MODULE_OR_CLASS_NAME = 'MODULE_OR_CLASS';
const FIELD_FUNCTION_NAME = 'FUNC';
const FIELD_COMPONENT_NAME = 'COMPONENT_NAME';

export type FunctionArg = {
  name: string,
  type: string,
};

// Functions used for creating blocks for the toolbox.

export function addModuleFunctionBlocks(
    moduleName: string,
    functions: FunctionData[],
    contents: ToolboxItems.ContentsType[]) {
  for (const functionData of functions) {
    const block = createModuleFunctionOrStaticMethodBlock(
        FunctionKind.MODULE, moduleName, moduleName, functionData);
    contents.push(block);
  }
}

export function addStaticMethodBlocks(
    importModule: string,
    functions: FunctionData[],
    contents: ToolboxItems.ContentsType[]) {
  for (const functionData of functions) {
    if (functionData.declaringClassName) {
      const block = createModuleFunctionOrStaticMethodBlock(
          FunctionKind.STATIC, importModule, functionData.declaringClassName, functionData);
      contents.push(block);
    }
  }
}

function createModuleFunctionOrStaticMethodBlock(
    functionKind: FunctionKind,
    importModule: string,
    moduleOrClassName: string,
    functionData: FunctionData): ToolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: functionKind,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
    importModule: importModule,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MODULE_OR_CLASS_NAME] = moduleOrClassName;
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  for (let i = 0; i < functionData.args.length; i++) {
    const argData = functionData.args[i];
    extraState.args.push({
      'name': argData.name,
      'type': argData.type,
    });
    // Check if we should plug a variable getter block into the argument input socket.
    const input = Value.valueForFunctionArgInput(argData.type, argData.defaultValue);
    if (input) {
      inputs['ARG' + i] = input;
    }
  }
  let block = new ToolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
  if (functionData.returnType && functionData.returnType != 'None') {
    const varName = Variable.varNameForType(functionData.returnType);
    if (varName) {
      block = Variable.createVariableSetterBlock(varName, block);
    }
  }
  return block;
}

export function addConstructorBlocks(
    importModule: string,
    functions: FunctionData[],
    contents: ToolboxItems.ContentsType[]) {
  for (const functionData of functions) {
    const block = createConstructorBlock(importModule, functionData);
    contents.push(block);
  }
}

function createConstructorBlock(
    importModule: string,
    functionData: FunctionData): ToolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.CONSTRUCTOR,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
    importModule: importModule,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MODULE_OR_CLASS_NAME] = functionData.declaringClassName;
  const inputs: {[key: string]: any} = {};
  for (let i = 0; i < functionData.args.length; i++) {
    const argData = functionData.args[i];
    extraState.args.push({
      'name': argData.name,
      'type': argData.type,
    });
    // Check if we should plug a variable getter block into the argument input socket.
    const input = Value.valueForFunctionArgInput(argData.type, argData.defaultValue);
    if (input) {
      inputs['ARG' + i] = input;
    }
  }
  let block = new ToolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
  if (functionData.returnType && functionData.returnType != 'None') {
    const varName = Variable.varNameForType(functionData.returnType);
    if (varName) {
      block = Variable.createVariableSetterBlock(varName, block);
    }
  }
  return block;
}

export function addInstanceMethodBlocks(
    functions: FunctionData[],
    contents: ToolboxItems.ContentsType[]) {
  for (const functionData of functions) {
    const block = createInstanceMethodBlock(functionData);
    contents.push(block);
  }
}

function createInstanceMethodBlock(
    functionData: FunctionData): ToolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MODULE_OR_CLASS_NAME] = functionData.declaringClassName;
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  for (let i = 0; i < functionData.args.length; i++) {
    const argData = functionData.args[i];
    let argName = argData.name;
    if (i === 0 && argName === 'self' && functionData.declaringClassName) {
      argName = Variable.getSelfArgName(functionData.declaringClassName);
    }
    extraState.args.push({
      'name': argName,
      'type': argData.type,
    });
    // Check if we should plug a variable getter block into the argument input socket.
    const input = Value.valueForFunctionArgInput(argData.type, argData.defaultValue);
    if (input) {
      inputs['ARG' + i] = input;
    }
  }
  let block = new ToolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
  if (functionData.returnType && functionData.returnType != 'None') {
    const varName = Variable.varNameForType(functionData.returnType);
    if (varName) {
      block = Variable.createVariableSetterBlock(varName, block);
    }
  }
  return block;
}

export function getInstanceComponentBlocks(
    componentType: string,
    componentName: string) {
  const contents: ToolboxItems.ContentsType[] = [];

  const classData = getClassData(componentType);
  if (!classData) {
    throw new Error('Could not find classData for ' + componentType);
  }
  const functions = classData.instanceMethods;

  const componentClassData = getClassData('component.Component');
  if (!componentClassData) {
    throw new Error('Could not find classData for component.Component');
  }
  const componentFunctions = componentClassData.instanceMethods;

  for (const functionData of functions) {
    // Skip the functions that are also defined in componentFunctions.
    if (findSuperFunctionData(functionData, componentFunctions)) {
      continue;
    }
    const block = createInstanceComponentBlock(componentName, functionData);
    contents.push(block);
  }

  return contents;
}

function createInstanceComponentBlock(
    componentName: string, functionData: FunctionData): ToolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_COMPONENT,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
    importModule: '',
    componentClassName: functionData.declaringClassName,
    componentName: componentName,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_COMPONENT_NAME] = componentName;
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  // For INSTANCE_COMPONENT functions, the 0 argument is 'self', but
  // self is represented by the FIELD_COMPONENT_NAME field.
  // We don't include the arg or input for self.
  for (let i = 1; i < functionData.args.length; i++) {
    const argData = functionData.args[i];
    let argName = argData.name;
    extraState.args.push({
      'name': argName,
      'type': argData.type,
    });
    // Check if we should plug a variable getter block into the argument input socket.
    const input = Value.valueForFunctionArgInput(argData.type, argData.defaultValue);
    if (input) {
      // Because we skipped the self argument, use i - 1 when filling the inputs array.
      inputs['ARG' + (i - 1)] = input;
    }
  }
  let block = new ToolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
  if (functionData.returnType && functionData.returnType != 'None') {
    const varName = Variable.varNameForType(functionData.returnType);
    if (varName) {
      block = Variable.createVariableSetterBlock(varName, block);
    }
  }
  return block;
}

//..............................................................................

export type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  mrcFunctionKind: FunctionKind,
  mrcReturnType: string,
  mrcArgs: FunctionArg[],
  mrcTooltip: string,
  mrcImportModule: string,
  mrcActualFunctionName: string,
  mrcExportedFunction: boolean,
  mrcComponentClassName: string,
  mrcComponentName: string, // Do not access directly. Call getComponentName.
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
   * True if this blocks refers to an exported function (for example, from the Robot).
   */
  exportedFunction?: boolean,
  /**
   * The component name. Specified only if the function kind is INSTANCE_COMPONENT.
   */
  componentName?: string,
  /**
   * The component class name. Specified only if the function kind is INSTANCE_COMPONENT.
   */
  componentClassName?: string,
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
          const moduleName = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the module function ' + moduleName + '.' + functionName + '.';
          break;
        }
        case FunctionKind.STATIC: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the static method ' + className + '.' + functionName + '.';
          break;
        }
        case FunctionKind.CONSTRUCTOR: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          tooltip = 'Constructs an instance of the class ' + className + '.';
          break;
        }
        case FunctionKind.INSTANCE: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the instance method ' + className + '.' + functionName + '.';
          break;
        }
        case FunctionKind.INSTANCE_WITHIN: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the instance method ' + functionName + '.';
          break;
        }
        case FunctionKind.EVENT: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Fires the event ' + functionName + '.';
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const className = this.mrcComponentClassName;
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the instance method ' + className + '.' + functionName +
              ' on the component named ' + this.getComponentName() + '.';
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
    if (this.mrcComponentClassName) {
      extraState.componentClassName = this.mrcComponentClassName;
    }
    if (this.getField(FIELD_COMPONENT_NAME)) {
      extraState.componentName = this.getComponentName();
    }
    if (this.mrcExportedFunction) {
      extraState.exportedFunction = this.mrcExportedFunction;
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
    this.mrcComponentClassName = extraState.componentClassName
        ? extraState.componentClassName : '';
    this.mrcComponentName = extraState.componentName
        ? extraState.componentName : '';
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
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.STATIC:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.CONSTRUCTOR:
          this.appendDummyInput('TITLE')
              .appendField('create')
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME);
          break;
        case FunctionKind.INSTANCE:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.INSTANCE_WITHIN: {
          const input = this.getInput('TITLE');
          if (!input) {
            this.appendDummyInput('TITLE')
                .appendField('call')
                .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          }
          break;
        }
        case FunctionKind.EVENT: {
          const input = this.getInput('TITLE');
          if (!input) {
            this.appendDummyInput('TITLE')
                .appendField('fire')
                .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          }
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const componentNames: string[] = [];
          // Get the list of component names whose type matches this.mrcComponentClassName so we can
          // create a dropdown that has the appropriate component names.
          const editor = Editor.getEditorForBlocklyWorkspace(this.workspace);
          if (editor) {
            const components = editor.getComponentsFromRobot();
            components.forEach(component => {
              if (component.className === this.mrcComponentClassName) {
                componentNames.push(component.name);
              }
            });
          }
          const componentName = this.getComponentName();
          if (!componentNames.includes(componentName)) {
            componentNames.push(componentName);
          }
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldDropdown(componentNames), FIELD_COMPONENT_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
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
  getComponentName(this: CallPythonFunctionBlock): string {
    // If the COMPONENT_NAME field has been created, get the field value, which the user may have changed.
    // If the COMPONENT_NAME field has not been created, get the component name from this.mrcComponentName.
    return (this.getField(FIELD_COMPONENT_NAME))
      ? this.getFieldValue(FIELD_COMPONENT_NAME) : this.mrcComponentName;
  },
  getComponentClassName(this: CallPythonFunctionBlock): string {
    return this.mrcComponentClassName;
  },
  renameMethod: function(this: CallPythonFunctionBlock, newName: string): void {
    this.setFieldValue(newName, FIELD_FUNCTION_NAME);
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
      const moduleName = block.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = moduleName + '.' + functionName;
      break;
    }
    case FunctionKind.STATIC: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const className = block.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = className + '.' + functionName;
      break;
    }
    case FunctionKind.CONSTRUCTOR: {
      const className = block.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      code = className;
      break;
    }
    case FunctionKind.INSTANCE: {
      const callPythonFunctionBlock = block as CallPythonFunctionBlock;
      const selfValue = generator.valueToCode(block, 'ARG0', Order.MEMBER);
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = selfValue + '.' + functionName;
      argStartIndex = 1; // Skip the self argument.
      break;
    }
    case FunctionKind.INSTANCE_WITHIN: {
      const blocklyName = block.getFieldValue(FIELD_FUNCTION_NAME);
      const functionName = generator.getProcedureName(blocklyName);
      code = 'self.' + functionName;
      break;
    }
    case FunctionKind.EVENT: {
      const blocklyName = block.getFieldValue(FIELD_FUNCTION_NAME);
      const functionName = generator.getProcedureName(blocklyName);
      code = 'if self.events.get("' + functionName + '", None):\n' + generator.INDENT + 'self.events["' + functionName + '"]';
      break;
    }
    case FunctionKind.INSTANCE_COMPONENT: {
      const componentName = callPythonFunctionBlock.getComponentName();
      const functionName = callPythonFunctionBlock.mrcActualFunctionName
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      // Generate the correct code depending on the module type.
      switch (generator.getModuleType()) {
        case CommonStorage.MODULE_TYPE_ROBOT:
        case CommonStorage.MODULE_TYPE_MECHANISM:
          code = 'self.';
          break;
        case CommonStorage.MODULE_TYPE_OPMODE:
        default:
          code = 'self.robot.';
          break;
      }
      code += componentName + '.' + functionName;
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
      callBlock.getFieldValue(FIELD_FUNCTION_NAME) === name
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
