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
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import * as Gamepad from '../fields/field_gamepads';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { GamepadTypeUtils } from '../types/GamepadType';

export const BLOCK_NAME = 'mrc_gamepad_rumble';

const VALUE_FIELD_NAME = 'VALUE';

/** The python module that must be imported for methodForRumble. */
const RUMBLE_MODULE = 'wpilib';
const RUMBLE_TYPE_ENUM = RUMBLE_MODULE + '.GenericHID.RumbleType';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Gamepad.createTitleField())
          .appendField(Gamepad.createPortField(Gamepad.GamepadOutput.RUMBLE), Gamepad.PORT_FIELD_NAME)
          .appendField(Gamepad.createRumbleField(), Gamepad.RUMBLE_FIELD_NAME)
          .appendField(Blockly.Msg.TO)
          .appendField(new Blockly.FieldNumber(1, 0, 1, 0.1), VALUE_FIELD_NAME);
      this.setOutput(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(MRC_STYLE_DRIVER_STATION);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: ExtendedPythonGenerator,
) {
  return methodForRumble(
    generator,
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    block.getFieldValue(Gamepad.RUMBLE_FIELD_NAME),
    block.getFieldValue(VALUE_FIELD_NAME));
}

function methodForRumble(
    generator: ExtendedPythonGenerator, gamepad: number, rumble: string, value : number): string {
  const gamepadType = Gamepad.getGamepadType(gamepad);

  // Get the rumble configuration for this gamepad type
  const rumbleConfig = GamepadTypeUtils.getRumbleConfig(gamepadType);
  const config = rumbleConfig?.get(rumble);

  // There is no gamepad with rumble on this port (the port field shows '---').
  if (config === undefined) {
    return '# This controller has no rumble motors, so this line does nothing.\n';
  }

  generator.importModule(RUMBLE_MODULE);
  return Gamepad.getPythonForGamepad(gamepad) + '.set_rumble(' +
      RUMBLE_TYPE_ENUM + '.' + config.rumbleType + ', ' + value + ')\n';
}
