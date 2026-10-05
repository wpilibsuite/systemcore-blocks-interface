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
 * @fileoverview A block dragger that lets blocks be dragged onto another tab,
 * which cuts them out of the current workspace and hands them to the tab.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';

/** Handles blocks being dropped on a tab other than the active tab. */
export interface TabDropHandler {
  /** Called when blocks have been cut from the active tab by dropping them on another tab. */
  onBlocksDropped: (tabKey: string, copyData: Blockly.clipboard.BlockCopyData) => void;
  /** Called when blocks that can't be moved to another tab were dropped on one. */
  onBlocksNotAllowed: (reason: string) => void;
}

/** CSS class added to a tab while blocks that can be moved to it are being dragged over it. */
export const DROP_TARGET_TAB_CLASS = 'mrc-tab-drop-target';

/** CSS class added to a tab while blocks that can't be moved to it are being dragged over it. */
export const DROP_NOT_ALLOWED_TAB_CLASS = 'mrc-tab-drop-not-allowed';

const TAB_SELECTOR = '.tabs-row .ant-tabs-tab[data-node-key]';
const ACTIVE_TAB_CLASS = 'ant-tabs-tab-active';

const MRC_GET_REASON_CANNOT_MOVE_TO_OTHER_MODULE = 'mrcGetReasonCannotMoveToOtherModule';

let tabDropHandler: TabDropHandler | null = null;

/** Sets the handler for blocks dropped on a tab, or null to stop allowing it. */
export function setTabDropHandler(handler: TabDropHandler | null): void {
  tabDropHandler = handler;
}

/**
 * Returns why the given block can't be moved to another module, or null if it
 * can be. A block can decide this with an mrcGetReasonCannotMoveToOtherModule
 * method; otherwise only blocks that can be copied can be moved.
 */
function getReasonCannotMoveBlockToOtherModule(block: Blockly.BlockSvg): string | null {
  if (MRC_GET_REASON_CANNOT_MOVE_TO_OTHER_MODULE in block &&
      typeof block[MRC_GET_REASON_CANNOT_MOVE_TO_OTHER_MODULE] === 'function') {
    return block[MRC_GET_REASON_CANNOT_MOVE_TO_OTHER_MODULE]();
  }
  return block.toCopyData() === null ? Blockly.Msg.CANNOT_MOVE_BLOCKS_TO_OTHER_TAB : null;
}

/** Returns the inactive tab under the pointer, if there is one. */
function getInactiveTabAt(e?: PointerEvent | KeyboardEvent): HTMLElement | null {
  if (!(e instanceof PointerEvent)) {
    return null;
  }
  // elementsFromPoint only returns elements that are actually visible at the
  // point, so tabs scrolled out of the tab bar are skipped.
  for (const element of document.elementsFromPoint(e.clientX, e.clientY)) {
    const tab = element.closest<HTMLElement>(TAB_SELECTOR);
    if (tab) {
      return tab.classList.contains(ACTIVE_TAB_CLASS) ? null : tab;
    }
  }
  return null;
}

export class TabDropDragger extends Blockly.dragging.Dragger {
  // Why the blocks being dragged can't be moved to another tab; null if they
  // can be, or undefined if that hasn't been determined yet.
  private reasonCannotMoveToTab: string | null | undefined = undefined;
  private dropTargetTab: HTMLElement | null = null;

  override onDrag(e: PointerEvent | KeyboardEvent | undefined, totalDelta: Blockly.utils.Coordinate): void {
    super.onDrag(e, totalDelta);
    this.setDropTargetTab(this.getTabAt(e));
  }

