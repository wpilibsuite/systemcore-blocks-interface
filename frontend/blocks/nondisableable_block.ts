/**
 * @license
 * Copyright 2026 Google LLC
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
 * @author alan@randomsmiths.com (Alan Smith)
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
