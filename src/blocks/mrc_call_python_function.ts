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

import { getClassData, getAllowedTypesForSetCheck, getOutputCheck } from './utils/python';
import { ArgData, FunctionData } from './utils/python_json_types';
import * as value from './utils/value';
import * as variable from './utils/variable';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles'
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';


// A block to call a python function.

export const BLOCK_NAME = 'mrc_call_python_function';

enum FunctionKind {
  BUILT_IN = 'built-in',
  MODULE = 'module',
  STATIC = 'static',
  CONSTRUCTOR = 'constructor',
  INSTANCE = 'instance',
  INSTANCE_WITHIN = 'instance_within',
  INSTANCE_COMPONENT = 'instance_component',
  INSTANCE_ROBOT = 'instance_robot',
  INSTANCE_MECHANISM = 'instance_mechanism',
  EVENT = 'event', // For firing an event.
}

const RETURN_TYPE_NONE = 'None';

const INPUT_TITLE = 'TITLE';
const FIELD_MODULE_OR_CLASS_NAME = 'MODULE_OR_CLASS';
const FIELD_FUNCTION_NAME = 'FUNC';
const FIELD_EVENT_NAME = 'EVENT';
const FIELD_COMPONENT_NAME = 'COMPONENT_NAME';
const FIELD_MECHANISM_NAME = 'MECHANISM_NAME';

type FunctionArg = {
  name: string,
  type: string,
};

const WARNING_ID_FUNCTION_CHANGED = 'function changed';

export type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  mrcFunctionKind: FunctionKind,
  mrcReturnType: string,
  mrcArgs: FunctionArg[], // Include the self arg only if there is a socket for it.
  mrcTooltip: string,
  mrcImportModule: string,
  mrcActualFunctionName: string,
  mrcMethodId: string,
  mrcComponentId: string,
  mrcEventId: string,
  mrcMechanismId: string,
  mrcComponentClassName: string,
  mrcOriginalComponentName: string,
  mrcMechanismClassName: string,
  mrcMapComponentNameToId: {[componentName: string]: string},
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
   * The mrcMethodId of the mrc_class_method_def block that declares the method.
   * Specified only if the function kind is INSTANCE_WITHIN, INSTANCE_ROBOT, or INSTANCE_MECHANISM
   */
  methodId?: string,
  /**
   * The mrcComponentId of the mrc_component block that adds the component to the robot or a mechanism.
   * Specified only if the function kind is INSTANCE_COMPONENT.
   */
  componentId?: string,
  /**
   * The mrcEventId of the mrc_event block that defines the event.
   * Specified only if the function kind is EVENT.
   */
  eventId?: string,
  /**
   * The mrcMechanismId of the mrc_mechanism block that adds the mechanism to the robot.
   * Specified only if the function kind is INSTANCE_MECHANISM, or INSTANCE_COMPONENT if the
   * component belongs to a mechanism.
   */
  mechanismId?: string,
  /**
   * The component name. Specified only if the function kind is INSTANCE_COMPONENT.
   */
  componentName?: string,
  /**
   * The component class name. Specified only if the function kind is INSTANCE_COMPONENT.
   */
  componentClassName?: string,
  /**
   * The mechanism class name. Specified only if the function kind is INSTANCE_MECHANISM.
   */
  mechanismClassName?: string,
}

