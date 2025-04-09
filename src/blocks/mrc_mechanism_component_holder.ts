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
 * @fileoverview Blocks to hold mechanisms and containers
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { MRC_STYLE_MECHANISMS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import {OUTPUT_NAME as MECHANISM_OUTPUT } from './mrc_mechanism';
import {OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';


export const BLOCK_NAME = 'mrc_mechanism_component_holder';


type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
}
type MechanismComponentHolderMixinType = typeof MECHANISM_COMPONENT_HOLDER;

const MECHANISM_COMPONENT_HOLDER = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismComponentHolderBlock): void {
    this.setInputsInline(false);
    this.appendValueInput('MECHANISM_1').appendField('Mechanisms').setCheck(MECHANISM_OUTPUT);
    this.appendValueInput('COMPONENT_1').appendField('Components').setCheck(COMPONENT_OUTPUT);
    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM_COMPONENT_HOLDER;
}

export const pythonFromBlock = function (
  MechanismComponentHolderBlock: MechanismComponentHolderBlock,
  generator: ExtendedPythonGenerator,
) {
  return ''
}