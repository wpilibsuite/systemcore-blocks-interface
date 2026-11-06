// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A block for interfacing with the gamepad analog (sticks)
 * @author alan@porpoiseful.com (Alan Smith)
 */

/* NOTE: This will likely go away when we can parse the gamepad class
 * but it doesn't exist yet, so this is a placeholder.
 */

import * as Blockly from 'blockly/core';
import { Order, PythonGenerator } from 'blockly/python';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import * as Gamepad from '../fields/field_gamepads';
import { GamepadTypeUtils } from '../types/GamepadType';

export const BLOCK_NAME = 'mrc_gamepad_analog';


export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Gamepad.createTitleField())
          .appendField(Gamepad.createPortField(), Gamepad.PORT_FIELD_NAME)
          .appendField(Gamepad.createAnalogAxisField(), Gamepad.AXIS_FIELD_NAME);
      this.setOutput(true, 'Number');
      this.setStyle(MRC_STYLE_DRIVER_STATION);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    _: PythonGenerator,
) {
  return [methodForAxis(
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    block.getFieldValue(Gamepad.AXIS_FIELD_NAME)), Order.ATOMIC];
};

function methodForAxis(gamepad: number, axis: string): string {
  const gamepadType = Gamepad.getGamepadType(gamepad);

  // Get the axis configuration for this gamepad type
  const axisConfig = GamepadTypeUtils.getAxisConfig(gamepadType);

  return Gamepad.getPythonForGamepad(gamepad) + '.' +
      (axisConfig?.get(axis)?.method ?? '') + '()';
}
