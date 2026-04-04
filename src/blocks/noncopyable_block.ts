/**
 * @license
 * Copyright 2025 Google LLC
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
