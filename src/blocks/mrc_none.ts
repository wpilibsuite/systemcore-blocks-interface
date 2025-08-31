/**
 * @license
 * Copyright 2025 Google LLC
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
 * @fileoverview Block for Python's None keyword.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { MRC_STYLE_NONE } from '../themes/styles'
import { Order, PythonGenerator } from 'blockly/python';

export const BLOCK_NAME = 'mrc_none';

export function setup() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.setOutput(true); // no type for None
      this.appendDummyInput()
          .appendField(Blockly.Msg.NONE);
      this.setStyle(MRC_STYLE_NONE);
      this.setTooltip(Blockly.Msg.NONE_TOOLTIP);
    },
  };
}

export function pythonFromBlock(
    _block: Blockly.Block,
    _generator: PythonGenerator,
): [string, Order] {
  return ['None', Order.ATOMIC];
}

export function createNoneShadowValue(): any {
  return {
    'shadow': {
      'type': 'mrc_none',
    },
  }
}
