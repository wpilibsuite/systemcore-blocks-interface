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
