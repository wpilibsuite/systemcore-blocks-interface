// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Blocks for math min and max.
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
        ["max", Blockly.Msg.MATH_MAX_TOOLTIP],
        ["min", Blockly.Msg.MATH_MIN_TOOLTIP],
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
