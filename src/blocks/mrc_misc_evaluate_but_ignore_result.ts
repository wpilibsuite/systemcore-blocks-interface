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
 * @fileoverview Miscellaneous blocks.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';
import { MRC_STYLE_MISC } from '../themes/styles';

export const BLOCK_NAME = 'mrc_misc_evaluate_but_ignore_result';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput('VALUE')
          .appendField('evaluate but ignore result')
          .setAlign(Blockly.inputs.Align.RIGHT);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle(MRC_STYLE_MISC);
      this.setTooltip(
          'Executes the connected block and ignores the result. ' +
          'Allows you to call a function and ignore the return value.');
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE);
  return value + '\n';
};
