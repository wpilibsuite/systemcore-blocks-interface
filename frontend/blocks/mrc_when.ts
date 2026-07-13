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
 * @fileoverview Block that defines a condition that is checked every periodic tick.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_WHEN } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createBooleanShadowValue } from './utils/value';
import * as toolboxItems from '../toolbox/items';

export const BLOCK_NAME = 'mrc_when';

const WHEN_METHOD_PREFIX = 'when_';

export const INPUT_BOOL = 'BOOL';
const INPUT_DO = 'DO';

const WHEN_BLOCK = {
  /**
   * Block initialization.
   */
  init: function (this: Blockly.Block): void {
    this.appendValueInput(INPUT_BOOL)
        .setCheck('Boolean')
        .appendField(Blockly.Msg.WHEN);
    this.appendStatementInput(INPUT_DO);
    this.setInputsInline(false);
    this.setStyle(MRC_STYLE_WHEN);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = WHEN_BLOCK;
};

export const pythonFromBlock = function (
  block: Blockly.Block,
  generator: ExtendedPythonGenerator,
) {
  // Name the method after the position of this block among all mrc_when blocks in the
  // workspace, in top-to-bottom order.
  const whenBlocks = block.workspace.getBlocksByType(BLOCK_NAME, true);
  const index = whenBlocks.indexOf(block) + 1;
  const methodName = WHEN_METHOD_PREFIX + index;

  const condition = generator.valueToCode(block, INPUT_BOOL, Order.NONE) || 'False';
  const branch = generator.statementToCode(block, INPUT_DO) || generator.PASS;

  let code = `def ${methodName}(self):\n`;
  code += generator.INDENT + `if ${condition}:\n`;
  code += generator.prefixLines(branch, generator.INDENT);

  generator.addClassMethodDefinition(methodName, code);
  generator.addWhenMethodName(methodName);

  return '';
};

export function createWhenBlock(): toolboxItems.Block {
  const inputs: {[key: string]: any} = {};
  inputs[INPUT_BOOL] = createBooleanShadowValue(true);
  return new toolboxItems.Block(BLOCK_NAME, null, null, inputs);
}
