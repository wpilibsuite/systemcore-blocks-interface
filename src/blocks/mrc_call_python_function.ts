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
import { ArgData, FunctionData, findSuperFunctionData } from './utils/python_json_types';
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
  EVENT = 'event',
}

const RETURN_TYPE_NONE = 'None';

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

export type CallPythonFunctionBlock = Blockly.Block & CallPythonFunctionMixin & Blockly.BlockSvg;
interface CallPythonFunctionMixin extends CallPythonFunctionMixinType {
  mrcFunctionKind: FunctionKind,
  mrcReturnType: string,
  mrcArgs: FunctionArg[], // Include the self arg only if there is a socket for it.
  mrcTooltip: string,
  mrcImportModule: string,
  mrcActualFunctionName: string,
  mrcOtherBlockId: string,
  mrcComponentClassName: string,
  mrcOriginalComponentName: string,
  mrcMechanismClassName: string,
  mrcMechanismBlockId: string,
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
   * The id of the block that defines the method, component, or event.
   * For INSTANCE_WITHIN, INSTANCE_ROBOT, or INSTANCE_MECHANISM, this is the id of an
   * mrc_class_method_def block.
   * For INSTANCE_COMPONENT, this is the id of an mrc_component block.
   * For EVENT, this is the id of an mrc_event block.
   */
  otherBlockId?: string,
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
  /**
   * The id of the mrc_mechanism block that adds the mechanism to the robot.
   * Specified only if the function kind is INSTANCE_MECHANISM.
   */
  mechanismBlockId?: string,
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
        case FunctionKind.BUILT_IN: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the builtin function ' + functionName + '.';
          break;
        }
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
          const eventName = this.getFieldValue(FIELD_EVENT_NAME);
          tooltip = 'Fires the event ' + eventName + '.';
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const className = this.mrcComponentClassName;
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the instance method ' + className + '.' + functionName +
              ' on the component named ' + this.getFieldValue(FIELD_COMPONENT_NAME) + '.';
          break;
        }
        case FunctionKind.INSTANCE_ROBOT: {
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the robot method ' + functionName + '.';
          break;
        }
        case FunctionKind.INSTANCE_MECHANISM: {
          const className = this.mrcMechanismClassName;
          const functionName = this.getFieldValue(FIELD_FUNCTION_NAME);
          tooltip = 'Calls the instance method ' + className + '.' + functionName +
              ' on the mechanism named ' + this.getFieldValue(FIELD_MECHANISM_NAME) + '.';
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
    if (this.mrcOtherBlockId) {
      extraState.otherBlockId = this.mrcOtherBlockId;
    }
    if (this.mrcComponentClassName) {
      extraState.componentClassName = this.mrcComponentClassName;
    }
    if (this.getField(FIELD_COMPONENT_NAME)) {
      extraState.componentName = this.getFieldValue(FIELD_COMPONENT_NAME);
      // The component name field is a drop down where the user can choose between different
      // components of the same type. For example, they can easily switch from a motor component
      // name "left_motor" to a motor component named "right_motor".
      if (extraState.componentName !== this.mrcOriginalComponentName) {
        // The user has chosen a different component name. We need to get the block id of the
        // mrc_component block that defines the component that the user has chosen.
        for (const component of this.getComponentsFromRobot()) {
          if (component.name == extraState.componentName) {
            extraState.otherBlockId = component.blockId;
            break;
          }
        }
      }
    }
    if (this.mrcMechanismClassName) {
      extraState.mechanismClassName = this.mrcMechanismClassName;
    }
    if (this.mrcMechanismBlockId) {
      extraState.mechanismBlockId = this.mrcMechanismBlockId;
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
    this.mrcImportModule = extraState.importModule
        ? extraState.importModule : '';
    this.mrcActualFunctionName = extraState.actualFunctionName
        ? extraState.actualFunctionName : '';
    this.mrcOtherBlockId = extraState.otherBlockId
        ? extraState.otherBlockId : '';
    // TODO(lizlooney: Remove this if statement after Alan and I have updated our projects.
    if (!this.mrcOtherBlockId) {
      const oldExtraState = extraState as any;
      if (oldExtraState.classMethodDefBlockId) {
        this.mrcOtherBlockId = oldExtraState.classMethodDefBlockId;
      } else if (oldExtraState.componentBlockId) {
        this.mrcOtherBlockId = oldExtraState.componentBlockId;
      } else if (oldExtraState.eventBlockId) {
        this.mrcOtherBlockId = oldExtraState.eventBlockId;
      }
    }
    this.mrcComponentClassName = extraState.componentClassName
        ? extraState.componentClassName : '';
    this.mrcOriginalComponentName = extraState.componentName
        ? extraState.componentName : '';
    this.mrcMechanismClassName = extraState.mechanismClassName
        ? extraState.mechanismClassName : '';
    this.mrcMechanismBlockId = extraState.mechanismBlockId
        ? extraState.mechanismBlockId : '';
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
        case FunctionKind.BUILT_IN:
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
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
                .appendField(createFieldNonEditableText(''), FIELD_EVENT_NAME);
          }
          break;
        }
        case FunctionKind.INSTANCE_COMPONENT: {
          const componentNameChoices : string[] = [];
          this.getComponentsFromRobot().forEach(component => componentNameChoices.push(component.name));
          if (!componentNameChoices.includes(this.mrcOriginalComponentName)) {
            componentNameChoices.push(this.mrcOriginalComponentName);
          }
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldDropdown(componentNameChoices), FIELD_COMPONENT_NAME)
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        }
        case FunctionKind.INSTANCE_ROBOT: {
          this.appendDummyInput('TITLE')
              .appendField('call')
              .appendField(createFieldNonEditableText('robot'))
              .appendField('.')
              .appendField(createFieldNonEditableText(''), FIELD_FUNCTION_NAME);
          break;
        }
        case FunctionKind.INSTANCE_MECHANISM: {
          this.appendDummyInput('TITLE')
              .appendField('call')
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
  renameMethodCaller: function(this: CallPythonFunctionBlock, blockId: string, newName: string): void {
    // renameMethodCaller is called when a component, mechanism, event, or
    // method block in the same module is modified.
    switch (this.mrcFunctionKind) {
      case FunctionKind.INSTANCE_WITHIN:
        if (blockId === this.mrcOtherBlockId) {
          // For INSTANCE_WITHIN this.mrcOtherBlockId is the id of an mrc_class_method_def block.
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
          // mrcActualFunctionName does not need to be updated because it is not used for INSTANCE_WITHIN.
        }
        break;
      case FunctionKind.INSTANCE_COMPONENT:
        if (blockId === this.mrcOtherBlockId) {
          // For INSTANCE_COMPONENT this.mrcOtherBlockId is the id of an mrc_component block.
          this.setFieldValue(newName, FIELD_COMPONENT_NAME);
        }
        break;
      case FunctionKind.INSTANCE_ROBOT:
        if (blockId === this.mrcOtherBlockId) {
          // For INSTANCE_ROBOT this.mrcOtherBlockId is the id of an mrc_class_method_def block.
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
        }
        break;
      case FunctionKind.INSTANCE_MECHANISM:
        if (blockId === this.mrcOtherBlockId) {
          // For INSTANCE_MECHANISM this.mrcOtherBlockId is the id of an mrc_class_method_def block.
          this.setFieldValue(newName, FIELD_FUNCTION_NAME);
        } else if (blockId === this.mrcMechanismBlockId) {
          // For INSTANCE_MECHANISM this.mrcMechanismBlockId is the id of an mrc_mechanism block.
          this.setFieldValue(newName, FIELD_MECHANISM_NAME);
        }
        break;
      case FunctionKind.EVENT:
        if (blockId === this.mrcOtherBlockId) {
          // For EVENT, this.mrcOtherBlockId is the id of an mrc_event block.
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
    if (this.mrcFunctionKind == FunctionKind.EVENT) {
      const event = methodOrEvent as storageModuleContent.Event;
      this.mrcArgs = [];
      event.args.forEach((arg) => {
        this.mrcArgs.push({
          name: arg.name,
          type: arg.type,
        });
      });
    } else if (this.mrcFunctionKind == FunctionKind.INSTANCE_WITHIN) {
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
  getComponentsFromRobot: function(this: CallPythonFunctionBlock): storageModuleContent.Component[] {
    // Get the list of components whose type matches this.mrcComponentClassName.
    const components: storageModuleContent.Component[] = [];
    const editor = Editor.getEditorForBlocklyWorkspace(this.workspace);
    if (editor) {
      editor.getComponentsFromRobot().forEach(component => {
        if (component.className === this.mrcComponentClassName) {
          components.push(component);
        }
      });
    }
    return components;
  },
  mrcOnLoad: function(this: CallPythonFunctionBlock): void {
    // mrcOnLoad is called for each CallPythonFunctionBlock when the blocks are loaded in the blockly workspace.
    const editor = Editor.getEditorForBlocklyWorkspace(this.workspace);
    if (!editor) {
      return;
    }
    const warnings: string[] = [];

    // If this block is calling a component method, check whether the component
    // still exists and whether it has been changed.
    // If the component doesn't exist, put a visible warning on this block.
    // If the component has changed, update the block if possible or put a
    // visible warning on it.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_COMPONENT) {
      let foundComponent = false;
      const componentsInScope: storageModuleContent.Component[] = [];
      componentsInScope.push(...this.getComponentsFromRobot());
      if (editor.getCurrentModuleType() === storageModule.MODULE_TYPE_MECHANISM) {
        componentsInScope.push(...editor.getComponentsFromWorkspace());
      }
      for (const component of componentsInScope) {
        if (component.blockId === this.mrcOtherBlockId) {
          foundComponent = true;

          // If the component name has changed, we can handle that.
          if (this.getFieldValue(FIELD_COMPONENT_NAME) !== component.name) {
            // Replace the FIELD_COMPONENT_NAME field.
            const titleInput = this.getInput('TITLE')
            if (titleInput) {
              let indexOfComponentName = -1;
              for (let i = 0, field; (field = titleInput.fieldRow[i]); i++) {
                if (field.name === FIELD_COMPONENT_NAME) {
                  indexOfComponentName = i;
                  break;
                }
              }
              if (indexOfComponentName != -1) {
                const componentNameChoices : string[] = [];
                componentsInScope.forEach(component => componentNameChoices.push(component.name));
                titleInput.removeField(FIELD_COMPONENT_NAME);
                titleInput.insertFieldAt(indexOfComponentName,
                    createFieldDropdown(componentNameChoices), FIELD_COMPONENT_NAME);
              }
              this.setFieldValue(component.name, FIELD_COMPONENT_NAME);
            }
          }

          // Since we found the component, we can break out of the loop.
          break;
        }
      }
      if (!foundComponent) {
        warnings.push('This block calls a method on a component that no longer exists.');
      }

      // TODO(lizlooney): Could the component's method have change or been deleted?
    }

    // If this block is calling a robot method, check whether the robot method
    // still exists and whether it has been changed.
    // If the robot method doesn't exist, put a visible warning on this block.
    // If the robot method has changed, update the block if possible or put a
    // visible warning on it.
    if (this.mrcFunctionKind === FunctionKind.INSTANCE_ROBOT) {
      if (editor.getCurrentModuleType() === storageModule.MODULE_TYPE_MECHANISM) {
        warnings.push('This block is not allowed to be used inside a mechanism.');
      } else {
        let foundRobotMethod = false;
        const robotMethods = editor.getMethodsFromRobot();
        for (const robotMethod of robotMethods) {
          if (robotMethod.blockId === this.mrcOtherBlockId) {
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
          warnings.push('This block calls a method that no longer exists.');
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
      if (editor.getCurrentModuleType() === storageModule.MODULE_TYPE_MECHANISM) {
        warnings.push('This block is not allowed to be used inside a mechanism.');
      } else {
        let foundMechanism = false;
        const mechanismsInRobot = editor.getMechanismsFromRobot();
        for (const mechanismInRobot of mechanismsInRobot) {
          if (mechanismInRobot.blockId === this.mrcMechanismBlockId) {
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
              if (mechanismMethod.blockId === this.mrcOtherBlockId) {
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
              warnings.push('This block calls a method that no longer exists.');
            }

            // Since we found the mechanism, we can break out of the loop.
            break;
          }
        }
        if (!foundMechanism) {
          warnings.push('This block calls a method on a mechanism that no longer exists.');
        }
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_FUNCTION_CHANGED);
      this.getIcon(Blockly.icons.IconType.WARNING)!.setBubbleVisible(true);
      this.bringToFront();
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_FUNCTION_CHANGED);
    }
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
  let code = '';
  let needOpenParen = true;
  let delimiterBeforeArgs = '';
  let argStartIndex = 0;
  switch (callPythonFunctionBlock.mrcFunctionKind) {
    case FunctionKind.BUILT_IN: {
      const functionName = (callPythonFunctionBlock.mrcActualFunctionName)
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = functionName;
      break;
    }
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
      const eventName = block.getFieldValue(FIELD_EVENT_NAME);
      code = 'self.fire_event("' + eventName + '"';
      needOpenParen = false;
      delimiterBeforeArgs = ', ';
      break;
    }
    case FunctionKind.INSTANCE_COMPONENT: {
      const componentName = block.getFieldValue(FIELD_COMPONENT_NAME);
      const functionName = callPythonFunctionBlock.mrcActualFunctionName
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      // Generate the correct code depending on the module type.
      switch (generator.getModuleType()) {
        case storageModule.MODULE_TYPE_ROBOT:
        case storageModule.MODULE_TYPE_MECHANISM:
          code = 'self.';
          break;
        case storageModule.MODULE_TYPE_OPMODE:
          code = 'self.robot.';
          break;
      }
      code += componentName + '.' + functionName;
      break;
    }
    case FunctionKind.INSTANCE_ROBOT: {
      const functionName = callPythonFunctionBlock.mrcActualFunctionName
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      code = 'self.robot.' + functionName;
      break;
    }
    case FunctionKind.INSTANCE_MECHANISM: {
      const mechanismName = block.getFieldValue(FIELD_MECHANISM_NAME);
      const functionName = callPythonFunctionBlock.mrcActualFunctionName
          ? callPythonFunctionBlock.mrcActualFunctionName
          : block.getFieldValue(FIELD_FUNCTION_NAME);
      // Generate the correct code depending on the module type.
      switch (generator.getModuleType()) {
        case storageModule.MODULE_TYPE_ROBOT:
          code = 'self.' + mechanismName;
          break;
        case storageModule.MODULE_TYPE_OPMODE:
          code = 'self.robot.' + mechanismName;
          break;
        case storageModule.MODULE_TYPE_MECHANISM:
          // The INSTANCE_MECHANISM version should not be used in a mechanism.
          // TODO(lizlooney): What if the user copies a block from an robot or opmode and pastes
          // it into a mechanism?
          break;
      }
      code += '.' + functionName;
      break;
    }
    default:
      throw new Error('mrcFunctionKind has unexpected value: ' + callPythonFunctionBlock.mrcFunctionKind)
  }
  if (needOpenParen) {
    code += '(';
  }
  const codeForArgs = generateCodeForArguments(callPythonFunctionBlock, generator, argStartIndex);
  if (codeForArgs) {
    code += delimiterBeforeArgs + codeForArgs;
  }
  code += ')';
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

function getMethodCallers(workspace: Blockly.Workspace, otherBlockId: string): Blockly.Block[] {
  return workspace.getBlocksByType(BLOCK_NAME).filter((block) => {
    return (
        (block as CallPythonFunctionBlock).mrcOtherBlockId === otherBlockId ||
        (block as CallPythonFunctionBlock).mrcMechanismBlockId === otherBlockId);
  });
}

export function renameMethodCallers(workspace: Blockly.Workspace, otherBlockId: string, newName: string): void {
  getMethodCallers(workspace, otherBlockId).forEach(block => {
    (block as CallPythonFunctionBlock).renameMethodCaller(otherBlockId, newName);
  });
}

export function mutateMethodCallers(
    workspace: Blockly.Workspace, otherBlockId: string, methodOrEvent: storageModuleContent.Method | storageModuleContent.Event) {
  const oldRecordUndo = Blockly.Events.getRecordUndo();

  getMethodCallers(workspace, otherBlockId).forEach(block => {
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
    otherBlockId: method.blockId,
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
  if (!classData) {
    throw new Error('Could not find classData for ' + component.className);
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
    const block = createInstanceComponentBlock(component, functionData);
    contents.push(block);
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
    otherBlockId: component.blockId,
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
    otherBlockId: method.blockId,
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
    otherBlockId: method.blockId,
    mechanismClassName: mechanismInRobot.className,
    mechanismBlockId: mechanismInRobot.blockId,
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
    otherBlockId: event.blockId,
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
