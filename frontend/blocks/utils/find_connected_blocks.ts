// Copyright (c) FIRST and other WPILib contributors.

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