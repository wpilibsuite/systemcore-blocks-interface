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
 * @fileoverview This is a block that allows your code to use a parameter
 * that is passed to a method.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import {Order} from 'blockly/python';

import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {createFieldNonEditableText} from '../fields/FieldNonEditableText';
import {MRC_STYLE_VARIABLES} from '../themes/styles';

export const BLOCK_NAME = 'mrc_advance_to_step';

const FIELD_STEP_NAME = 'STEP_NAME';

type AdvanceToStepBlock = Blockly.Block & Blockly.BlockSvg & AdvanceToStepMixin;

interface AdvanceToStepMixin extends AdvanceToStepMixinType {
}

type AdvanceToStepMixinType = typeof ADVANCE_TO_STEP_BLOCK;

const ADVANCE_TO_STEP_BLOCK = {
  /**
   * Block initialization.
   */
  init: function(this: AdvanceToStepBlock): void {
    this.appendDummyInput()
        .appendField('Advance to step')
        .appendField(createFieldNonEditableText(''), FIELD_STEP_NAME);
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setStyle(MRC_STYLE_VARIABLES);
    this.setTooltip('Advance to the specified step when the condition is true.');          
  },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = ADVANCE_TO_STEP_BLOCK;
};

export const pythonFromBlock = function(
    block: AdvanceToStepBlock,
    _generator: ExtendedPythonGenerator,
) {
  // TODO (Alan) : Specify the type here as well
  const code = '# TODO: Advance to step ' + block.getFieldValue(FIELD_STEP_NAME) + '\n';

  return [code, Order.ATOMIC];
};