const CALL_PYTHON_FUNCTION = {
  /**
   * Block initialization.
   */
  init: function(this: CallPythonFunctionBlock): void {
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.setTooltip(() => {
      let tooltip: string;
      switch (this.mrcFunctionKind) {
        case FunctionKind.BUILT_IN: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_BUILTIN_FUNCTION_TOOLTIP;
          tooltip = tooltip.replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.MODULE: {
          const moduleName = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_MODULE_FUNCTION_TOOLTIP;
          tooltip = tooltip
              .replace('{{moduleName}}', moduleName)
              .replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.STATIC: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_STATIC_METHOD_TOOLTIP;
          tooltip = tooltip
              .replace('{{className}}', className)
              .replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.CONSTRUCTOR: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          tooltip = Blockly.Msg.CALL_CONSTRUCTOR_TOOLTIP;
          tooltip = tooltip.replace('{{className}}', className);
          break;
        }
        case FunctionKind.INSTANCE: {
          const className = this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_INSTANCE_METHOD_TOOLTIP;
          tooltip = tooltip
              .replace('{{className}}', className)
              .replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.INSTANCE_WITHIN: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_INSTANCE_METHOD_WITHIN_TOOLTIP;
          tooltip = tooltip.replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.EVENT: {
          const eventName = this.getFieldValue(FIELD_EVENT_NAME);
          tooltip = Blockly.Msg.FIRE_EVENT_TOOLTIP;
          tooltip = tooltip.replace('{{eventName}}', eventName);
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const className = this.mrcComponentClassName;
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          if (this.mrcMechanismId) {
            tooltip = Blockly.Msg.CALL_MECHANISM_COMPONENT_INSTANCE_METHOD_TOOLTIP;
            tooltip = tooltip
                .replace('{{className}}', className)
                .replace('{{functionName}}', functionName)
                .replace('{{componentName}}', this.getFieldValue(FIELD_COMPONENT_NAME))
                .replace('{{mechanismName}}', this.getFieldValue(FIELD_MECHANISM_NAME));
          } else {
            tooltip = Blockly.Msg.CALL_COMPONENT_INSTANCE_METHOD_TOOLTIP;
            tooltip = tooltip
                .replace('{{className}}', className)
                .replace('{{functionName}}', functionName)
                .replace('{{componentName}}', this.getFieldValue(FIELD_COMPONENT_NAME));
          }
          break;
        }
        case FunctionKind.INSTANCE_ROBOT: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_ROBOT_INSTANCE_METHOD_TOOLTIP;
          tooltip = tooltip.replace('{{functionName}}', functionName);
          break;
        }
        case FunctionKind.INSTANCE_MECHANISM: {
          const className = this.mrcMechanismClassName;
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = Blockly.Msg.CALL_MECHANISM_INSTANCE_METHOD_TOOLTIP;
          tooltip = tooltip
              .replace('{{className}}', className)
              .replace('{{functionName}}', functionName)
              .replace('{{mechanismName}}', this.getFieldValue(FIELD_MECHANISM_NAME));
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
    if (this.mrcArgs){
      this.mrcArgs.forEach((arg) => {
        extraState.args.push({
          name: arg.name,
          type: arg.type,
        });
      });
    }
    if (this.mrcTooltip) {
      extraState.tooltip = this.mrcTooltip;
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcActualFunctionName) {
      extraState.actualFunctionName = this.mrcActualFunctionName;
    }
    if (this.mrcMethodId) {
      extraState.methodId = this.mrcMethodId;
    }
    if (this.mrcComponentId) {
      extraState.componentId = this.mrcComponentId;
      if (this.getField(FIELD_COMPONENT_NAME)) {
        // Since the user may have chosen a different component name from the dropdown, we need to get
        // the componentId of the component that the user has chosen.
        const componentName = this.getFieldValue(FIELD_COMPONENT_NAME);
        if (componentName in this.mrcMapComponentNameToId) {
          extraState.componentId = this.mrcMapComponentNameToId[componentName];
        }
      }
    }
    if (this.mrcEventId) {
      extraState.eventId = this.mrcEventId;
    }
    if (this.mrcMechanismId) {
      extraState.mechanismId = this.mrcMechanismId;
    }
    if (this.mrcComponentClassName) {
      extraState.componentClassName = this.mrcComponentClassName;
    }
    if (this.mrcMechanismClassName) {
      extraState.mechanismClassName = this.mrcMechanismClassName;
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
        name: arg.name,
        type: arg.type,
      });
    });
    this.mrcTooltip = extraState.tooltip ? extraState.tooltip : '';
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcActualFunctionName = extraState.actualFunctionName ? extraState.actualFunctionName : '';
    this.mrcMethodId = extraState.methodId ? extraState.methodId : '';
    this.mrcComponentId = extraState.componentId ? extraState.componentId : '';
    this.mrcEventId = extraState.eventId ? extraState.eventId : '';
    this.mrcMechanismId = extraState.mechanismId ? extraState.mechanismId : '';
    this.mrcComponentClassName = extraState.componentClassName ? extraState.componentClassName : '';
    this.mrcMechanismClassName = extraState.mechanismClassName ? extraState.mechanismClassName : '';
    // Initialize mrcMapComponentNameToId here. It will be filled during checkFunction.
    this.mrcMapComponentNameToId = {};
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

    if (!this.getInput(INPUT_TITLE)) {
      // Add the dummy input.
      switch (this.mrcFunctionKind) {
        case FunctionKind.BUILT_IN:
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.MODULE:
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.STATIC:
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.CONSTRUCTOR:
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CREATE)
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME);
          break;
        case FunctionKind.INSTANCE:
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        case FunctionKind.INSTANCE_WITHIN: {
          const input = this.getInput(INPUT_TITLE);
          if (!input) {
            this.appendDummyInput(INPUT_TITLE)
                .appendField(Blockly.Msg.CALL)
                .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          }
          break;
        }
        case FunctionKind.EVENT: {
          const input = this.getInput(INPUT_TITLE);
          if (!input) {
            this.appendDummyInput(INPUT_TITLE)
                .appendField(Blockly.Msg.FIRE)
                .appendField(createFieldNonEditableText(''), FIELD_EVENT_NAME);
          }
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const titleInput = this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL);
          if (this.mrcMechanismId) {
            titleInput
                .appendField(createFieldNonEditableText(''), FIELD_MECHANISM_NAME)
                .appendField('.');
          }
          // Here we create a text field for the component name.
          // Later, in checkFunction, we will replace it with a dropdown.
          titleInput
              .appendField(createFieldNonEditableText(''), FIELD_COMPONENT_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        }
        case FunctionKind.INSTANCE_ROBOT: {
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(Blockly.Msg.ROBOT_LOWER_CASE))
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        }
        case FunctionKind.INSTANCE_MECHANISM: {
          this.appendDummyInput(INPUT_TITLE)
              .appendField(Blockly.Msg.CALL)
              .appendField(createFieldNonEditableText(''), FIELD_MECHANISM_NAME)
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
  renameMethodCaller: function(this: CallPythonFunctionBlock, id: string, newName: string): void {
    // renameMethodCaller is called when a component, mechanism, event, or
    // method block in the same module is modified.
    switch (this.mrcFunctionKind) {
      case FunctionKind.INSTANCE_WITHIN:
        if (id === this.mrcMethodId) {
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
          // mrcActualFunctionName does not need to be updated because it is not used for INSTANCE_WITHIN.
        }
        break;
      case FunctionKind.INSTANCE_COMPONENT:
        if (id === this.mrcComponentId) {
          this.setFieldValue(newName, FIELD_COMPONENT_NAME);
        }
        if (this.mrcMechanismId) {
          if (id === this.mrcMechanismId) {
            this.setFieldValue(newName, FIELD_MECHANISM_NAME);
          }
        }
        break;
      case FunctionKind.INSTANCE_ROBOT:
        if (id === this.mrcMethodId) {
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
        }
        break;
      case FunctionKind.INSTANCE_MECHANISM:
        if (id === this.mrcMethodId) {
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
        } else if (id === this.mrcMechanismId) {
          this.setFieldValue(newName, FIELD_MECHANISM_NAME);
        }
        break;
      case FunctionKind.EVENT:
        if (id === this.mrcEventId) {
          this.setFieldValue(newName, FIELD_EVENT_NAME);
        }
        break;
    }
  },
  mutateMethodCaller: function(
      this: CallPythonFunctionBlock,
      methodOrEvent: storageModuleContent.Method | storageModuleContent.Event
  ): void {
    // mutateMethodCaller is called when the method or event definition block in the same module is modified.
    if (this.mrcFunctionKind === FunctionKind.EVENT) {
      const event = methodOrEvent as storageModuleContent.Event;
      this.mrcArgs = [];
      event.args.forEach((arg) => {
        this.mrcArgs.push({
          name: arg.name,
          type: arg.type,
        });
      });
    } else if (this.mrcFunctionKind === FunctionKind.INSTANCE_WITHIN) {
      const method = methodOrEvent as storageModuleContent.Method;
      this.mrcReturnType = method.returnType;
      this.mrcArgs = [];
      // We don't include the arg for the self argument because we don't need a socket for it.
      for (let i = 1; i < method.args.length; i++) {
        this.mrcArgs.push({
          name: method.args[i].name,
          type: method.args[i].type,
        });
      }
    }
    this.updateBlock_();
  },
  getComponents: function(this: CallPythonFunctionBlock, editor: Editor): storageModuleContent.Component[] {
    // Get the list of components whose type matches this.mrcComponentClassName.
    const components: storageModuleContent.Component[] = [];
    let componentsToConsider: storageModuleContent.Component[] = [];
    if (this.mrcMechanismId) {
      // Only consider components that belong to the mechanism.
      // this.mrcMechanismId is the mechanismId from the MechanismInRobot.
      // We need to get the MechanismInRobot with that id, then get the mechanism, and then get
      // the public components defined in that mechanism.
      for (const mechanismInRobot of editor.getMechanismsFromRobot()) {
        if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
          for (const mechanism of editor.getMechanisms()) {
            if (mechanism.moduleId === mechanismInRobot.moduleId) {
              componentsToConsider = editor.getComponentsFromMechanism(mechanism);
              break;
            }
          }
          break;
        }
      }
    } else if (editor.getModuleType() === storageModule.ModuleType.MECHANISM) {
      // Only consider components (regular and private) in the current workspace.
      componentsToConsider = editor.getAllComponentsFromWorkspace();
    } else {
      // Only consider components in the robot.
      componentsToConsider = editor.getComponentsFromRobot();
    }
    componentsToConsider.forEach(component => {
      if (component.className === this.mrcComponentClassName) {
        components.push(component);
      }
    });
    return components;
  },

  /**
   * mrcOnModuleCurrent is called for each CallPythonFunctionBlock when the module becomes the current module.
   */
  mrcOnModuleCurrent: function(this: CallPythonFunctionBlock, editor: Editor): void {
    this.checkFunction(editor);
  },
  /**
   * mrcOnLoad is called for each CallPythonFunctionBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: CallPythonFunctionBlock, editor: Editor): void {
    this.checkFunction(editor);
  },
  /**
   * mrcOnCreate is called for each CallPythonFunctionBlock when it is created.
   */
  mrcOnCreate: function(this: CallPythonFunctionBlock, editor: Editor): void {
    this.checkFunction(editor);
  },
  /**
   * checkFunction checks the block, updates it, and/or adds a warning balloon if necessary.
   * It is called from mrcOnModuleCurrent, mrcOnLoad, and mrcOnCreate above.
   */
  checkFunction: function(this: CallPythonFunctionBlock, editor: Editor): void {
    const warnings: string[] = [];

    // If this block is calling a method defined in this module, check whether the method still
    // exists and whether it has been changed.
    // If the method doesn't exist, put a visible warning on this block.
    // If the robot method has changed, update the block if possible or put a
    // visible warning on it.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_WITHIN) {
      let foundMethod = false;
      const methodsFromWorkspace = editor.getMethodsForWithinFromWorkspace();
      for (const method of methodsFromWorkspace) {
        if (method.methodId === this.mrcMethodId) {
          foundMethod = true;
          if (this.mrcActualFunctionName !== method.pythonName) {
            this.mrcActualFunctionName = method.pythonName;
          }
          if (this.getFieldValue(FIELD_FUNCTION_NAME) !== method.visibleName) {
            this.setFieldValue(method.visibleName, FIELD_FUNCTION_NAME);
          }

          this.mrcReturnType = method.returnType;
          this.mrcArgs = [];
          // We don't include the arg for the self argument because we don't need a socket for it.
          for (let i = 1; i < method.args.length; i++) {
            this.mrcArgs.push({
              name: method.args[i].name,
              type: method.args[i].type,
            });
          }
          this.updateBlock_();

          // Since we found the method, we can break out of the loop.
          break;
        }
      }
      if (!foundMethod) {
        warnings.push(Blockly.Msg.WARNING_CALL_INSTANCE_WITHIN_METHOD_MISSING_METHOD);
      }
    }

    // If this block is calling a component method, check whether the component
    // still exists and whether it has been changed.
    // If the component doesn't exist, put a visible warning on this block.
    // If the component has changed, update the block if possible or put a
    // visible warning on it.
    // If the component belongs to a mechanism, also check whether the mechanism
    // still exists and whether it has been changed.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_COMPONENT) {
      const componentNames: string[] = [];
      this.mrcMapComponentNameToId = {}
      this.getComponents(editor).forEach(component => {
        componentNames.push(component.name);
        this.mrcMapComponentNameToId[component.name] = component.componentId;
      });
      let foundComponent = false;
      for (const componentName of componentNames) {
        const componentId = this.mrcMapComponentNameToId[componentName];
        if (componentId === this.mrcComponentId) {
          foundComponent = true;

          // Replace the text field for the component name with a dropdown where the user can choose
          // between different components of the same type. For example, they can easily switch from
          // a motor component name "left_motor" to a motor component named "right_motor".
          const titleInput = this.getInput(INPUT_TITLE)
          if (!titleInput) {
            throw new Error('Could not find the title input');
          }
          let indexOfComponentNameField = -1;
          for (let i = 0, field; (field = titleInput.fieldRow[i]); i++) {
            if (field.name === FIELD_COMPONENT_NAME) {
              indexOfComponentNameField = i;
              break;
            }
          }
          if (indexOfComponentNameField === -1) {
            throw new Error('Could not find the component name field');
          }
          titleInput.removeField(FIELD_COMPONENT_NAME);
          titleInput.insertFieldAt(indexOfComponentNameField,
              createFieldDropdown(componentNames), FIELD_COMPONENT_NAME);
          // TODO(lizlooney): If the current module is the robot or a mechanism, we need to update the
          // items in the dropdown if the user adds or removes a component.

          this.setFieldValue(componentName, FIELD_COMPONENT_NAME);

          // Since we found the component, we can break out of the loop.
          break;
        }
      }
      if (!foundComponent) {
        if (this.mrcMechanismId) {
          // Check whether the the component still exists, but is a private component in the mechanism.
          for (const mechanismInRobot of editor.getMechanismsFromRobot()) {
            if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
              for (const mechanism of editor.getMechanisms()) {
                if (mechanism.moduleId === mechanismInRobot.moduleId) {
                  for (const privateComponent of editor.getPrivateComponentsFromMechanism(mechanism)) {
                    if (privateComponent.className === this.mrcComponentClassName &&
                        privateComponent.componentId === this.mrcComponentId) {
                      foundComponent = true;
                      let warning = Blockly.Msg.WARNING_CALL_COMPONENT_INSTANCE_METHOD_PRIVATE_COMPONENT;
                      warning = warning.replace('{{mechanismClassName}}', mechanism.className);
                      warnings.push(warning);
                      break
                    }
                  }
                  break;
                }
                if (foundComponent) {
                  break;
                }
              }
              break;
            }
            if (foundComponent) {
              break;
            }
          }
        }
      }

      if (!foundComponent) {
        warnings.push(Blockly.Msg.WARNING_CALL_COMPONENT_INSTANCE_METHOD_MISSING_COMPONENT);
      }

      if (this.mrcMechanismId) {
        let foundMechanism = false;
        const mechanismsInRobot = editor.getMechanismsFromRobot();
        for (const mechanismInRobot of mechanismsInRobot) {
          if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
            foundMechanism = true;

            // If the mechanism name has changed, we can handle that.
            if (this.getFieldValue(FIELD_MECHANISM_NAME) !== mechanismInRobot.name) {
              this.setFieldValue(mechanismInRobot.name, FIELD_MECHANISM_NAME);
            }
            break;
          }
        }
        if (!foundMechanism) {
          warnings.push(Blockly.Msg.WARNING_CALL_MECHANISM_COMPONENT_INSTANCE_METHOD_MISSING_MECHANISM);
        }
      }

      const classData = getClassData(this.mrcComponentClassName);
      if (classData) {
        let foundComponentMethod = false;
        for (const functionData of classData.instanceMethods) {
          if (this.getFieldValue(FIELD_FUNCTION_NAME) === functionData.functionName) {
            foundComponentMethod = true;
            this.mrcReturnType = functionData.returnType;
            this.mrcTooltip = functionData.tooltip;
            this.mrcArgs = [];
            // We don't include the arg for the self argument because we don't need a socket for it.
            for (let i = 1; i < functionData.args.length; i++) {
              this.mrcArgs.push({
                name: functionData.args[i].name,
                type: functionData.args[i].type,
              });
            }
            this.updateBlock_();

            // Since we found the method, we can break out of the loop.
            break;
          }
        }
        if (!foundComponentMethod) {
          warnings.push(Blockly.Msg.WARNING_CALL_COMPONENT_INSTANCE_METHOD_MISSING_METHOD);
        }
      } else {
        warnings.push(Blockly.Msg.WARNING_CALL_COMPONENT_INSTANCE_METHOD_MISSING_COMPONENT_CLASS);
      }
    }

    // If this block is calling a robot method, check whether the robot method
    // still exists and whether it has been changed.
    // If the robot method doesn't exist, put a visible warning on this block.
    // If the robot method has changed, update the block if possible or put a
    // visible warning on it.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_ROBOT) {
      if (editor.getModuleType() === storageModule.ModuleType.MECHANISM) {
        warnings.push(Blockly.Msg.WARNING_CALL_ROBOT_INSTANCE_METHOD_INSIDE_MECHANISM);
      } else {
        let foundRobotMethod = false;
        const robotMethods = editor.getMethodsFromRobot();
        for (const robotMethod of robotMethods) {
          if (robotMethod.methodId === this.mrcMethodId) {
            foundRobotMethod = true;
            if (this.mrcActualFunctionName !== robotMethod.pythonName) {
              this.mrcActualFunctionName = robotMethod.pythonName;
            }
            if (this.getFieldValue(FIELD_FUNCTION_NAME) !== robotMethod.visibleName) {
              this.setFieldValue(robotMethod.visibleName, FIELD_FUNCTION_NAME);
            }

            this.mrcReturnType = robotMethod.returnType;
            this.mrcArgs = [];
            // We don't include the arg for the self argument because we don't need a socket for it.
            for (let i = 1; i < robotMethod.args.length; i++) {
              this.mrcArgs.push({
                name: robotMethod.args[i].name,
                type: robotMethod.args[i].type,
              });
            }
            this.updateBlock_();

            // Since we found the robot method, we can break out of the loop.
            break;
          }
        }
        if (!foundRobotMethod) {
          warnings.push(Blockly.Msg.WARNING_CALL_ROBOT_INSTANCE_METHOD_MISSING_METHOD);
        }
      }
    }

    // If this block is calling a mechanism method, check whether the mechanism
    // still exists, whether it has been changed, whether the method still
    // exists, and whether the method has been changed.
    // If the mechanism doesn't exist, put a visible warning on this block.
    // If the mechanism has changed, update the block if possible or put a
    // visible warning on it.
    // If the method doesn't exist, put a visible warning on this block.
    // If the method has changed, update the block if possible or put a
    // visible warning on it.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_MECHANISM) {
      if (editor.getModuleType() === storageModule.ModuleType.MECHANISM) {
        warnings.push(Blockly.Msg.WARNING_CALL_MECHANISM_INSTANCE_METHOD_INSIDE_MECHANISM);
      } else {
        let foundMechanism = false;
        const mechanismsInRobot = editor.getMechanismsFromRobot();
        for (const mechanismInRobot of mechanismsInRobot) {
          if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
            foundMechanism = true;

            // If the mechanism name has changed, we can handle that.
            if (this.getFieldValue(FIELD_MECHANISM_NAME) !== mechanismInRobot.name) {
              this.setFieldValue(mechanismInRobot.name, FIELD_MECHANISM_NAME);
            }

            let foundMechanismMethod = false;
            const mechanism = editor.getMechanism(mechanismInRobot);
            const mechanismMethods: storageModuleContent.Method[] = mechanism
                ? editor.getMethodsFromMechanism(mechanism) : [];
            for (const mechanismMethod of mechanismMethods) {
              if (mechanismMethod.methodId === this.mrcMethodId) {
                foundMechanismMethod = true;
                if (this.mrcActualFunctionName !== mechanismMethod.pythonName) {
                  this.mrcActualFunctionName = mechanismMethod.pythonName;
                }
                if (this.getFieldValue(FIELD_FUNCTION_NAME) !== mechanismMethod.visibleName) {
                  this.setFieldValue(mechanismMethod.visibleName, FIELD_FUNCTION_NAME);
                }
                this.mrcReturnType = mechanismMethod.returnType;
                this.mrcArgs = [];
                // We don't include the arg for the self argument because we don't need a socket for it.
                for (let i = 1; i < mechanismMethod.args.length; i++) {
                  this.mrcArgs.push({
                    name: mechanismMethod.args[i].name,
                    type: mechanismMethod.args[i].type,
                  });
                }
                this.updateBlock_();

                // Since we found the mechanism method, we can break out of the loop.
                break;
              }
            }
            if (!foundMechanismMethod) {
              warnings.push(Blockly.Msg.WARNING_CALL_MECHANISM_INSTANCE_METHOD_MISSING_METHOD);
            }

            // Since we found the mechanism, we can break out of the loop.
            break;
          }
        }
        if (!foundMechanism) {
          warnings.push(Blockly.Msg.WARNING_CALL_MECHANISM_INSTANCE_METHOD_MISSING_MECHANISM);
        }
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_FUNCTION_CHANGED);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_FUNCTION_CHANGED);
    }
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: CallPythonFunctionBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcMethodId && this.mrcMethodId in oldIdToNewId) {
      this.mrcMethodId = oldIdToNewId[this.mrcMethodId];
    }
    if (this.mrcComponentId && this.mrcComponentId in oldIdToNewId) {
      this.mrcComponentId = oldIdToNewId[this.mrcComponentId];
    }
    if (this.mrcEventId && this.mrcEventId in oldIdToNewId) {
      this.mrcEventId = oldIdToNewId[this.mrcEventId];
    }
    if (this.mrcMechanismId && this.mrcMechanismId in oldIdToNewId) {
      this.mrcMechanismId = oldIdToNewId[this.mrcMechanismId];
    }
  },
  mrcGetFullLabel: function(this: CallPythonFunctionBlock): string {
    switch (this.mrcFunctionKind) {
      case FunctionKind.BUILT_IN:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.MODULE:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME) + '.' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.STATIC:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME) + '.' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.CONSTRUCTOR:
        return Blockly.Msg.CREATE + ' ' +
            this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      case FunctionKind.INSTANCE:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_MODULE_OR_CLASS_NAME) + '.' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.INSTANCE_WITHIN:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.EVENT:
        return Blockly.Msg.FIRE + ' ' +
            this.getFieldValue(FIELD_EVENT_NAME);
      case FunctionKind.INSTANCE_COMPONENT:
        if (this.mrcMechanismId) {
          return Blockly.Msg.CALL + ' ' +
              this.getFieldValue(FIELD_MECHANISM_NAME) + '.' +
              this.getFieldValue(FIELD_COMPONENT_NAME) + '.' +
              this.getFieldValue(FIELD_FUNCTION_NAME);
        } else {
          return Blockly.Msg.CALL + ' ' +
              this.getFieldValue(FIELD_COMPONENT_NAME) + '.' +
              this.getFieldValue(FIELD_FUNCTION_NAME);
        }
      case FunctionKind.INSTANCE_ROBOT:
        return Blockly.Msg.CALL + ' ' +
            Blockly.Msg.ROBOT_LOWER_CASE + '.' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
      case FunctionKind.INSTANCE_MECHANISM:
        return Blockly.Msg.CALL + ' ' +
            this.getFieldValue(FIELD_MECHANISM_NAME) + '.' +
            this.getFieldValue(FIELD_FUNCTION_NAME);
    }
    return '';
  },
  upgrade_008_to_009: function(this: CallPythonFunctionBlock) {
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_COMPONENT) {
      if (this.mrcComponentClassName === 'expansion_hub_motor.ExpansionHubMotor') {
        this.mrcComponentClassName = 'wpilib_placeholders.ExpansionHubMotor';
      } else if (this.mrcComponentClassName === 'expansion_hub_servo.ExpansionHubServo') {
        this.mrcComponentClassName = 'wpilib_placeholders.ExpansionHubServo';
      }
    }
  },
};

