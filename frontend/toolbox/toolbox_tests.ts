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
import { extendedPythonGenerator } from '../editor/extended_python_generator';
import * as toolboxItems from './items';
import * as storageModule from '../storage/module';
import * as workspaces from '../blocks/utils/workspaces';

// Tests

export function testAllBlocksInToolbox(toolbox : Blockly.utils.toolbox.ToolboxInfo, moduleType: storageModule.ModuleType) {
  const contents = toolbox.contents;
  alert('Press OK to run tests on all blocks from the toolbox.');
  const toolboxTestData = new ToolboxTestData(contents, moduleType, () => {
    alert('Completed tests on all blocks in the toolbox. See console for any errors.');
  });
  toolboxTestData.runTests();
}

class ToolboxTestData {
  onFinish: () => void;
  blocklyWorkspace: Blockly.Workspace;
  jsonBlocks: toolboxItems.Block[];
  index: number;

  constructor(
      contents: toolboxItems.ContentsType[] | undefined,
      moduleType: storageModule.ModuleType,
      onFinish: () => void) {
    this.onFinish = onFinish;
    this.blocklyWorkspace = workspaces.createHeadlessWorkspace(moduleType);
    this.blocklyWorkspace.MAX_UNDO = 0;
    this.jsonBlocks = [];
    if (contents){
      this.collectBlocks(contents);
    }
    this.index = 0;
  }

  private collectBlocks(contents: toolboxItems.ContentsType[]): void {
    contents.forEach((item) => {
      switch (item.kind) {
        default:
          console.log('Error - item.kind is ' + item.kind + '. It must be block, category, label, or sep.');
          break;
        case 'block':
          const block = item as toolboxItems.Block;
          this.jsonBlocks.push(block);
          break;
        case 'category':
          const category = item as toolboxItems.Category;
          if (category.contents) {
            this.collectBlocks(category.contents);
          }
          break;
        case 'sep':
        case 'label':
          break;
      }
    });
  }

  runTests(): void {
    console.log(this.jsonBlocks.length + ' blocks will be tested.');
    setTimeout(this.testCallback.bind(this), 0);
  }

  private testCallback(): void {
    console.log(
        (new Date()).toLocaleTimeString() + ' - testing blocks ' +
        this.index + ' - ' + Math.min(this.index + 999, this.jsonBlocks.length - 1) + '.');
    for (let i = 0; i < 1000; i++) {
      if (this.index >= this.jsonBlocks.length) {
        break;
      }
      this.testBlock(this.jsonBlocks[this.index]);
      this.index++;
    }
    this.blocklyWorkspace.clear();

    if (this.index < this.jsonBlocks.length) {
      setTimeout(this.testCallback.bind(this), 0);
    } else {
      workspaces.destroyHeadlessWorkspace(this.blocklyWorkspace);
      if (this.onFinish) {
        this.onFinish();
      }
    }
  }

  private testBlock(jsonBlock: toolboxItems.Block) {
    const block = Blockly.serialization.blocks.append(jsonBlock, this.blocklyWorkspace);
    this.testBlockPython(block);
  }

  private testBlockPython(block: Blockly.Block) {
    extendedPythonGenerator.init(this.blocklyWorkspace);
    let code = null;
    try {
      code = extendedPythonGenerator.blockToCode(block);
    } catch (e) {
      console.log('Error - ' + e + ' - Unable to test block...'); console.log(block);
    }
    if (block.outputConnection) {
      if (!Array.isArray(code)) {
        console.log(
            'Error - extendedPythonGenerator.forBlock["' + block.type + '"] ' +
            'generated a ' + (typeof code) +
            ', but it should generate an array because the block has an output connection.');
      }
    } else {
      if (typeof code != 'string') {
        console.log(
            'Error - extendedPythonGenerator.forBlock["' + block.type + '"] ' +
            'generated a ' + (typeof code) +
            ', but should generate a string because the block does not have an output connection.');
      }
    }
  }
}
