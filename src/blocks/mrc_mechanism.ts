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
import { Order, PythonGenerator } from 'blockly/python';

import { MRC_STYLE_FUNCTIONS } from '../themes/styles'
import { createFieldNonEditableText } from 'src/fields/FieldNonEditableText';
import { addImport } from './utils/python';


export const BLOCK_NAME = 'mrc_mechanism';
export const OUTPUT_NAME = 'mrc_mechansim';

export type ConstructorArg = {
    name: string,
    type: string,
  };

type MechanismExtraState = {
    importModule?: string,
    params? : ConstructorArg[],
}

type MechanismBlock = Blockly.Block & MechanismMixin;
interface MechanismMixin extends MechanismMixinType {
  mrcArgs: ConstructorArg[],
  mrcImportModule: string,

}
type MechanismMixinType = typeof MECHANISM_FUNCTION;

const MECHANISM_FUNCTION = {
 /**
   * Block initialization.
   */
 init: function(this: MechanismBlock): void {   
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.appendDummyInput()
              .appendField(new Blockly.FieldTextInput('my_mech'), 'NAME')
              .appendField('of type')
              .appendField(createFieldNonEditableText(''), 'TYPE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
 },
}

export const setup = function() {
    Blockly.Blocks[BLOCK_NAME] = MECHANISM_FUNCTION;
}

export const pythonFromBlock = function(
    mechanismBlock: MechanismBlock,
    generator: PythonGenerator,
) {
  if (mechanismBlock.mrcImportModule) {
      addImport(generator, mechanismBlock.mrcImportModule);
  }
  let code = 'self.mechanisms["' + mechanismBlock.getFieldValue('NAME') + '"] = ' 
          + mechanismBlock.getFieldValue('TYPE') + '()' + "\n"
   
  return code
}