export function setup(): void {
  Blockly.Blocks[BLOCK_NAME] = CALL_PYTHON_FUNCTION;
}

export function pythonFromBlock(
    block: CallPythonFunctionBlock,
    generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.importModule(block.mrcImportModule);
  }
  let code = '';
  let needOpenParen = true;
  let delimiterBeforeArgs = '';
  let argStartIndex = 0;
  switch (block.mrcFunctionKind) {
    case FunctionKind.BUILT_IN: {
      const functionName = (block.mrcActualFunctionName)
          ? block.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = functionName;
      break;
    }
    case FunctionKind.MODULE: {
      const moduleName = block.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (block.mrcActualFunctionName)
          ? block.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = moduleName + '.' + functionName;
      break;
    }
    case FunctionKind.STATIC: {
      const className = block.getFieldValue(FIELD_MODULE_OR_CLASS_NAME);
      const functionName = (block.mrcActualFunctionName)
          ? block.mrcActualFunctionName
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
      const selfValue = generator.valueToCode(block, 'ARG0', Order.MEMBER);
      const functionName = (block.mrcActualFunctionName)
          ? block.mrcActualFunctionName
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
      const eventName = block.getFieldValue(FIELD_EVENT_NAME);
      code = 'self.fire_event(\'' + eventName + '\'';
      needOpenParen = false;
      delimiterBeforeArgs = ', ';
      break;
    }
    case FunctionKind.INSTANCE_COMPONENT: {
      // Generate the correct code depending on the module type.
      switch (generator.getModuleType()) {
        case storageModule.ModuleType.ROBOT:
        case storageModule.ModuleType.MECHANISM:
          code = 'self.';
          break;
        case storageModule.ModuleType.OPMODE:
          code = 'self.robot.';
          break;
      }
      if (block.mrcMechanismId) {
        const mechanismName = block.getFieldValue(FIELD_MECHANISM_NAME);
        code += mechanismName + '.';
      }
      const componentName = block.getFieldValue(FIELD_COMPONENT_NAME);
      const functionName = block.mrcActualFunctionName
          ? block.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code += componentName + '.' + functionName;
      break;
    }
    case FunctionKind.INSTANCE_ROBOT: {
      const functionName = block.mrcActualFunctionName
          ? block.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = 'self.robot.' + functionName;
      break;
    }
    case FunctionKind.INSTANCE_MECHANISM: {
      const mechanismName = block.getFieldValue(FIELD_MECHANISM_NAME);
      const functionName = block.mrcActualFunctionName
          ? block.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      // Generate the correct code depending on the module type.
      switch (generator.getModuleType()) {
        case storageModule.ModuleType.ROBOT:
          code = 'self.' + mechanismName;
          break;
        case storageModule.ModuleType.OPMODE:
          code = 'self.robot.' + mechanismName;
          break;
        case storageModule.ModuleType.MECHANISM:
          // The INSTANCE_MECHANISM version should not be used in a mechanism.
          // TODO(lizlooney): What if the user copies a block from an robot or opmode and pastes
          // it into a mechanism?
          break;
      }
      code += '.' + functionName;
      break;
    }
    default:
      throw new Error('mrcFunctionKind has unexpected value: ' + block.mrcFunctionKind)
  }
  if (needOpenParen) {
    code += '(';
  }
  const codeForArgs = generateCodeForArguments(block, generator, argStartIndex);
  if (codeForArgs) {
    code += delimiterBeforeArgs + codeForArgs;
  }
  code += ')';
  let result: string | [string, number];
  if (block.outputConnection) {
    result = [code, Order.FUNCTION_CALL];
  } else {
    result = code + '\n';
  }
  return generator.addErrorHandlingCode(block, block.mrcGetFullLabel(), result);
};

