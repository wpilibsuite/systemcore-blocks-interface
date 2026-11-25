// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Support for blocks that used events, which are no longer supported.
 */

import * as Blockly from 'blockly';

/**
 * The reason that blocks that used events are disabled. Blockly's context menu only enables and
 * disables blocks with Blockly.constants.MANUALLY_DISABLED, so the user can't enable these blocks.
 */
const DISABLED_REASON_EVENTS_REMOVED = 'EVENTS_REMOVED';

/**
 * Disables the given block, which uses events, so that it doesn't generate any code.
 */
export function disableBlockBecauseEventsWereRemoved(block: Blockly.Block): void {
  if (block.hasDisabledReason(DISABLED_REASON_EVENTS_REMOVED)) {
    return;
  }
  // Don't fire a change event, since this isn't something the user did.
  Blockly.Events.disable();
  try {
    block.setDisabledReason(true, DISABLED_REASON_EVENTS_REMOVED);
  } finally {
    Blockly.Events.enable();
  }
}
