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
 * @fileoverview Create a mechanism with a name of a certain type
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_MECHANISMS } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { getAllowedTypesForSetCheck } from './utils/python';

export const BLOCK_NAME = 'mrc_mechanism';
export const OUTPUT_NAME = 'mrc_mechansim';

export type ConstructorArg = {
  name: string,
  type: string,
};

type MechanismExtraState = {
  importModule?: string,
  params?: ConstructorArg[],
}

type MechanismBlock = Blockly.Block & MechanismMixin;
interface MechanismMixin extends MechanismMixinType {
  mrcArgs: ConstructorArg[],
  mrcImportModule: string,
}
type MechanismMixinType = typeof MECHANISM;

const MECHANISM = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismBlock): void {
    this.setStyle(MRC_STYLE_MECHANISMS);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('my_mech'), 'NAME')
      .appendField('of type')
      .appendField(createFieldNonEditableText(''), 'TYPE');
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setOutput(true, OUTPUT_NAME);
  },

  /**
    * Returns the state of this block as a JSON serializable object.
    */
  saveExtraState: function (this: MechanismBlock): MechanismExtraState {
    const extraState: MechanismExtraState = {
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
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismBlock, extraState: MechanismExtraState): void {
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcArgs = [];

    if(extraState.params){
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
    updateBlock_: function(this: MechanismBlock): void {
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

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM;
}

export const pythonFromBlock = function (
  block: MechanismBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.addImport(block.mrcImportModule);
  }
  let code = 'self.' + this.getFieldValue('NAME') + ' = ' + this.getFieldValue('TYPE') + '(';
  
  for (let i = 0; i < block.mrcArgs.length; i++) {
      const fieldName = 'ARG' + i;
      if(i != 0){
        code += ', '
      }
      code += block.mrcArgs[i].name + ' = ' + generator.valueToCode(block, fieldName, Order.NONE);
    } 
  code += ')';
  return [code, Order.ATOMIC];
}