function generateCodeForArguments(
    block: CallPythonFunctionBlock,
    generator: ExtendedPythonGenerator,
    startIndex: number) {
  let code = '';
  if (block.mrcArgs.length - startIndex === 1) {
    // If there is only one input, put it on the same line as the function name.
    code += generator.valueToCode(block, 'ARG' + startIndex, Order.NONE) || 'None';
  } else {
    let delimiter = '';
    for (let i = startIndex; i < block.mrcArgs.length; i++) {
      code += delimiter + '\n' + generator.INDENT + generator.INDENT;
      code += generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'None';
      delimiter = ',';
    }
  }
  return code;
}

function getMethodCallers(workspace: Blockly.Workspace, id: string): Blockly.Block[] {
  return workspace.getBlocksByType(BLOCK_NAME).filter((block) => {
    const callPythonFunctionBlock = block as CallPythonFunctionBlock;
    return (
        callPythonFunctionBlock.mrcMethodId === id ||
        callPythonFunctionBlock.mrcComponentId === id ||
        callPythonFunctionBlock.mrcEventId === id ||
        callPythonFunctionBlock.mrcMechanismId === id);
  });
}

export function renameMethodCallers(workspace: Blockly.Workspace, id: string, newName: string): void {
  getMethodCallers(workspace, id).forEach(block => {
    (block as CallPythonFunctionBlock).renameMethodCaller(id, newName);
  });
}

