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
import { getAllowedTypesForSetCheck } from './utils/python';

export const BLOCK_NAME = 'mrc_component';
export const OUTPUT_NAME = 'mrc_component';

export type ConstructorArg = {
  name: string,
  type: string,
};

type ComponentExtraState = {
  importModule?: string,
  hideParams?: boolean,
  params?: ConstructorArg[],
}

type ComponentBlock = Blockly.Block & ComponentMixin;
interface ComponentMixin extends ComponentMixinType {
  mrcArgs: ConstructorArg[],
  hideParams: boolean,
  mrcImportModule: string,
}
type ComponentMixinType = typeof COMPONENT;

const COMPONENT = {
  /**
    * Block initialization.
    */
  init: function (this: ComponentBlock): void {
    this.setStyle(MRC_STYLE_COMPONENTS);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('my_mech'), 'NAME')
      .appendField('of type')
      .appendField(createFieldNonEditableText(''), 'TYPE');
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
    this.mrcArgs.forEach((arg) => {
      extraState.params!.push({
        'name': arg.name,
        'type': arg.type,
      });
    });
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
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
  }
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
  let code = 'self.' + block.getFieldValue('NAME') + ' = ' + block.getFieldValue('TYPE') + '(';

  for (let i = 0; i < block.mrcArgs.length; i++) {
    const fieldName = 'ARG' + i;
    if (i != 0) {
      code += ', '
    }
    if(block.hideParams){
      let extension = '';
      if(i != 0){
        extension = '_' + (i + 1).toString();
      }
      code += block.mrcArgs[i].name + " = " + block.getFieldValue('NAME') + extension; 
    }else{
      code += block.mrcArgs[i].name + ' = ' + generator.valueToCode(block, fieldName, Order.NONE);
    }
  }
  code += ')\n' + "self.hardware.append(self." + block.getFieldValue('NAME') + ")\n";
  return code;
}
