/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Block to convert a number to text with a given number of decimal places.
 * @author alan@porpoiseful.com (Alan Smith)
 */


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';


export const BLOCK_NAME = 'mrc_text_format_number';

const FIELD_DECIMAL_PLACES = 'DECIMAL_PLACES';
const INPUT_NUMBER = 'NUMBER';

const DEFAULT_DECIMAL_PLACES = 2;
const MAX_DECIMAL_PLACES = 10;

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput(INPUT_NUMBER)
          .setCheck('Number')
          .appendField(Blockly.Msg.TEXT_FORMAT_NUMBER)
          .appendField(
              new Blockly.FieldNumber(DEFAULT_DECIMAL_PLACES, 0, MAX_DECIMAL_PLACES, 1),
              FIELD_DECIMAL_PLACES)
          .appendField(Blockly.Msg.TEXT_FORMAT_NUMBER_DECIMAL_PLACES);
      this.setInputsInline(false);
      this.setOutput(true, 'String');
      this.setStyle('text_blocks');
      this.setTooltip(Blockly.Msg.TEXT_FORMAT_NUMBER_TOOLTIP);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const number = generator.valueToCode(block, INPUT_NUMBER, Order.NONE) || '0';
  const decimalPlaces = block.getFieldValue(FIELD_DECIMAL_PLACES);
  const code = 'format(' + number + ", '." + decimalPlaces + "f')";
  return [code, Order.FUNCTION_CALL];
};