export function mutateMethodCallers(
    workspace: Blockly.Workspace, id: string, methodOrEvent: storageModuleContent.Method | storageModuleContent.Event) {
  const oldRecordUndo = Blockly.Events.getRecordUndo();

  getMethodCallers(workspace, id).forEach(block => {
    const callBlock = block as CallPythonFunctionBlock;
    // Get the extra state before changing the call block.
    const oldExtraState = callBlock.saveExtraState();

    // Apply the changes.
    callBlock.mutateMethodCaller(methodOrEvent);

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
  });
}

// Functions used for creating blocks for the toolbox.

export function addBuiltInFunctionBlocks(
    functions: FunctionData[],
    contents: toolboxItems.ContentsType[]) {
  functions.forEach(functionData => {
    contents.push(createBuiltInMethodBlock(functionData));
  });
}

function createBuiltInMethodBlock(
    functionData: FunctionData): toolboxItems.Block  {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.BUILT_IN,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  processArgs(functionData.args, extraState, inputs, functionData.declaringClassName);
  return createBlock(extraState, fields, inputs);
}

function processArgs(
    args: ArgData[],
    extraState: CallPythonFunctionExtraState,
    inputs: {[key: string]: any},
    declaringClassName?: string) {
  for (let i = 0; i < args.length; i++) {
    let argName = args[i].name;
    if (i === 0 && argName === 'self' && declaringClassName) {
      argName = variable.getSelfArgName(declaringClassName);
    }
    extraState.args.push({
      name: argName,
      type: args[i].type,
    });
    // Check if we should plug a variable getter block into the argument input socket.
    const input = value.valueForFunctionArgInput(args[i].type, args[i].defaultValue);
    if (input) {
      inputs['ARG' + i] = input;
    }
  }
}

