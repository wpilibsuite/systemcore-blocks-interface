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
    const FUNC_CHOICES = [
        ["max", "max"],
        ["min", "min"],
    ];
    this.setOutput(true, "Number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(FUNC_CHOICES), "FUNC");
    this.appendValueInput("A").setCheck("Number")
        .appendField("a")
        .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("B").setCheck("Number")
        .appendField("b")
        .setAlign(Blockly.inputs.Align.RIGHT);
    this.setColour(Blockly.Msg.MATH_HUE);
    // Assign "this" to a variable for use in the tooltip closure below.
    const thisBlock = this;
    const TOOLTIPS = [
        ["max", "Returns the greater of two numerical values."],
        ["min", "Returns the smaller of two numerical values."],
        ];
    this.setTooltip(function() {
      const key = thisBlock.getFieldValue("FUNC");
      for (let i = 0; i < TOOLTIPS.length; i++) {
        if (TOOLTIPS[i][0] === key) {
          return TOOLTIPS[i][1];
        }
      }
      return "";
    });
  }
};

pythonGenerator.forBlock["misc_minmax"] = function(block, generator) {
  const func = block.getFieldValue("FUNC")
  const a = generator.valueToCode(
      block, "A", generator.ORDER_NONE);
  const b = generator.valueToCode(
      block, "B", generator.ORDER_NONE);
  const code = "Math." + func + "(" + a + ", " + b + ")";
  return [code, generator.ORDER_FUNCTION_CALL];
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
      block, "ITEM", generator.ORDER_NONE);
  const list = generator.valueToCode(
      block, "LIST", generator.ORDER_MEMBER);
  return list + ".append(" + item + ")\n";
};

Blockly.Blocks["misc_setAndGetVariable"] = {
  init: function() {
    this.setOutput(true, null);
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("set")
        .appendField(new Blockly.FieldVariable("%{BKY_VARIABLES_DEFAULT_NAME}"), "VAR")
        .appendField("to");
    this.setColour(330);
    this.setTooltip("Sets this variable to be equal to the input and then returns the value of the variable.");
    Blockly.Extensions.apply("misc_setandgetvariable", this, false);
  }
};

const MISC_SETANDGETVARIABLE_MIXIN = {
  /**
   * Add menu options to create getter/setter blocks.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    if (!this.isInFlyout && this.type === "misc_setAndGetVariable") {
      const name = this.getField("VAR").getText();
      const typeToText = {
        "variables_get": Blockly.Msg["VARIABLES_SET_CREATE_GET"].replace("%1", name),
        "variables_set": Blockly.Msg["VARIABLES_GET_CREATE_SET"].replace("%1", name)
      };
      for (let type in typeToText) {
        const option = {enabled: this.workspace.remainingCapacity() > 0};
        option.text = typeToText[type];
        const block = {
          'kind': 'block',
          'type': type,
          'fields': {
            'VAR': {
              'name': name,
            },
          },
        };
        option.callback = Blockly.ContextMenu.callbackFactory(this, block);
        options.push(option);
      }
    }
  }
};

Blockly.Extensions.registerMixin("misc_setandgetvariable",
   MISC_SETANDGETVARIABLE_MIXIN);


pythonGenerator.forBlock["misc_setAndGetVariable"] = function(block, generator) {
  // Variable setter.
  const argument0 = generator.valueToCode(block, "VALUE", generator.ORDER_NONE) || "0";
  const varName = generator.getVariableName(block.getFieldValue("VAR"));
  const code = "(" + varName + " = " + argument0 + ")";
  return [code, generator.ORDER_ATOMIC];
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
      block, "VALUE", generator.ORDER_NONE);
  return value + "\n";
};
