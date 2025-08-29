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
 * @fileoverview Block to add an item to the end of a list.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';


export const BLOCK_NAME = 'mrc_list_add_item';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add item");
      this.appendValueInput("ITEM");
      this.appendDummyInput()
          .appendField("to list");
      this.appendValueInput("LIST")
          .setCheck("Array");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle('list_blocks');
      this.setTooltip("Add the item to the end of the list.");
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const item = generator.valueToCode(block, "ITEM", Order.NONE);
  const list = generator.valueToCode(block, "LIST", Order.MEMBER);
  return list + ".append(" + item + ")\n";
};
