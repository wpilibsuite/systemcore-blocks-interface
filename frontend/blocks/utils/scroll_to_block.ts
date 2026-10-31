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
