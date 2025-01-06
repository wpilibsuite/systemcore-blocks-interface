/**
 * @license
 * Copyright 2024 Google LLC
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

import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import * as ToolboxItems from "../toolbox/items";


// Tests

let blocklyWorkspaceForTest: Blockly.Workspace = null;
let indexForTest = 0
let jsonBlocksForTest: ToolboxItems.Block[] = [];

export function testAllBlocksInToolbox(contents: ToolboxItems.Item[]) {
  if (blocklyWorkspaceForTest !== null) {
    // Tests are already running.
    return;
  }
  blocklyWorkspaceForTest = new Blockly.Workspace();
  blocklyWorkspaceForTest.MAX_UNDO = 0
  indexForTest = 0;

  alert('Press OK to run tests on all blocks from the toolbox.');

  jsonBlocksForTest = [];
  collectBlocks(contents);
  console.log('Collected  ' + jsonBlocksForTest.length + ' blocks');

  setTimeout(testCallback, 0);
}

function collectBlocks(contents: ToolboxItems.Item[]): void {
  for (const item of contents) {
    switch (item.kind) {
      default:
        console.log("Error - item.kind is " + item.kind + ". It must be block, category, or sep.");
        break;
      case "block":
        const block = item as ToolboxItems.Block;
        jsonBlocksForTest.push(block);
        break;
      case "category":
        const category = item as ToolboxItems.Category;
        if (category.contents) {
          collectBlocks(category.contents);
        }
        break;
      case "sep":
        break;
    }
  }
}

function testCallback(): void {
  console.log((new Date()).toLocaleTimeString() + " - " + indexForTest);
  for (let i = 0; i < 1000; i++) {
    if (indexForTest >= jsonBlocksForTest.length) {
      break;
    }
    testBlock(jsonBlocksForTest[indexForTest]);
    indexForTest++;
  }
  blocklyWorkspaceForTest.clear();

  if (indexForTest < jsonBlocksForTest.length) {
    setTimeout(testCallback, 0);
  } else {
    console.log((new Date()).toLocaleTimeString() + " - " + indexForTest);
    jsonBlocksForTest = [];
    blocklyWorkspaceForTest = null;
    indexForTest = 0
    alert('Completed tests on all blocks in the toolbox.');
  }
};

function testBlock(jsonBlock: ToolboxItems.Block) {
  const block = Blockly.serialization.blocks.append(jsonBlock, blocklyWorkspaceForTest);
  testBlockPython(block);
}

function testBlockPython(block: Blockly.Block) {
  pythonGenerator.init(blocklyWorkspaceForTest);
  let code = null;
  try {
    code = pythonGenerator.blockToCode(block);
  } catch (e) {
    console.log("Error - " + e + " - Unable to test block..."); console.log(block);
  }
  if (block.outputConnection) {
    if (!Array.isArray(code)) {
      console.log("Error - pythonGenerator.forBlock['" + block.type + "'] " +
                  "is generating a " + (typeof code) + ", but should generate an array");
    }
  } else {
    if (typeof code != "string") {
      console.log("Error - pythonGenerator.forBlock['" + block.type + "'] " +
                  "is generating a " + (typeof code) + ", but should generate an string");
    }
  }
}
