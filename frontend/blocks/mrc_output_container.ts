// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Mutator for showing or hiding the output of a block.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';

export const OUTPUT_CONTAINER_BLOCK_NAME = 'mrc_output_container';

export const setup = function () {
  Blockly.Blocks[OUTPUT_CONTAINER_BLOCK_NAME] = OUTPUT_CONTAINER;
};

// The output container block.

const FIELD_SHOW_OUTPUT = 'SHOW_OUTPUT';

export type OutputContainerBlock = OutputContainerMixin & Blockly.BlockSvg;
interface OutputContainerMixin extends OutputContainerMixinType { }
type OutputContainerMixinType = typeof OUTPUT_CONTAINER;

const OUTPUT_CONTAINER = {
  init: function (this: OutputContainerBlock) {
    this.appendDummyInput()
      .appendField(Blockly.Msg.SHOW_OUTPUT)
      .appendField(new Blockly.FieldCheckbox('TRUE'), FIELD_SHOW_OUTPUT);
    this.setStyle(MRC_STYLE_FUNCTIONS);
    this.setTooltip(Blockly.Msg.SHOW_OUTPUT_TOOLTIP);
    this.contextMenu = false;
  },
  getShowOutput: function (this: OutputContainerBlock): boolean {
    return this.getFieldValue(FIELD_SHOW_OUTPUT) === 'TRUE';
  },
};

/**
 * Returns the MutatorIcon for the given block.
 */
export function getMutatorIcon(block: Blockly.BlockSvg): Blockly.icons.MutatorIcon {
  // The mutator's flyout is empty because the container block holds the checkbox
  // that shows or hides the output.
  return new Blockly.icons.MutatorIcon([], block);
}

export function createMutatorBlocks(
    workspace: Blockly.Workspace, showOutput: boolean): OutputContainerBlock {
  const containerBlock = workspace.newBlock(OUTPUT_CONTAINER_BLOCK_NAME) as OutputContainerBlock;
  containerBlock.initSvg();
  containerBlock.setFieldValue(showOutput ? 'TRUE' : 'FALSE', FIELD_SHOW_OUTPUT);
  return containerBlock;
}
