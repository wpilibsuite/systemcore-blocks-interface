// Copyright (c) FIRST and other WPILib contributors.

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
          .appendField(Gamepad.createPortField(Gamepad.GamepadOutput.LEDS), Gamepad.PORT_FIELD_NAME)
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
  return methodForLeds(
    generator,
    block.getFieldValue(Gamepad.PORT_FIELD_NAME),
    colorCode);
}

function methodForLeds(
    generator: ExtendedPythonGenerator, gamepad: number, colorCode: string): string {
  // set_leds takes red, green, and blue values from 0 to 255, but a wpiutil.Color has values
  // from 0 to 1. The conversion is done in a helper function so that the color expression is
  // only evaluated once.
  const functionName = generator.provideFunction_('set_gamepad_leds', [
    'def ' + generator.FUNCTION_NAME_PLACEHOLDER_ + '(gamepad, color):',
    generator.INDENT + 'gamepad.set_leds(int(color.red * 255), int(color.green * 255), int(color.blue * 255))',
  ]);
  return functionName + '(' + Gamepad.getPythonForGamepad(gamepad) + ', ' + colorCode + ')\n';
}
