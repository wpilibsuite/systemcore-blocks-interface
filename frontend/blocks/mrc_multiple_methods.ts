/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview A block that calls one of the many methods of a single python
 * object. The methods are described by JSON, organized into groups. The user
 * picks a group from the first dropdown and a method in that group from the
 * second dropdown. The selected method determines the block's fields, inputs,
 * and whether the block has an output.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { getAllowedTypesForSetCheck, getOutputCheck } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';
import * as toolboxItems from '../toolbox/items';

export const BLOCK_NAME = 'mrc_multiple_methods';

const INPUT_TITLE = 'TITLE';
const FIELD_GROUP = 'GROUP';
const FIELD_METHOD = 'METHOD';
const INPUT_PARAM_PREFIX = 'PARAM_';
const FIELD_PARAM_PREFIX = 'PARAM_';
const FIELD_PARAM_LABEL_PREFIX = 'LABEL_';

const RETURN_TYPE_NONE = 'None';

/** A parameter of a method. */
export type ParameterDefinition = {
  /** The python name of the parameter. Must be unique within the method. */
  name: string,
  /** The text shown on the block. Defaults to name. */
  label?: string,
  /**
   * The python type of the parameter, for example 'float', 'str', 'bool', or a
   * class name. Used to set the check on the input socket, or to choose the
   * kind of field when field is true.
   */
  type?: string,
  /** The default value, as a python literal. */
  defaultValue?: string,
  /**
   * If true, the parameter is edited with a field (number, text, or checkbox,
   * depending on type) instead of a value input socket.
   */
  field?: boolean,
  /**
   * If specified, the parameter is edited with a dropdown field. Each option is
   * either a python expression or a [label, python expression] pair.
   */
  options?: (string | [string, string])[],
};

/** A method in a group. */
export type MethodDefinition = {
  /** The python name of the method. Must be unique within the group. */
  name: string,
  /** The text shown in the dropdown. Defaults to name. */
  label?: string,
  tooltip?: string,
  parameters?: ParameterDefinition[],
  /** The python return type. If omitted or 'None', the block is a statement. */
  returnType?: string,
};

/** A group of methods. */
export type GroupDefinition = {
  /** The name shown in the dropdown. Must be unique within the object. */
  name: string,
  methods: MethodDefinition[],
};

/** A python object and its methods, organized into groups. */
export type ObjectDefinition = {
  /**
   * The python expression that all of the methods are called on, for example
   * 'self.robot.drive'.
   */
  pythonObject: string,
  /** Specified if an import statement is needed for the generated python code. */
  importModule?: string,
  groups: GroupDefinition[],
};

type MultipleMethodsExtraState = ObjectDefinition & {
  /** The name of the selected group. Defaults to the first group. */
  group?: string,
  /** The name of the selected method. Defaults to the first method in the group. */
  method?: string,
};

export type MultipleMethodsBlock = Blockly.Block & MultipleMethodsMixin;
interface MultipleMethodsMixin extends MultipleMethodsMixinType {
  mrcPythonObject: string,
  mrcImportModule: string,
  mrcGroups: GroupDefinition[],
  mrcGroupName: string,
  mrcMethodName: string,
  /** Maps parameter name to the signature of the input that was created for it. */
  mrcParamSignatures: {[paramName: string]: string},
}
type MultipleMethodsMixinType = typeof MULTIPLE_METHODS;

