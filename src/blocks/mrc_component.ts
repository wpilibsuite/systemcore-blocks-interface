/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Create a component with a name of a certain type
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_COMPONENTS } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { getModuleTypeForWorkspace } from './utils/workspaces';
import { componentClasses } from './utils/python';
import { makeLegalName } from './utils/validator';
import * as toolboxItems from '../toolbox/items';
import { getClassData } from './utils/python';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageNames from '../storage/names';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import {
    BLOCK_NAME as MRC_MECHANISM_COMPONENT_HOLDER,
    MechanismComponentHolderBlock,
    mrcDescendantsMayHaveChanged } from './mrc_mechanism_component_holder';
import { createPort } from './mrc_port';
import { ClassData, FunctionData } from './utils/python_json_types';
import { renameMethodCallers } from './mrc_call_python_function'


export const BLOCK_NAME = 'mrc_component';
export const OUTPUT_NAME = 'mrc_component';

export const FIELD_NAME = 'NAME';
export const FIELD_TYPE = 'TYPE';

const WARNING_ID_NOT_IN_HOLDER = 'not in holder';
const WARNING_ID_COMPONENT_MISSING_COMPONENT_CLASS = 'missing component class';

type ConstructorArg = {
  name: string,
  type: string,
};

type ComponentExtraState = {
  componentId?: string,
  importModule?: string,
  tooltip?: string,
  params?: ConstructorArg[],
  /**
   * The module type. Note that this is only present when blocks are created for the toolbox. It is not
   * saved to the blocks file.
   */
  moduleType? : storageModule.ModuleType,
}

export type ComponentBlock = Blockly.Block & ComponentMixin;
interface ComponentMixin extends ComponentMixinType {
  mrcComponentId: string,
  mrcArgs: ConstructorArg[],
  mrcImportModule: string,
  mrcTooltip: string,

  /**
   * mrcHasNotInHolderWarning is set to true if we set the NOT_IN_HOLDER warning text on the block.
   * It is checked to avoid adding a warning if there already is one. Otherwise, if we get two move
   * events (one for drag and one for snap), and we call setWarningText for both events, we get a
   * detached warning balloon.
   * See https://github.com/wpilibsuite/systemcore-blocks-interface/issues/248.
   */
  mrcHasNotInHolderWarning: boolean,
}
type ComponentMixinType = typeof COMPONENT;

