// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@randomsmiths.com (Alan Smith)
 * 
 * This is based on the noncopyable block implementation so heavily that I 
 * kept the license header from the original noncopyable block.
 */

import * as Blockly from 'blockly';

const DISABLE_CONTEXT_MENU_ID = 'blockDisable';

export const NONDISABLEABLE_BLOCK = {
  customContextMenu: function(
      this: Blockly.BlockSvg,
      options: Array<Blockly.ContextMenuRegistry.ContextMenuOption | Blockly.ContextMenuRegistry.LegacyContextMenuOption>): void {
    // We don't allow disabling. If the block was disabled before this was
    // enforced, keep the option so it can be enabled again.
    if (this.hasDisabledReason(Blockly.constants.MANUALLY_DISABLED)) {
      return;
    }
    const index = options.findIndex(
        option => 'id' in option && option.id === DISABLE_CONTEXT_MENU_ID);
    if (index !== -1) {
      options.splice(index, 1);
    }
  },
}
