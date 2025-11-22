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
import { getAllowedTypesForSetCheck, getClassData, getSubclassNames } from './utils/python';
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
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

type ConstructorArg = {
  name: string,
  type: string,
};

type ComponentExtraState = {
  componentId?: string,
  importModule?: string,
  // If staticFunctionName is not present, generate the constructor.
  staticFunctionName?: string,
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
  mrcStaticFunctionName: string,

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
    if (this.mrcStaticFunctionName) {
      extraState.staticFunctionName = this.mrcStaticFunctionName;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function (this: ComponentBlock, extraState: ComponentExtraState): void {
    this.mrcComponentId = extraState.componentId ? extraState.componentId : this.id;
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcStaticFunctionName = extraState.staticFunctionName ? extraState.staticFunctionName : '';
    this.mrcArgs = [];

    if (extraState.params) {
      extraState.params.forEach((arg) => {
        this.mrcArgs.push({
          name: arg.name,
          type: arg.type,
        });
      });
    }
    this.updateBlock_(extraState);
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function (this: ComponentBlock, extraState: ComponentExtraState): void {
    const moduleType = extraState.moduleType ? extraState.moduleType : getModuleTypeForWorkspace(this.workspace);
    if (moduleType === storageModule.ModuleType.ROBOT) {
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
  },
  mrcNameFieldValidator(this: ComponentBlock, nameField: Blockly.FieldTextInput, name: string): string {
    // Strip leading and trailing whitespace.
    name = name.trim();

    const legalName = name;
    const oldName = nameField.getValue();
    if (oldName && oldName !== name && oldName !== legalName) {
      // Rename any callers.
      renameMethodCallers(this.workspace, this.mrcComponentId, legalName);
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
      ports[argName] = this.mrcArgs[i].name;
    }
  },
  /**
   * mrcOnLoad is called for each ComponentBlock when the blocks are loaded in the blockly workspace.
   */
  mrcOnLoad: function(this: ComponentBlock, _editor: Editor): void {
    this.checkBlockIsInHolder();
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
  mrcOnMove: function(this: ComponentBlock, reason: string[]): void {
    this.checkBlockIsInHolder();
    if (reason.includes('connect')) {
      const rootBlock: Blockly.Block | null = this.getRootBlock();
      if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
        (rootBlock as MechanismComponentHolderBlock).setNameOfChildBlock(this);
      }
    }
    mrcDescendantsMayHaveChanged(this.workspace);
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
  let code = 'self.' + block.getFieldValue(FIELD_NAME) + ' = ' + block.getFieldValue(FIELD_TYPE) + "(";

  for (let i = 0; i < block.mrcArgs.length; i++) {
    if (i != 0) {
      code += ', ';
    }
    if (generator.getModuleType() === storageModule.ModuleType.ROBOT) {
      code += generator.valueToCode(block, 'ARG' + i, Order.NONE);
    } else {
      code += block.getArgName(i);
    }
  }
  code += ')\n' + 'self.hardware.append(self.' + block.getFieldValue(FIELD_NAME) + ')\n';
  return code;
}

export function getAllPossibleComponents(
    moduleType: storageModule.ModuleType): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];
  // Iterate through all the components subclasses and add definition blocks.
  const componentTypes = getSubclassNames('component.Component');

  componentTypes.forEach(componentType => {
    const classData = getClassData(componentType);
    if (!classData) {
      throw new Error('Could not find classData for ' + componentType);
    }

    const componentName = 'my_' + classData.moduleName;

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
    //TODO(ags): Remove this because we know what the constructor name is
    staticFunctionName: constructorData.functionName,
    params: [],
    moduleType: moduleType,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_NAME] = componentName;
  fields[FIELD_TYPE] = classData.className;
  const inputs: {[key: string]: any} = {};

  if (constructorData.expectedPortType) {
    extraState.params!.push({
      name: constructorData.expectedPortType,
      type: constructorData.expectedPortType,
    });
    if (moduleType == storageModule.ModuleType.ROBOT ) {
      inputs['ARG0'] = createPort(constructorData.expectedPortType);
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
