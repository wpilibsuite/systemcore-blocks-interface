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
 * @fileoverview This is a block that allows your code to jump to a specific step.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import {Order} from 'blockly/python';

import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {createFieldNonEditableText} from '../fields/FieldNonEditableText';
import {MRC_STYLE_VARIABLES} from '../themes/styles';

export const BLOCK_NAME = 'mrc_jump_to_step';

const FIELD_STEP_NAME = 'STEP_NAME';

type JumpToStepBlock = Blockly.Block & Blockly.BlockSvg & JumpToStepMixin;

interface JumpToStepMixin extends JumpToStepMixinType {
}

type JumpToStepMixinType = typeof JUMP_TO_STEP_BLOCK;

const JUMP_TO_STEP_BLOCK = {
  /**
   * Block initialization.
   */
  init: function(this: JumpToStepBlock): void {
    this.appendDummyInput()
        .appendField('Jump to')
        .appendField(createFieldNonEditableText(''), FIELD_STEP_NAME);
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setStyle(MRC_STYLE_VARIABLES);
    this.setTooltip('Jump to the specified step.');          
  },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = JUMP_TO_STEP_BLOCK;
};

export const pythonFromBlock = function(
    block: JumpToStepBlock,
    _generator: ExtendedPythonGenerator,
) {
  // TODO (Alan) : Specify the type here as well
  const code = '# TODO: Jump to step ' + block.getFieldValue(FIELD_STEP_NAME) + '\n';

  return [code, Order.ATOMIC];
};
