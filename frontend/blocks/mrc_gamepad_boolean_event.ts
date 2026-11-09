// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A block for interfacing with the gamepad events
 * @author alan@porpoiseful.com (Alan Smith)
 */

/* NOTE: This will likely go away when we can parse the gamepad class
 * but it doesn't exist yet, so this is a placeholder.
 */

import * as Blockly from 'blockly/core';
import { PythonGenerator } from 'blockly/python';
import { MRC_STYLE_EVENT_HANDLER, MRC_STYLE_EVENTS } from '../themes/styles';
import * as Gamepad from '../fields/field_gamepads';

export const BLOCK_NAME = 'mrc_gamepad_boolean_event';

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function () {
      this.appendDummyInput()
        .appendField(Gamepad.createEventField(), Gamepad.EVENT_FIELD_NAME);
      this.appendDummyInput()
        .appendField(Gamepad.createTitleField())
        .appendField(Gamepad.createPortField(), Gamepad.PORT_FIELD_NAME)
        .appendField(Gamepad.createButtonField(), Gamepad.BUTTON_FIELD_NAME)
      this.setOutput(false);
      this.setStyle(MRC_STYLE_EVENT_HANDLER);
      this.appendStatementInput('STACK').appendField('');
      this.setPreviousStatement(false);
      this.setNextStatement(false);

      this.setStyle(MRC_STYLE_EVENTS);
    },
  };
};

export const pythonFromBlock = function (
  block: Blockly.Block,
  _: PythonGenerator,
) {
  // TODO: Update this when the actual driver station display class is implemented
  return '# ' + block.getFieldValue(Gamepad.EVENT_FIELD_NAME) + ' for button '
    + block.getFieldValue(Gamepad.BUTTON_FIELD_NAME) + ' on gamepad '
    + block.getFieldValue(Gamepad.PORT_FIELD_NAME) + '\n';
};
