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
 * @fileoverview A block for interfacing with the gamepad boolean (button)
 * @author alan@porpoiseful.com (Alan Smith)
 */

/* NOTE: This will likely go away when we can parse the gamepad class
 * but it doesn't exist yet, so this is a placeholder.
 */

import * as Blockly from 'blockly/core';
import {Order} from 'blockly/python';
import { PythonGenerator } from 'blockly/python';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import * as Gamepad from '../fields/field_gamepads';
import { GamepadTypeUtils } from '../types/GamepadType';

export const BLOCK_NAME = 'mrc_gamepad_boolean';

/** The suffix added to the button's method for each value of the action field. */
const ACTION_SUFFIXES: Record<Gamepad.GamepadAction, string> = {
  [Gamepad.GamepadAction.IS_DOWN]: '',
  [Gamepad.GamepadAction.WAS_PRESSED]: 'Pressed',
  [Gamepad.GamepadAction.WAS_RELEASED]: 'Released',
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Gamepad.createTitleField())
          .appendField(Gamepad.createPortField(), Gamepad.PORT_FIELD_NAME)
          .appendField(Gamepad.createButtonField(), Gamepad.BUTTON_FIELD_NAME)
      this.appendDummyInput()
          .appendField(Gamepad.createActionField(), Gamepad.ACTION_FIELD_NAME);
      this.setOutput(true, 'Boolean');
      this.setStyle(MRC_STYLE_DRIVER_STATION);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    _: PythonGenerator,
) {
  return [methodForButton(
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    block.getFieldValue(Gamepad.BUTTON_FIELD_NAME),
    block.getFieldValue(Gamepad.ACTION_FIELD_NAME)), Order.ATOMIC];
}

function methodForButton(
    gamepad: number, button: string, action: Gamepad.GamepadAction): string {
  const gamepadType = Gamepad.getGamepadType(gamepad);

  // Get the button configuration for this gamepad type
  const buttonConfig = GamepadTypeUtils.getButtonConfig(gamepadType);
  const config = buttonConfig?.get(button);
  const suffix: string | undefined = ACTION_SUFFIXES[action];

  if (config === undefined || suffix === undefined) {
    return '';
  }

  return Gamepad.getPythonForGamepad(gamepad) + '.' + config.method + suffix + '()';
}
