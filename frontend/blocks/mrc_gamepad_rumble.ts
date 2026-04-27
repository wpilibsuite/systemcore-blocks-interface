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
 * @fileoverview A block for interfacing with the gamepad rumble
 * @author alan@porpoiseful.com (Alan Smith)
 */

/* NOTE: This will likely go away when we can parse the gamepad class
 * but it doesn't exist yet, so this is a placeholder.
 */

import * as Blockly from 'blockly/core';
import { PythonGenerator } from 'blockly/python';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import * as Gamepad from '../fields/field_gamepads';

export const BLOCK_NAME = 'mrc_gamepad_rumble';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Gamepad.createTitleField())
          .appendField(Gamepad.createPortField(true), Gamepad.PORT_FIELD_NAME)
          .appendField(Gamepad.createRumbleField(), Gamepad.RUMBLE_FIELD_NAME)
          .appendField(Blockly.Msg.TO)
          .appendField(new Blockly.FieldNumber(1, 0, 1, 0.1), Blockly.Msg.VALUE);
      this.setOutput(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(MRC_STYLE_DRIVER_STATION);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    _: PythonGenerator,
) {
  let result = Gamepad.methodForRumble(
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    block.getFieldValue(Gamepad.RUMBLE_FIELD_NAME), 
    block.getFieldValue(Blockly.Msg.VALUE));
  
  return result;
}