function createBlock(
    extraState: CallPythonFunctionExtraState,
    fields: {[key: string]: any},
    inputs: {[key: string]: any}): toolboxItems.Block  {
  let block = new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
  if (extraState.returnType && extraState.returnType != RETURN_TYPE_NONE) {
    const varName = variable.varNameForType(extraState.returnType);
    if (varName) {
      block = variable.createVariableSetterBlock(varName, block);
    }
  }
  return block;
}

export function addModuleFunctionBlocks(
    moduleName: string,
    functions: FunctionData[],
    contents: toolboxItems.ContentsType[]) {
  functions.forEach(functionData => {
    const block = createModuleFunctionOrStaticMethodBlock(
        FunctionKind.MODULE, moduleName, moduleName, functionData);
    contents.push(block);
  });
}

export function addStaticMethodBlocks(
    importModule: string,
    functions: FunctionData[],
    contents: toolboxItems.ContentsType[]) {
  functions.forEach(functionData => {
    if (functionData.declaringClassName) {
      const block = createModuleFunctionOrStaticMethodBlock(
          FunctionKind.STATIC, importModule, functionData.declaringClassName, functionData);
      contents.push(block);
    }
  });
}

function createModuleFunctionOrStaticMethodBlock(
    functionKind: FunctionKind,
    importModule: string,
    moduleOrClassName: string,
    functionData: FunctionData): toolboxItems.Block {
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
  processArgs(functionData.args, extraState, inputs, functionData.declaringClassName);
  return createBlock(extraState, fields, inputs);
}

