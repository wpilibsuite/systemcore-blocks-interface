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
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { getAllowedTypesForSetCheck, getClassData, getModuleData, getSubclassNames } from './utils/python';
import * as toolboxItems from '../toolbox/items';
import * as commonStorage from '../storage/common_storage';
import { createPortShadow } from './mrc_port';
import { createNumberShadowValue } from './utils/value';
import { ClassData, FunctionData } from './utils/python_json_types';


export const BLOCK_NAME = 'mrc_component';
export const OUTPUT_NAME = 'mrc_component';

export const FIELD_NAME = 'NAME';
export const FIELD_TYPE = 'TYPE';

export type ConstructorArg = {
  name: string,
  type: string,
};

type ComponentExtraState = {
  importModule?: string,
  // If staticFunctionName is not present, generate the constructor.
  staticFunctionName?: string,
  hideParams?: boolean,
  params?: ConstructorArg[],
}

export type ComponentBlock = Blockly.Block & ComponentMixin;
interface ComponentMixin extends ComponentMixinType {
  mrcArgs: ConstructorArg[],
  hideParams: boolean,
  mrcImportModule: string,
  mrcStaticFunctionName: string,
}
type ComponentMixinType = typeof COMPONENT;

const COMPONENT = {
  /**
   * Block initialization.
   */
  init: function (this: ComponentBlock): void {
    this.setStyle(MRC_STYLE_COMPONENTS);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), FIELD_NAME)
      .appendField(Blockly.Msg.OF_TYPE)
      .appendField(createFieldNonEditableText(''), FIELD_TYPE);
    this.setPreviousStatement(true, OUTPUT_NAME);
    this.setNextStatement(true, OUTPUT_NAME);
  },

  /**
    * Returns the state of this block as a JSON serializable object.
    */
  saveExtraState: function (this: ComponentBlock): ComponentExtraState {
    const extraState: ComponentExtraState = {
    };
    extraState.params = [];
    if (this.mrcArgs){
      this.mrcArgs.forEach((arg) => {
        extraState.params!.push({
          'name': arg.name,
          'type': arg.type,
        });
      });
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcStaticFunctionName) {
      extraState.staticFunctionName = this.mrcStaticFunctionName;
    }
    if (this.hideParams) {
      extraState.hideParams = this.hideParams;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function (this: ComponentBlock, extraState: ComponentExtraState): void {
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcStaticFunctionName = extraState.staticFunctionName ? extraState.staticFunctionName : '';
    this.hideParams = extraState.hideParams ? extraState.hideParams : false;
    this.mrcArgs = [];

    if (extraState.params) {
      extraState.params.forEach((arg) => {
        this.mrcArgs.push({
          'name': arg.name,
          'type': arg.type,
        });
      });
    }
    this.mrcArgs = extraState.params ? extraState.params : [];
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function (this: ComponentBlock): void {
    if (this.hideParams == false) {
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
  getComponent: function (this: ComponentBlock): commonStorage.Component | null {
    const componentName = this.getFieldValue(FIELD_NAME);
    const componentType = this.getFieldValue(FIELD_TYPE);
    return {
      blockId: this.id,
      name: componentName,
      className: componentType,
    };
  },
  getNewPort: function (this: ComponentBlock, i: number): string {
    let extension = '';
    if (i != 0) {
      extension = '_' + (i + 1).toString();
    }
    return block.getFieldValue(FIELD_NAME) + extension + '_port';
  },
  getHardwarePorts: function (this: ComponentBlock, ports: {[key: string]: string}): void {
    // Collect the hardware ports for this component block that are needed to generate
    // the robot's define_hardware method. (The key is the port, the value is the type.)
    if (this.hideParams) {
      for (let i = 0; i < this.mrcArgs.length; i++) {
        const fieldName = 'ARG' + i;
        const newPort = this.getNewPort(i);
        ports[newPort] = this.mrcArgs[i].type;
      }
    }
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = COMPONENT;
}

export const pythonFromBlock = function (
  block: ComponentBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.addImport(block.mrcImportModule);
  }
  let code = 'self.' + block.getFieldValue(FIELD_NAME) + ' = ' + block.getFieldValue(FIELD_TYPE);
  if (block.mrcStaticFunctionName) {
    code += '.' + block.mrcStaticFunctionName;
  }
  code += '(';

  for (let i = 0; i < block.mrcArgs.length; i++) {
    const fieldName = 'ARG' + i;
    if (i != 0) {
      code += ', '
    }
    if (block.hideParams) {
      code += block.mrcArgs[i].name + ' = ' + block.getNewPort(i);
    } else {
      code += block.mrcArgs[i].name + ' = ' + generator.valueToCode(block, fieldName, Order.NONE);
    }
  }
  code += ')\n' + 'self.hardware.append(self.' + block.getFieldValue(FIELD_NAME) + ')\n';
  return code;
}

export function getAllPossibleComponents(hideParams: boolean): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];
  // Iterate through all the components subclasses and add definition blocks.
  const componentTypes = getSubclassNames('component.Component');

  componentTypes.forEach(componentType => {
    const classData = getClassData(componentType);
    if (!classData) {
      throw new Error('Could not find classData for ' + componentType);
    }

    const componentName = (
        'my_' +
        commonStorage.pascalCaseToSnakeCase(
            componentType.substring(componentType.lastIndexOf('.') + 1)));

    classData.staticMethods.forEach(staticFunctionData => {
      if (staticFunctionData.returnType === componentType) {
        contents.push(createComponentBlock(componentName, classData, staticFunctionData, hideParams));
      }
    });
  });

  return contents;
}

function createComponentBlock(
    componentName: string, classData: ClassData, staticFunctionData: FunctionData, hideParams: boolean): toolboxItems.Block {
  const extraState: ComponentExtraState = {
    importModule: classData.moduleName,
    staticFunctionName: staticFunctionData.functionName,
    params: [],
    hideParams: hideParams,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_NAME] = componentName;
  fields[FIELD_TYPE] = classData.className;
  const inputs: {[key: string]: any} = {};
  for (let i = 0; i < staticFunctionData.args.length; i++) {
    const argData = staticFunctionData.args[i];
    extraState.params!.push({
      'name': argData.name,
      'type': argData.type,
    });
    if (!hideParams) {
      if (argData.type === 'int') {
        const portType = getPortTypeForArgument(argData.name);
        if (portType) {
          inputs['ARG' + i] = createPortShadow(portType, 1);
        } else {
          inputs['ARG' + i] = createNumberShadowValue(1);
        }
      }
    }
  }
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}

function getPortTypeForArgument(argName: string): string | null {
  const argNameLower = argName.toLowerCase();
  const moduleData = getModuleData('component');
  if (moduleData) {
    for (const enumData of moduleData.enums) {
      if (enumData.enumClassName ===  'component.PortType') {
      for (const value of enumData.enumValues) {
        if (argNameLower === value.toLowerCase()) {
          return value;
        }
      }
      break;
      }
    }
  }

  return null;
}
