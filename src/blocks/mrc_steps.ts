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
import {Order} from 'blockly/python';

import { MRC_STYLE_STEPS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createStepFieldFlydown } from '../fields/field_flydown';
import * as stepContainer from './mrc_step_container'

export const BLOCK_NAME = 'mrc_steps';
// const MUTATOR_BLOCK_NAME = 'steps_mutatorarg';


export type StepsBlock = Blockly.Block & StepsMixin & Blockly.BlockSvg;
interface StepsMixin extends StepsMixinType {
    mrcStepNames: string[];
}
type StepsMixinType = typeof STEPS;

const STEPS = {
    /**
     * Block initialization.
     */
    init: function (this: StepsBlock): void {
        this.mrcStepNames = ["0"];
        this.appendDummyInput()
            .appendField(Blockly.Msg.STEPS);
        this.setInputsInline(false);
        this.setStyle(MRC_STYLE_STEPS);
        this.setMutator(stepContainer.getMutatorIcon(this));
        this.updateShape_();
    },
    compose: function (this: StepsBlock, containerBlock: Blockly.Block) {
        if (containerBlock.type !== stepContainer.STEP_CONTAINER_BLOCK_NAME) {
            throw new Error('compose: containerBlock.type should be ' + stepContainer.STEP_CONTAINER_BLOCK_NAME);
        }
        const stepContainerBlock = containerBlock as stepContainer.StepContainerBlock;
        const stepItemBlocks: stepContainer.StepItemBlock[] = stepContainerBlock.getStepItemBlocks();
        stepItemBlocks.forEach((stepItemBlock) => {
        });
        this.mrcStepNames = [];
        stepItemBlocks.forEach((stepItemBlock) => {
            this.mrcStepNames.push(stepItemBlock.getName());
        });
        // TODO: Update any jump blocks to have the correct name
        this.updateShape_();
    },
    decompose: function (this: StepsBlock, workspace: Blockly.Workspace) {
        const stepNames: string[] = [];
        this.mrcStepNames.forEach(step => {
            stepNames.push(step);
        });
        return stepContainer.createMutatorBlocks(workspace, stepNames);
    },
      /**
       * mrcOnMutatorOpen is called when the mutator on an EventBlock is opened.
       */
    mrcOnMutatorOpen: function(this: StepsBlock): void {
        stepContainer.onMutatorOpen(this);
    },
    mrcOnChange: function(this: StepsBlock): void {
        
    },
    updateShape_: function (this: StepsBlock): void {
        // some way of knowing what was there before and what is there now
        let success = true;
        let i = 0;
        while (success){    
            success = this.removeInput('CONDITION_' + i, true);
            success = this.removeInput('STEP_' + i, true);
            i++;
        }
        for (let j = 0; j < this.mrcStepNames.length; j++) {
            this.appendValueInput('CONDITION_' + j)
                .appendField(createStepFieldFlydown(this.mrcStepNames[j], true))
                .setCheck('Boolean')
                .appendField(Blockly.Msg.REPEAT_UNTIL);    
            this.appendStatementInput('STEP_' + j);
        }
    },
};

export const setup = function () {
    Blockly.Blocks[BLOCK_NAME] = STEPS;
};

export const pythonFromBlock = function (
    block: StepsBlock,
    generator: ExtendedPythonGenerator,
) {

    let code = 'def initialize_steps(self):\n';
    code += generator.INDENT + 'self.step_from_name = {}\n';
    code += generator.INDENT + 'self.name_from_step = {}\n';
    block.mrcStepNames.forEach((stepName, index) => {
        code += generator.INDENT + `self.step_from_name['${stepName}'] = ${index}\n`;
        code += generator.INDENT + `self.name_from_step[${index}] = '${stepName}'\n`;
    });
    
    code += generator.INDENT + 'self.current_step_index = 0\n';
    code += generator.INDENT + 'self.initialized = True\n';

    generator.addClassMethodDefinition('initialize_steps', code);

    code = 'def steps(self):\n';
    code += generator.INDENT + 'if not self.initialized:\n';
    code += generator.INDENT.repeat(2) + 'self.initialize_steps()\n\n';
    code += generator.INDENT + 'match self.current_step_index:\n';
    block.mrcStepNames.forEach((stepName, index) => {
        code += generator.INDENT.repeat(2) + `case ${index}:   # ${stepName}\n`;
        let stepCode = generator.statementToCode(block, 'STEP_' + index);
        if (stepCode !== '') {
            code += generator.prefixLines(stepCode, generator.INDENT.repeat(2));
        }
        let conditionCode = generator.valueToCode(block, 'CONDITION_' + index, Order.NONE) || 'False';
        code += generator.INDENT.repeat(3) + 'if ' + conditionCode + ':\n';
        code += generator.INDENT.repeat(4) + 'self.current_step_index += 1\n';
    });

    generator.addClassMethodDefinition('steps', code);
    
    return ''
}