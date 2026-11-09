// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly';

export const NONCOPYABLE_BLOCK = {
  isCopyable: function(this: Blockly.BlockSvg): boolean {
    // We don't allow copying, but we return true here so that toCopyData will
    // be called. The default in blockly is that a block is only copyable if it
    // is both deletable and movable.
    return true;
  },
  toCopyData: function(this: Blockly.BlockSvg, _addNextBlocks = false): Blockly.clipboard.BlockCopyData | null {
    // We don't allow copying, but we return null here so the previous contents
    // of the clipboard is cleared.
    return null;
  },
}
