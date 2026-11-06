// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Block for Python's None keyword.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { MRC_STYLE_NONE } from '../themes/styles'
import { Order, PythonGenerator } from 'blockly/python';

export const BLOCK_NAME = 'mrc_none';

export function setup() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.setOutput(true); // no type for None
      this.appendDummyInput()
          .appendField(Blockly.Msg.NONE);
      this.setStyle(MRC_STYLE_NONE);
      this.setTooltip(Blockly.Msg.NONE_TOOLTIP);
    },
  };
}

export function pythonFromBlock(
    _block: Blockly.Block,
    _generator: PythonGenerator,
): [string, Order] {
  return ['None', Order.ATOMIC];
}

export function createNoneShadowValue(): any {
  return {
    'shadow': {
      'type': 'mrc_none',
    },
  }
}

export function createNoneBlock(): any {
  return {
    'block': {
      'type': 'mrc_none',
    },
  }
}
