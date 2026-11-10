// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview This is a block that returns a value from a method.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';
import { BLOCK_NAME as MRC_CLASS_METHOD_DEF, INPUT_RETURN, INPUT_STACK } from './mrc_class_method_def';
import { findConnectedBlocksOfType } from './utils/find_connected_blocks';
import { getValueType } from './utils/variable_types';

export const BLOCK_NAME = 'mrc_return';

const INPUT_VALUE = 'VALUE';

const WARNING_ID_NOT_IN_METHOD = 'MRC_RETURN_NOT_IN_METHOD';
const WARNING_ID_DIFFERENT_TYPES = 'MRC_RETURN_DIFFERENT_TYPES';

const RETURN_BLOCK = {
  /**
   * Block initialization.
   */
  init: function (this: Blockly.Block): void {
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.appendValueInput(INPUT_VALUE)
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    this.setPreviousStatement(true, null);
    this.setNextStatement(false);
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = RETURN_BLOCK;
};

export const pythonFromBlock = function (
  block: Blockly.Block,
  generator: ExtendedPythonGenerator,
) {
  const value = generator.valueToCode(block, INPUT_VALUE, Order.NONE) || 'None';
  return 'return ' + value + '\n';
};

/**
 * Returns true if the given block is a method definition that returns a value.
 */
function isMethodWithReturn(block: Blockly.Block): boolean {
  return block.type === MRC_CLASS_METHOD_DEF && block.getInput(INPUT_RETURN) !== null;
}

/**
 * Puts a warning on each return block that isn't in a method that returns a value. For each
 * method, if the values returned (by its return blocks and by the return input of the method
 * block) have different types, puts a warning on each of the blocks that returns a value with a
 * type. Values that don't have a type are ignored, since they might be of any type.
 */
export function updateReturnWarnings(workspace: Blockly.Workspace): void {
  if (workspace.isFlyout) {
    return;
  }
  const differentTypesWarnings = new Map<Blockly.Block, string>();
  const methodBlocks = workspace.getBlocksByType(MRC_CLASS_METHOD_DEF, false);
  for (const methodBlock of methodBlocks) {
    // Each block that returns a value, with the input that holds the value.
    const returningBlocks: [Blockly.Block, string][] = [];
    if (isMethodWithReturn(methodBlock)) {
      returningBlocks.push([methodBlock, INPUT_RETURN]);
    }
    const stackBlock = methodBlock.getInputTargetBlock(INPUT_STACK);
    if (stackBlock) {
      findConnectedBlocksOfType(stackBlock, BLOCK_NAME).forEach(returnBlock => {
        returningBlocks.push([returnBlock, INPUT_VALUE]);
      });
    }

    const typedBlocks: Blockly.Block[] = [];
    const types = new Set<string>();
    returningBlocks.forEach(([block, inputName]) => {
      const valueBlock = block.getInputTargetBlock(inputName);
      const type = valueBlock ? getValueType(valueBlock) : '';
      if (type) {
        typedBlocks.push(block);
        types.add(type);
      }
    });
    if (types.size > 1) {
      const warning = Blockly.Msg.WARNING_RETURN_DIFFERENT_TYPES
          .replace('{{types}}', [...types].join(', '));
      typedBlocks.forEach(block => differentTypesWarnings.set(block, warning));
    }
  }

  for (const methodBlock of methodBlocks) {
    methodBlock.setWarningText(
        differentTypesWarnings.get(methodBlock) ?? null, WARNING_ID_DIFFERENT_TYPES);
  }
  for (const block of workspace.getBlocksByType(BLOCK_NAME, false)) {
    block.setWarningText(
        isMethodWithReturn(block.getRootBlock())
            ? null : Blockly.Msg.RETURN_CAN_ONLY_GO_IN_METHOD_WITH_RETURN,
        WARNING_ID_NOT_IN_METHOD);
    block.setWarningText(
        differentTypesWarnings.get(block) ?? null, WARNING_ID_DIFFERENT_TYPES);
  }
}
