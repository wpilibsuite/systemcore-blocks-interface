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
 * @fileoverview A block for setting the color of the LEDs on a gamepad
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import { Order } from 'blockly/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import { getAllowedTypesForSetCheck } from './utils/python';
import * as Gamepad from '../fields/field_gamepads';

export const BLOCK_NAME = 'mrc_gamepad_leds';

export const INPUT_COLOR = 'COLOR';

const COLOR_CLASS_NAME = 'wpiutil.Color';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput(INPUT_COLOR)
          .setCheck(getAllowedTypesForSetCheck(COLOR_CLASS_NAME))
          .appendField(Gamepad.createTitleField())
          .appendField(Gamepad.createPortField('leds'), Gamepad.PORT_FIELD_NAME)
          .appendField(Blockly.Msg['GAMEPAD_SET_LEDS']);
      this.setOutput(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(MRC_STYLE_DRIVER_STATION);
      this.setTooltip(Blockly.Msg['GAMEPAD_SET_LEDS_TOOLTIP']);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: ExtendedPythonGenerator,
) {
  let colorCode = generator.valueToCode(block, INPUT_COLOR, Order.NONE);
  if (!colorCode) {
    colorCode = generator.importModuleDotClass(COLOR_CLASS_NAME) + '.WHITE';
  }
  return Gamepad.methodForLeds(
    generator,
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    colorCode);
}
