// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Block that defines a condition that is checked every periodic tick.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_WHEN } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createBooleanShadowValue } from './utils/value';
import * as toolboxItems from '../toolbox/items';

export const BLOCK_NAME = 'mrc_when';

const WHEN_METHOD_PREFIX = 'when_';

export const INPUT_BOOL = 'BOOL';
const INPUT_DO = 'DO';

const WHEN_BLOCK = {
  /**
   * Block initialization.
   */
  init: function (this: Blockly.Block): void {
    this.appendValueInput(INPUT_BOOL)
        .setCheck('Boolean')
        .appendField(Blockly.Msg.WHEN);
    this.appendStatementInput(INPUT_DO);
    this.setInputsInline(false);
    this.setStyle(MRC_STYLE_WHEN);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = WHEN_BLOCK;
};

export const pythonFromBlock = function (
  block: Blockly.Block,
  generator: ExtendedPythonGenerator,
) {
  // Name the method after the position of this block among all mrc_when blocks in the
  // workspace, in top-to-bottom order.
  const whenBlocks = block.workspace.getBlocksByType(BLOCK_NAME, true);
  const index = whenBlocks.indexOf(block) + 1;
  const methodName = WHEN_METHOD_PREFIX + index;

  const condition = generator.valueToCode(block, INPUT_BOOL, Order.NONE) || 'False';
  const branch = generator.statementToCode(block, INPUT_DO) || generator.PASS;

  let code = `def ${methodName}(self):\n`;
  code += generator.INDENT + `if ${condition}:\n`;
  code += generator.prefixLines(branch, generator.INDENT);

  generator.addClassMethodDefinition(methodName, code);
  generator.addWhenMethodName(methodName);

  return '';
};

export function createWhenBlock(): toolboxItems.Block {
  const inputs: {[key: string]: any} = {};
  inputs[INPUT_BOOL] = createBooleanShadowValue(true);
  return new toolboxItems.Block(BLOCK_NAME, null, null, inputs);
}
