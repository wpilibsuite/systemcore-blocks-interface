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

import { createFieldDropdown } from '../fields/FieldDropdown';

export const BLOCK_NAME = 'mrc_math_min_max';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      const FUNC_NAMES = [
        "max",
        "min",
      ];
      this.setOutput(true, "Number");
      this.appendDummyInput()
          .appendField(createFieldDropdown(FUNC_NAMES), "FUNC");
      this.appendValueInput("A").setCheck("Number")
          .appendField("a")
          .setAlign(Blockly.inputs.Align.RIGHT);
      this.appendValueInput("B").setCheck("Number")
          .appendField("b")
          .setAlign(Blockly.inputs.Align.RIGHT);
      this.setStyle('math_blocks');
      const TOOLTIPS = [
        ["max", "Returns the greater of two numerical values."],
        ["min", "Returns the smaller of two numerical values."],
      ];
      this.setTooltip(() => {
        const key = this.getFieldValue("FUNC");
        for (const tooltip of TOOLTIPS) {
          if (tooltip[0] === key) {
            return tooltip[1];
          }
        }
        return "";
      });
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const func = block.getFieldValue("FUNC")
  const a = generator.valueToCode(block, "A", Order.NONE);
  const b = generator.valueToCode(block, "B", Order.NONE);
  const code = func + "(" + a + ", " + b + ")";
  return [code, Order.FUNCTION_CALL];
};