const MULTIPLE_METHODS = {
  /**
   * Block initialization.
   */
  init: function(this: MultipleMethodsBlock): void {
    this.mrcPythonObject = '';
    this.mrcImportModule = '';
    this.mrcGroups = [];
    this.mrcGroupName = '';
    this.mrcMethodName = '';
    this.mrcParamSignatures = {};
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(() => this.getMethod_()?.tooltip ?? '');
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(this: MultipleMethodsBlock): MultipleMethodsExtraState {
    const extraState: MultipleMethodsExtraState = {
      pythonObject: this.mrcPythonObject,
      groups: this.mrcGroups,
      group: this.mrcGroupName,
      method: this.mrcMethodName,
    };
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: MultipleMethodsBlock,
      extraState: MultipleMethodsExtraState
  ): void {
    this.mrcPythonObject = extraState.pythonObject;
    this.mrcImportModule = extraState.importModule ?? '';
    this.mrcGroups = extraState.groups ?? [];
    this.mrcGroupName = extraState.group ?? '';
    if (!this.getGroup_()) {
      this.mrcGroupName = this.mrcGroups[0]?.name ?? '';
    }
    this.mrcMethodName = extraState.method ?? '';
    if (!this.getMethod_()) {
      this.mrcMethodName = this.getGroup_()?.methods[0]?.name ?? '';
    }
    this.createTitle_();
    this.syncDropdowns_();
    this.updateShape_();
  },
  getGroup_: function(this: MultipleMethodsBlock): GroupDefinition | undefined {
    return this.mrcGroups.find(g => g.name === this.mrcGroupName);
  },
  getMethod_: function(this: MultipleMethodsBlock): MethodDefinition | undefined {
    return this.getGroup_()?.methods.find(m => m.name === this.mrcMethodName);
  },
  createTitle_: function(this: MultipleMethodsBlock): void {
    if (this.getInput(INPUT_TITLE)) {
      return;
    }
    const groupField = new Blockly.FieldDropdown(
        () => menuOptions(this.mrcGroups.map(g => [g.name, g.name])));
    groupField.setValidator((newValue: string) => {
      this.onGroupChanged_(newValue);
      return undefined;
    });
    const methodField = new Blockly.FieldDropdown(
        () => menuOptions((this.getGroup_()?.methods ?? []).map(m => [m.label ?? m.name, m.name])));
    methodField.setValidator((newValue: string) => {
      this.onMethodChanged_(newValue);
      return undefined;
    });
    this.appendDummyInput(INPUT_TITLE)
        .appendField(Blockly.Msg.CALL)
        .appendField(groupField, FIELD_GROUP)
        .appendField(methodField, FIELD_METHOD);
  },
  /**
   * Sets the dropdown values to match mrcGroupName and mrcMethodName without
   * firing events or running the shape update in the validators.
   */
  syncDropdowns_: function(this: MultipleMethodsBlock): void {
    const groupField = this.getField(FIELD_GROUP) as Blockly.FieldDropdown;
    const methodField = this.getField(FIELD_METHOD) as Blockly.FieldDropdown;
    // The method options depend on the group. Regenerate them so the cached
    // options don't cause the new value to be rejected.
    groupField.getOptions(false);
    methodField.getOptions(false);
    Blockly.Events.disable();
    try {
      if (this.mrcGroupName) {
        groupField.setValue(this.mrcGroupName);
      }
      if (this.mrcMethodName) {
        methodField.setValue(this.mrcMethodName);
      }
    } finally {
      Blockly.Events.enable();
    }
  },
  onGroupChanged_: function(this: MultipleMethodsBlock, newGroupName: string): void {
    if (newGroupName === this.mrcGroupName) {
      return;
    }
    const oldExtraState = JSON.stringify(this.saveExtraState());
    this.mrcGroupName = newGroupName;
    this.mrcMethodName = this.getGroup_()?.methods[0]?.name ?? '';
    this.syncDropdowns_();
    this.updateShape_();
    this.fireMutationEvent_(oldExtraState);
  },
  onMethodChanged_: function(this: MultipleMethodsBlock, newMethodName: string): void {
    if (newMethodName === this.mrcMethodName) {
      return;
    }
    const oldExtraState = JSON.stringify(this.saveExtraState());
    this.mrcMethodName = newMethodName;
    this.updateShape_();
    this.fireMutationEvent_(oldExtraState);
  },
  /**
   * Fires a mutation event so that undo restores both dropdowns and the shape
   * together. Undoing only the field change events isn't enough because the
   * method dropdown's options depend on the group.
   */
  fireMutationEvent_: function(this: MultipleMethodsBlock, oldExtraState: string): void {
    const newExtraState = JSON.stringify(this.saveExtraState());
    if (oldExtraState !== newExtraState) {
      Blockly.Events.fire(new Blockly.Events.BlockChange(
          this, 'mutation', null, oldExtraState, newExtraState));
    }
  },
  /**
   * Updates the connections, fields, and inputs to match the selected method.
   * Parameters that are unchanged keep their input, so attached blocks and
   * field values are preserved when switching between similar methods.
   */
  updateShape_: function(this: MultipleMethodsBlock): void {
    const method = this.getMethod_();
    this.updateConnections_(method?.returnType ?? RETURN_TYPE_NONE);

    const params = method?.parameters ?? [];
    const desiredSignatures: {[paramName: string]: string} = {};
    params.forEach(param => {
      desiredSignatures[param.name] = paramSignature(param);
    });

    // Remove inputs for parameters that no longer exist or have changed kind.
    for (const paramName of Object.keys(this.mrcParamSignatures)) {
      if (desiredSignatures[paramName] !== this.mrcParamSignatures[paramName]) {
        this.removeInput(INPUT_PARAM_PREFIX + paramName, true);
        delete this.mrcParamSignatures[paramName];
      }
    }

    for (const param of params) {
      const inputName = INPUT_PARAM_PREFIX + param.name;
      const label = param.label ?? param.name;
      if (this.getInput(inputName)) {
        const labelField = this.getField(FIELD_PARAM_LABEL_PREFIX + param.name);
        if (labelField && labelField.getValue() !== label) {
          Blockly.Events.disable();
          try {
            labelField.setValue(label);
          } finally {
            Blockly.Events.enable();
          }
        }
      } else {
        this.createParamInput_(param);
        this.mrcParamSignatures[param.name] = desiredSignatures[param.name];
      }
      // Move each input to the end, in order, so the inputs match the parameter order.
      this.moveInputBefore(inputName, null);
    }
  },
  updateConnections_: function(this: MultipleMethodsBlock, returnType: string): void {
    if (returnType !== RETURN_TYPE_NONE) {
      if (this.previousConnection?.isConnected() || this.nextConnection?.isConnected()) {
        this.unplug(true);
        this.nextConnection?.disconnect();
      }
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      const outputCheck = getOutputCheck(returnType);
      this.setOutput(true, outputCheck ? outputCheck : null);
    } else {
      if (this.outputConnection?.isConnected()) {
        this.unplug();
      }
      this.setOutput(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  },
  createParamInput_: function(
      this: MultipleMethodsBlock,
      param: ParameterDefinition
  ): void {
    const inputName = INPUT_PARAM_PREFIX + param.name;
    const label = param.label ?? param.name;
    const field = createParamField(param);
    if (field) {
      this.appendDummyInput(inputName)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(label, FIELD_PARAM_LABEL_PREFIX + param.name)
          .appendField(field, FIELD_PARAM_PREFIX + param.name);
      return;
    }
    const input = this.appendValueInput(inputName)
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField(label, FIELD_PARAM_LABEL_PREFIX + param.name);
    if (param.type) {
      input.setCheck(getAllowedTypesForSetCheck(param.type));
    }
    // Always add the default shadow. Saved or undone state that has its own
    // shadow replaces it when the input blocks are loaded.
    const shadowState = defaultShadowState(param);
    if (shadowState) {
      input.connection?.setShadowState(shadowState);
    }
  },
};

function menuOptions(options: [string, string][]): Blockly.MenuOption[] {
  // A dropdown must have at least one option.
  return options.length ? options : [[' ', '']];
}

function paramSignature(param: ParameterDefinition): string {
  return JSON.stringify({
    type: param.type ?? '',
    field: !!param.field,
    options: param.options ?? null,
  });
}

function normalizeOptions(options: (string | [string, string])[]): [string, string][] {
  return options.map(option => typeof option === 'string' ? [option, option] : option);
}

function unquote(pythonString: string): string {
  if (pythonString.length >= 2 &&
      (pythonString.startsWith("'") && pythonString.endsWith("'") ||
       pythonString.startsWith('"') && pythonString.endsWith('"'))) {
    return pythonString.substring(1, pythonString.length - 1);
  }
  return pythonString;
}

/**
 * Creates the field for a parameter, or returns null if the parameter should
 * use a value input socket.
 */
function createParamField(param: ParameterDefinition): Blockly.Field | null {
  if (param.options) {
    const options = normalizeOptions(param.options);
    const dropdown = new Blockly.FieldDropdown(menuOptions(options));
    if (param.defaultValue && options.some(option => option[1] === param.defaultValue)) {
      dropdown.setValue(param.defaultValue);
    }
    return dropdown;
  }
  if (!param.field) {
    return null;
  }
  switch (param.type) {
    case 'int':
      return new Blockly.FieldNumber(Number(param.defaultValue ?? 0), undefined, undefined, 1);
    case 'float':
      return new Blockly.FieldNumber(Number(param.defaultValue ?? 0));
    case 'bool':
      return new Blockly.FieldCheckbox(param.defaultValue === 'True');
    case 'str':
    default:
      return new Blockly.FieldTextInput(unquote(param.defaultValue ?? ''));
  }
}

function defaultShadowState(param: ParameterDefinition): Blockly.serialization.blocks.State | null {
  switch (param.type) {
    case 'int':
    case 'float': {
      const num = Number(param.defaultValue ?? 0);
      return {type: 'math_number', fields: {NUM: isNaN(num) ? 0 : num}};
    }
    case 'str':
      return {type: 'text', fields: {TEXT: unquote(param.defaultValue ?? '')}};
    case 'bool':
      return {type: 'logic_boolean', fields: {BOOL: param.defaultValue === 'True' ? 'TRUE' : 'FALSE'}};
  }
  return null;
}

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = MULTIPLE_METHODS;
};

export const pythonFromBlock = function(
    block: MultipleMethodsBlock,
    generator: ExtendedPythonGenerator,
) {
  const group = block.getGroup_();
  const method = block.getMethod_();
  if (!group || !method) {
    return block.outputConnection ? ['None', Order.ATOMIC] : '';
  }
  if (block.mrcImportModule) {
    generator.importModule(block.mrcImportModule);
  }

  const args: string[] = [];
  for (const param of method.parameters ?? []) {
    args.push(codeForParam(block, generator, param));
  }
  const code = block.mrcPythonObject + '.' + method.name + '(' + args.join(', ') + ')';

  const result: string | [string, number] = block.outputConnection
      ? [code, Order.FUNCTION_CALL]
      : code + '\n';
  const blockLabel = Blockly.Msg.CALL + ' ' + group.name + ' ' + (method.label ?? method.name);
  return generator.addErrorHandlingCode(block, blockLabel, result);
};

function codeForParam(
    block: MultipleMethodsBlock,
    generator: ExtendedPythonGenerator,
    param: ParameterDefinition
): string {
  const field = block.getField(FIELD_PARAM_PREFIX + param.name);
  if (!field) {
    return generator.valueToCode(block, INPUT_PARAM_PREFIX + param.name, Order.NONE) || 'None';
  }
  const value = field.getValue();
  if (field instanceof Blockly.FieldDropdown) {
    // Dropdown values are python expressions.
    return value;
  }
  if (field instanceof Blockly.FieldCheckbox) {
    return value === 'TRUE' ? 'True' : 'False';
  }
  if (field instanceof Blockly.FieldNumber) {
    return String(value);
  }
  return generator.quote_(String(value));
}

/**
 * Returns a toolbox block for the given object. If group and method are not
 * specified, the first method of the first group is selected.
 */
export function createMultipleMethodsBlock(
    objectDefinition: ObjectDefinition,
    groupName?: string,
    methodName?: string
): toolboxItems.Block {
  const groups = objectDefinition.groups;
  const group = groups.find(g => g.name === groupName) ?? groups[0];
  const method = group?.methods.find(m => m.name === methodName) ?? group?.methods[0];
  const extraState: MultipleMethodsExtraState = {
    ...objectDefinition,
    group: group?.name,
    method: method?.name,
  };
  return new toolboxItems.Block(BLOCK_NAME, extraState, null, null);
}
