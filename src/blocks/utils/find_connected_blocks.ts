/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Allow registering for specific callbacks
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

export function findConnectedBlocksOfType(block: Blockly.Block, targetType: string): Blockly.Block[] {
  const foundBlocks: Blockly.Block[] = [];
  const visited = new Set<string>(); // Prevent infinite loops
  
  function searchRecursive(currentBlock: Blockly.Block): void {
    if (visited.has(currentBlock.id)) return;
    visited.add(currentBlock.id);
    
    // Check if current block matches target type
    if (currentBlock.type === targetType) {
      foundBlocks.push(currentBlock);
    }
    
    // Search through all inputs
    currentBlock.inputList.forEach(input => {
      if (input.connection && input.connection.isConnected()) {
        const connectedBlock = input.connection.targetBlock();
        if (connectedBlock) {
          searchRecursive(connectedBlock);
        }
      }
    });
  }
  
  searchRecursive(block);
  return foundBlocks;
}