  override onDragEnd(e?: PointerEvent | KeyboardEvent): void {
    const tabKey = this.getTabAt(e)?.dataset.nodeKey;
    this.setDropTargetTab(null);
    const handler = tabDropHandler;
    if (!tabKey || !handler || !(this.draggable instanceof Blockly.BlockSvg)) {
      super.onDragEnd(e);
      return;
    }

    const block = this.draggable;
    const reasonCannotMove = this.getReasonCannotMoveToOtherTab();
    if (reasonCannotMove !== null) {
      // Revert the drag, instead of leaving the blocks where they were dropped,
      // which is outside the visible part of the workspace. Like onDragRevert,
      // blocks that were dragged out of the flyout are deleted.
      if (this.revertShouldDelete) {
        const group = Blockly.Events.getGroup();
        block.endDrag(e, Blockly.DragDisposition.DELETE);
        Blockly.Events.setGroup(group);
        block.dispose();
      } else {
        block.revertDrag();
        block.endDrag(e, Blockly.DragDisposition.REVERT);
        Blockly.getFocusManager().focusNode(block);
      }
      Blockly.Events.setGroup(false);
      handler.onBlocksNotAllowed(reasonCannotMove);
      return;
    }

    const copyData: Blockly.clipboard.BlockCopyData = {
      paster: Blockly.clipboard.BlockPaster.TYPE,
      blockState: Blockly.serialization.blocks.save(block, {addNextBlocks: true})!,
      typeCounts: Blockly.common.getBlockTypeCounts(block),
    };

    // Remove the blocks from this workspace the same way dropping them on the
    // trashcan does.
    const group = Blockly.Events.getGroup();
    block.endDrag(e, Blockly.DragDisposition.DELETE);
    Blockly.Events.setGroup(group);
    block.dispose();
    Blockly.Events.setGroup(false);

    // Let the drag gesture finish before the tab is changed.
    setTimeout(() => handler.onBlocksDropped(tabKey, copyData));
  }

  /**
   * Returns the inactive tab under the pointer, if blocks are being dragged in a
   * workspace where they could be dropped on a tab.
   */
  private getTabAt(e?: PointerEvent | KeyboardEvent): HTMLElement | null {
    const draggable = this.draggable;
    if (tabDropHandler === null ||
        !(draggable instanceof Blockly.BlockSvg) ||
        draggable.workspace.isFlyout ||
        draggable.workspace.isMutator) {
      return null;
    }
    return getInactiveTabAt(e);
  }

  /**
   * Returns why the blocks being dragged can't be moved to another tab, or null
   * if they can be. They must be deletable from this workspace and each block
   * must be movable to another module.
   */
  private getReasonCannotMoveToOtherTab(): string | null {
    if (this.reasonCannotMoveToTab === undefined) {
      const draggable = this.draggable as Blockly.BlockSvg;
      if (!draggable.isDeletable()) {
        this.reasonCannotMoveToTab = Blockly.Msg.CANNOT_MOVE_BLOCKS_TO_OTHER_TAB;
      } else {
        this.reasonCannotMoveToTab = null;
        for (const block of draggable.getDescendants(false)) {
          this.reasonCannotMoveToTab = getReasonCannotMoveBlockToOtherModule(block);
          if (this.reasonCannotMoveToTab !== null) {
            break;
          }
        }
      }
    }
    return this.reasonCannotMoveToTab;
  }

  private setDropTargetTab(tab: HTMLElement | null): void {
    if (tab !== this.dropTargetTab) {
      this.dropTargetTab?.classList.remove(DROP_TARGET_TAB_CLASS, DROP_NOT_ALLOWED_TAB_CLASS);
      tab?.classList.add(
          this.getReasonCannotMoveToOtherTab() === null ?
              DROP_TARGET_TAB_CLASS : DROP_NOT_ALLOWED_TAB_CLASS);
      this.dropTargetTab = tab;
    }
  }
}

export const registrationType = Blockly.registry.Type.BLOCK_DRAGGER;
export const registrationName = 'TabDropDragger';

Blockly.registry.register(
  registrationType,
  registrationName,
  TabDropDragger,
);

export const pluginInfo = {
  [registrationType as any]: registrationName,
};
