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
 * @fileoverview Blocks for class method definition
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';

export const BLOCK_NAME = 'mrc_steps';
const MUTATOR_BLOCK_NAME = 'steps_mutatorarg';


export type StepsBlock = Blockly.Block & StepsMixin & Blockly.BlockSvg;
interface StepsMixin extends StepsMixinType {
}
type StepsMixinType = typeof STEPS;

const STEPS = {
    /**
     * Block initialization.
     */
    init: function (this: StepsBlock): void {
        this.appendDummyInput()
            .appendField(createFieldNonEditableText('steps'));
        this.appendDummyInput()
            .appendField('Step')
            .appendField(new Blockly.FieldTextInput('0'));
        this.appendStatementInput('STEP_0');
        this.appendValueInput('CONDITION_0')
            .setCheck('Boolean')
            .appendField('Advance when');
        this.appendDummyInput()
            .appendField('Step')
            .appendField(new Blockly.FieldTextInput('1'));
        this.appendStatementInput('STEP_1');
        this.appendValueInput('CONDITION_1')
            .setCheck('Boolean')
            .appendField('Finish when');
        this.setInputsInline(false);
        this.setStyle(MRC_STYLE_FUNCTIONS);
        this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
        
  }
};

export const setup = function () {
    Blockly.Blocks[BLOCK_NAME] = STEPS;
};

export const pythonFromBlock = function (
    _block: StepsBlock,
    _generator: ExtendedPythonGenerator,
) {
    return 'def steps(self):\n    pass'
}