const COMPONENT = {
  /**
   * Block initialization.
   */
  init: function (this: ComponentBlock): void {
    this.mrcHasNotInHolderWarning = false;
    this.setStyle(MRC_STYLE_COMPONENTS);
    this.setTooltip(() => {
      return this.mrcTooltip;
    });
    const nameField = new Blockly.FieldTextInput('')
    nameField.setValidator(this.mrcNameFieldValidator.bind(this, nameField));
    this.appendDummyInput()
      .appendField(nameField, FIELD_NAME)
      .appendField(Blockly.Msg.OF_TYPE)
      .appendField(createFieldNonEditableText(''), FIELD_TYPE);
    this.setPreviousStatement(true, OUTPUT_NAME);
    this.setNextStatement(true, OUTPUT_NAME);
  },
  ...NONCOPYABLE_BLOCK,

  /**
    * Returns the state of this block as a JSON serializable object.
    */
  saveExtraState: function (this: ComponentBlock): ComponentExtraState {
    const extraState: ComponentExtraState = {
      componentId: this.mrcComponentId,
    };
    extraState.params = [];
    if (this.mrcArgs){
      this.mrcArgs.forEach((arg) => {
        extraState.params!.push({
          name: arg.name,
          type: arg.type,
        });
      });
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcTooltip) {
      extraState.tooltip = this.mrcTooltip;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function (this: ComponentBlock, extraState: ComponentExtraState): void {
    this.mrcComponentId = extraState.componentId ? extraState.componentId : this.id;
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcTooltip = extraState.tooltip ? extraState.tooltip : '';
    this.mrcArgs = [];

    if (extraState.params) {
      extraState.params.forEach((arg) => {
        const upgradedArgType = storageModuleContent.upgradePortTypeString(arg.type);
        this.mrcArgs.push({
          name: arg.name,
          type: upgradedArgType,
        });
      });
    }

    // Update the block to reflect the newly loaded extra state.
    const moduleType = extraState.moduleType ? extraState.moduleType : getModuleTypeForWorkspace(this.workspace);
    if (moduleType === storageModule.ModuleType.ROBOT) {
      // Add input sockets for the arguments.
      for (let i = 0; i < this.mrcArgs.length; i++) {
        const input = this.appendValueInput('ARG' + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.mrcArgs[i].name);
        if (this.mrcArgs[i].type) {
          input.setCheck(this.mrcArgs[i].type);
        }
      }
    }
  },
  mrcNameFieldValidator(this: ComponentBlock, nameField: Blockly.FieldTextInput, name: string): string {
    if (this.isInFlyout) {
      // Flyouts can have multiple methods with identical names.
      return name;
    }

    const otherNames: string[] = [];
    this.workspace.getBlocksByType(BLOCK_NAME)
        .filter(block => block.id !== this.id)
        .forEach((block) => {
          otherNames.push(block.getFieldValue(FIELD_NAME));
        });

    const legalName = makeLegalName(name, otherNames, /* mustBeValidPythonIdentifier */ true);
    const oldName = nameField.getValue();
    if (oldName && oldName !== name && oldName !== legalName) {
      // Rename any callers.
      renameMethodCallers(this.workspace, this.mrcComponentId, legalName);
      const editor = Editor.getEditorForBlocklyWorkspace(this.workspace);
      if (editor) {
        editor.updateToolboxAfterDelay();
      }
    }
    return legalName;
  },
  getComponent: function (this: ComponentBlock): storageModuleContent.Component | null {
    const componentName = this.getFieldValue(FIELD_NAME);
    const componentType = this.getFieldValue(FIELD_TYPE);
    const ports: {[port: string]: string} = {};
    this.getComponentPorts(ports);
    return {
      componentId: this.mrcComponentId,
      name: componentName,
      className: componentType,
      ports: ports,
    };
  },
  getArgName: function (this: ComponentBlock, _: number): string {
    return this.getFieldValue(FIELD_NAME) + '__' + 'port';
  },
  getComponentPorts: function (this: ComponentBlock, ports: {[argName: string]: string}): void {
    // Collect the ports for this component block.
    for (let i = 0; i < this.mrcArgs.length; i++) {
      const argName = this.getArgName(i);
      ports[argName] = this.mrcArgs[i].type;
    }
  },
  /**
   * mrcOnLoad is called for each ComponentBlock when the blocks are loaded in the blockly workspace.
   */
  mrcOnLoad: function(this: ComponentBlock, _editor: Editor): void {
    this.checkBlockIsInHolder();
    this.checkComponentClass();
  },
  /**
   * mrcOnCreate is called for each ComponentBlock when it is created.
   */
  mrcOnCreate: function(this: ComponentBlock, _editor: Editor): void {
    this.checkBlockIsInHolder();
  },
  /**
   * mrcOnMove is called when a ComponentBlock is moved.
   */
  mrcOnMove: function(this: ComponentBlock, editor: Editor, reason: string[]): void {
    this.checkBlockIsInHolder();
    if (reason.includes('connect')) {
      const rootBlock: Blockly.Block | null = this.getRootBlock();
      if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
        (rootBlock as MechanismComponentHolderBlock).setNameOfChildBlock(this);
      }
    }
    mrcDescendantsMayHaveChanged(this.workspace, editor);
  },
  checkBlockIsInHolder: function(this: ComponentBlock): void {
    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
      // If the root block is the mechanism_component_holder, the component block is allowed to stay.
      // Remove any previous warning.
      this.setWarningText(null, WARNING_ID_NOT_IN_HOLDER);
      this.mrcHasNotInHolderWarning = false;
    } else {
      // Otherwise, add a warning to the block.
      if (!this.mrcHasNotInHolderWarning) {
        this.setWarningText(Blockly.Msg.WARNING_COMPONENT_NOT_IN_HOLDER, WARNING_ID_NOT_IN_HOLDER);
        const icon = this.getIcon(Blockly.icons.IconType.WARNING);
        if (icon) {
          icon.setBubbleVisible(true);
        }
        this.mrcHasNotInHolderWarning = true;
      }
    }
  },
  /**
   * Checks whether the component class exists and if not, puts a warning on the block.
   */
  checkComponentClass: function(this: ComponentBlock): void {
    const componentType = this.getFieldValue(FIELD_TYPE);
    const classData = getClassData(componentType);
    if (classData) {
      // Remove previous warning.
      this.setWarningText(null, WARNING_ID_COMPONENT_MISSING_COMPONENT_CLASS);
    } else {
      // Otherwise, add a warning to the block.
      this.setWarningText(
          Blockly.Msg.WARNING_COMPONENT_MISSING_COMPONENT_CLASS,
          WARNING_ID_COMPONENT_MISSING_COMPONENT_CLASS);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    }
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: ComponentBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcComponentId in oldIdToNewId) {
      this.mrcComponentId = oldIdToNewId[this.mrcComponentId];
    }
  },
  upgrade_005_to_006: function(this: ComponentBlock) {
    for (let i = 0; i < this.mrcArgs.length; i++) {
      if (this.mrcArgs[i].type === 'Port') {
        this.mrcArgs[i].type = this.mrcArgs[i].name;
      }
    }
  },
  upgrade_008_to_009: function(this: ComponentBlock) {
    const fieldTypeValue = this.getFieldValue(FIELD_TYPE);
    if (fieldTypeValue === 'expansion_hub_motor.ExpansionHubMotor') {
      this.setFieldValue('wpilib_placeholders.ExpansionHubMotor', FIELD_TYPE);
    } else if (fieldTypeValue === 'expansion_hub_servo.ExpansionHubServo') {
      this.setFieldValue('wpilib_placeholders.ExpansionHubServo', FIELD_TYPE);
    }
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = COMPONENT;
}

