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


import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { Order } from 'blockly/python';
import { ContextMenuOption, LegacyContextMenuOption } from 'blockly/core/contextmenu_registry';

import { createFieldDropdown } from './blocks_utils';

const miscColor = 240;        // blue

Blockly.Blocks["misc_comment"] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "COMMENT");
    this.getField("COMMENT").maxDisplayLength = 140;
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(miscColor);
  }
};

pythonGenerator.forBlock["misc_comment"] = function(block, generator) {
  return "# " + block.getFieldValue("COMMENT") + "\n";
};

Blockly.Blocks["misc_minmax"] = {
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
    this.setColour(Blockly.Msg.MATH_HUE);
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
  }
};

pythonGenerator.forBlock["misc_minmax"] = function(block, generator) {
  const func = block.getFieldValue("FUNC")
  const a = generator.valueToCode(
      block, "A", Order.NONE);
  const b = generator.valueToCode(
      block, "B", Order.NONE);
  const code = "Math." + func + "(" + a + ", " + b + ")";
  return [code, Order.FUNCTION_CALL];
};

Blockly.Blocks["misc_addItemToList"] = {
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
    this.setColour(Blockly.Msg.LISTS_HUE);
    this.setTooltip("Add the item to the end of the list.");
  }
};

pythonGenerator.forBlock["misc_addItemToList"] = function(block, generator) {
  const item = generator.valueToCode(
      block, "ITEM", Order.NONE);
  const list = generator.valueToCode(
      block, "LIST", Order.MEMBER);
  return list + ".append(" + item + ")\n";
};

Blockly.Blocks["misc_evaluateButIgnoreResult"] = {
  init: function() {
    this.appendValueInput("VALUE")
        .appendField("evaluate but ignore result")
        .setAlign(Blockly.inputs.Align.RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(miscColor);
    this.setTooltip("Executes the connected block and ignores the result. " +
		    "Allows you to call a function and ignore the return value.");
  }
};

pythonGenerator.forBlock["misc_evaluateButIgnoreResult"] = function(block, generator) {
  const value = generator.valueToCode(
      block, "VALUE", Order.NONE);
  return value + "\n";
};