export function addConstructorBlocks(
    importModule: string,
    functions: FunctionData[],
    contents: toolboxItems.ContentsType[]) {
  functions.forEach(functionData => {
    contents.push(createConstructorBlock(importModule, functionData));
  });
}

function createConstructorBlock(
    importModule: string,
    functionData: FunctionData): toolboxItems.Block {
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
  processArgs(functionData.args, extraState, inputs, functionData.declaringClassName);
  return createBlock(extraState, fields, inputs);
}

export function addInstanceMethodBlocks(
    functions: FunctionData[],
    contents: toolboxItems.ContentsType[]) {
  functions.forEach(functionData => {
    contents.push(createInstanceMethodBlock(functionData));
  });
}

function createInstanceMethodBlock(
    functionData: FunctionData): toolboxItems.Block {
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
  // We include the arg for the self argument for INSTANCE methods because we want a socket that
  // the user can plug the object into.
  processArgs(functionData.args, extraState, inputs, functionData.declaringClassName);
  return createBlock(extraState, fields, inputs);
}

export function addInstanceWithinBlocks(
    methods: storageModuleContent.Method[],
    contents: toolboxItems.ContentsType[]) {
  methods.forEach(method => {
    contents.push(createInstanceWithinBlock(method));
  });
}

function createInstanceWithinBlock(method: storageModuleContent.Method): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_WITHIN,
    returnType: method.returnType,
    actualFunctionName: method.pythonName,
    args: [],
    methodId: method.methodId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_FUNCTION_NAME] = method.visibleName;
  const inputs: {[key: string]: any} = {};
  // Convert method.args from storageModuleContent.MethodArg[] to ArgData[].
  const args: ArgData[] = [];
  // We don't include the arg for the self argument because we don't need a socket for it.
  for (let i = 1; i < method.args.length; i++) {
    args.push({
      name: method.args[i].name,
      type: method.args[i].type,
      defaultValue: '',
    });
  }
  processArgs(args, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

export function getInstanceComponentBlocks(
    component: storageModuleContent.Component): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];

  const classData = getClassData(component.className);
  if (classData) {
    const functions = classData.instanceMethods;
    for (const functionData of functions) {
      const block = createInstanceComponentBlock(component, functionData);
      contents.push(block);
    }
  }

  return contents;
}

