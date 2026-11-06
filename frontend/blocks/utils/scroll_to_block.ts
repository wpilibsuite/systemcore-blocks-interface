// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Scrolls a workspace to show a block, used by toolbox buttons
 * for blocks that are already on the workspace.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';

/**
 * Closes the flyout, scrolls the workspace so the given block is centered, and selects the block.
 */
export function scrollToBlock(workspace: Blockly.WorkspaceSvg, block: Blockly.Block): void {
  // Close the flyout so it doesn't cover the block.
  workspace.getToolbox()?.clearSelection();
  workspace.centerOnBlock(block.id);
  Blockly.common.setSelected(block as Blockly.BlockSvg);
}