export const pythonFromBlock = function (
  block: ComponentBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.importModule(block.mrcImportModule);
  }

  const componentName = block.getFieldValue(FIELD_NAME);
  const componentType = block.getFieldValue(FIELD_TYPE);
  let code = 'self.' + componentName + ' = ' + componentType + '(\n';

  for (let i = 0; i < block.mrcArgs.length; i++) {
    if (generator.getModuleType() === storageModule.ModuleType.ROBOT) {
      // In a robot, a component block has an input socket with a mrc_port block
      // plugged into it.
      code += generator.prefixLines(generator.valueToCode(block, 'ARG' + i, Order.NONE), generator.INDENT);
    } else {
      // In a mechanism, a component block does not have input sockets.
      // Each argument of the mechanism constructor is a tuple containing the
      // constructor parameters of a component.
      // Use the * operator to unpack the elements of the tuple and pass each
      // element as a separate positional argument to the component constructor.
      code += generator.INDENT + '*' + block.getArgName(i) + ',\n';
    }
  }
  code += ')\n';

  return code;
}

export function getAllPossibleComponents(
    moduleType: storageModule.ModuleType): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];
  // Iterate through all the component classes and add definition blocks.
  componentClasses.forEach(classData => {
    const simpleClassName = classData.className.substring(classData.className.lastIndexOf('.') + 1);
    const componentName = 'my_' + storageNames.pascalCaseToSnakeCase(simpleClassName);
    classData.constructors.forEach(constructor => {
       contents.push(createComponentBlock(componentName, classData, constructor, moduleType));
    });
  });

  return contents;
}

function createComponentBlock(
    componentName: string,
    classData: ClassData,
    constructorData: FunctionData,
    moduleType: storageModule.ModuleType): toolboxItems.Block {
  const extraState: ComponentExtraState = {
    importModule: classData.moduleName,
    tooltip: constructorData.tooltip,
    params: [],
    moduleType: moduleType,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_NAME] = componentName;
  fields[FIELD_TYPE] = classData.className;
  const inputs: {[key: string]: any} = {};

  if (constructorData.componentPortName && constructorData.componentPortType) {
    extraState.params!.push({
      name: constructorData.componentPortName,
      type: constructorData.componentPortType,
    });
    if (moduleType == storageModule.ModuleType.ROBOT) {
      inputs['ARG0'] = createPort(constructorData.componentPortType);
    }
  }
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}

/**
 * Upgrades the ComponentBlocks in the given workspace from version 005 to 006.
 * This function should only be called when upgrading old projects.
 */
export function upgrade_005_to_006(workspace: Blockly.Workspace): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as ComponentBlock).upgrade_005_to_006();
  });
}

/**
 * Upgrades the ComponentBlocks in the given workspace from version 008 to 009.
 * This function should only be called when upgrading old projects.
 */
export function upgrade_008_to_009(workspace: Blockly.Workspace): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as ComponentBlock).upgrade_008_to_009();
  });
}
