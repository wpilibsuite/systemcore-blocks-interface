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
 * @fileoverview Create a component that does a simple print statement
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { PythonGenerator } from 'blockly/python';
import { Order } from 'blockly/python';

export const BLOCK_NAME = 'mrc_print';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput('TEXT')
          .setCheck('String')
          .appendField(Blockly.Msg['MRC_PRINT']);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle('text_blocks');
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  return 'print(' + generator.valueToCode(block, 'TEXT', Order.NONE) + ')\n';
};