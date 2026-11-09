// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Block for a comment.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { PythonGenerator } from 'blockly/python';
import { MRC_STYLE_COMMENTS } from '../themes/styles';

export const BLOCK_NAME = 'mrc_misc_comment';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput(''), 'COMMENT');
      this.getField('COMMENT').maxDisplayLength = 140;
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle(MRC_STYLE_COMMENTS);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    _: PythonGenerator,
) {
  return '# ' + block.getFieldValue('COMMENT') + '\n';
};