export function getInstanceMechanismComponentBlocks(
    component: storageModuleContent.Component, mechanismInRobot: storageModuleContent.MechanismInRobot): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];

  const classData = getClassData(component.className);
  if (classData) {
    const functions = classData.instanceMethods;
    for (const functionData of functions) {
      const block = createInstanceMechanismComponentBlock(component, functionData, mechanismInRobot);
      contents.push(block);
    }
  }

  return contents;
}

function createInstanceComponentBlock(
    component: storageModuleContent.Component, functionData: FunctionData): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_COMPONENT,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
    importModule: '',
    componentClassName: component.className,
    componentName: component.name,
    componentId: component.componentId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_COMPONENT_NAME] = component.name;
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  // For INSTANCE_COMPONENT functions, the 0 argument is 'self', but
  // self is represented by the FIELD_COMPONENT_NAME field.
  // We don't include the arg for the self argument because we don't need a socket for it.
  const argsWithoutSelf = functionData.args.slice(1);
  processArgs(argsWithoutSelf, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

function createInstanceMechanismComponentBlock(
    component: storageModuleContent.Component,
    functionData: FunctionData, 
    mechanismInRobot: storageModuleContent.MechanismInRobot): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_COMPONENT,
    returnType: functionData.returnType,
    args: [],
    tooltip: functionData.tooltip,
    importModule: '',
    componentClassName: component.className,
    componentName: component.name,
    componentId: component.componentId,
    mechanismId: mechanismInRobot.mechanismId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MECHANISM_NAME] = mechanismInRobot.name;
  fields[FIELD_COMPONENT_NAME] = component.name;
  fields[FIELD_FUNCTION_NAME] = functionData.functionName;
  const inputs: {[key: string]: any} = {};
  // For INSTANCE_COMPONENT functions, the 0 argument is 'self', but
  // self is represented by the FIELD_COMPONENT_NAME field.
  // We don't include the arg for the self argument because we don't need a socket for it.
  const argsWithoutSelf = functionData.args.slice(1);
  processArgs(argsWithoutSelf, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

export function addInstanceRobotBlocks(
    methods: storageModuleContent.Method[],
    contents: toolboxItems.ContentsType[]) {
  methods.forEach(method => {
    contents.push(createInstanceRobotBlock(method));
  });
}

function createInstanceRobotBlock(method: storageModuleContent.Method): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_ROBOT,
    returnType: method.returnType,
    actualFunctionName: method.pythonName,
    args: [],
    methodId: method.methodId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_FUNCTION_NAME] = method.visibleName;
  const inputs: {[key: string]: any} = {};
  // Convert method.args from storageModuleContent.MethodArg[] to ArgData[].
  const args: ArgData[] = [];
  // We don't include the arg for the self argument because we don't need a socket for it.
  for (let i = 1; i < method.args.length; i++) {
    args.push({
      name: method.args[i].name,
      type: method.args[i].type,
      defaultValue: '',
    });
  }
  processArgs(args, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

export function addInstanceMechanismBlocks(
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    methods: storageModuleContent.Method[],
    contents: toolboxItems.ContentsType[]) {
  methods.forEach(method => {
    contents.push(createInstanceMechanismBlock(mechanismInRobot, method));
  });
}

function createInstanceMechanismBlock(
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    method: storageModuleContent.Method): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.INSTANCE_MECHANISM,
    returnType: method.returnType,
    actualFunctionName: method.pythonName,
    args: [],
    methodId: method.methodId,
    mechanismClassName: mechanismInRobot.className,
    mechanismId: mechanismInRobot.mechanismId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MECHANISM_NAME] = mechanismInRobot.name;
  fields[FIELD_FUNCTION_NAME] = method.visibleName;
  const inputs: {[key: string]: any} = {};
  // Convert method.args from storageModuleContent.MethodArg[] to ArgData[].
  const args: ArgData[] = [];
  // For INSTANCE_MECHANISM functions, the 0 argument is 'self', but
  // self is represented by the FIELD_MECHANISM_NAME field.
  // We don't include the arg for the self argument because we don't need a socket for it.
  for (let i = 1; i < method.args.length; i++) {
    args.push({
      name: method.args[i].name,
      type: method.args[i].type,
      defaultValue: '',
    });
  }
  processArgs(args, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

export function addFireEventBlocks(
    events: storageModuleContent.Event[],
    contents: toolboxItems.ContentsType[]) {
  events.forEach(event => {
    contents.push(createFireEventBlock(event));
  });
}

function createFireEventBlock(event: storageModuleContent.Event): toolboxItems.Block {
  const extraState: CallPythonFunctionExtraState = {
    functionKind: FunctionKind.EVENT,
    returnType: RETURN_TYPE_NONE,
    args: [],
    eventId: event.eventId,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_EVENT_NAME] = event.name;
  const inputs: {[key: string]: any} = {};
  // Convert event.args from storageModuleContent.MethodArg[] to ArgData[].
  const args: ArgData[] = [];
  event.args.forEach(methodArg => {
    args.push({
      name: methodArg.name,
      type: methodArg.type,
      defaultValue: '',
    });
  });
  processArgs(args, extraState, inputs);
  return createBlock(extraState, fields, inputs);
}

/**
 * Upgrades the CallPythonFunctionBlocks in the given workspace from version 008 to 009.
 * This function should only be called when upgrading old projects.
 */
export function upgrade_008_to_009(workspace: Blockly.Workspace): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as CallPythonFunctionBlock).upgrade_008_to_009();
  });
}
