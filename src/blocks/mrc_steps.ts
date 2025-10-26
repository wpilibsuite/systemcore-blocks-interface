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
import { Order } from 'blockly/python';

import { MRC_STYLE_STEPS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createStepFieldFlydown } from '../fields/field_flydown';
import { BLOCK_NAME as MRC_JUMP_TO_STEP } from './mrc_jump_to_step';
import * as stepContainer from './mrc_step_container'

export const BLOCK_NAME = 'mrc_steps';
// const MUTATOR_BLOCK_NAME = 'steps_mutatorarg';


/** Extra state for serialising call_python_* blocks. */
type StepsExtraState = {
    /**
     * The steps
     */
    stepNames: string[],
};

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
    saveExtraState: function (this: StepsBlock): StepsExtraState {
        return {
            stepNames: this.mrcStepNames,
        };
    },
    loadExtraState: function (this: StepsBlock, state: StepsExtraState): void {
        if (state && state.stepNames) {
            this.mrcStepNames = state.stepNames;
            this.updateShape_();
        }
    },
    compose: function (this: StepsBlock, containerBlock: Blockly.Block) {
        if (containerBlock.type !== stepContainer.STEP_CONTAINER_BLOCK_NAME) {
            throw new Error('compose: containerBlock.type should be ' + stepContainer.STEP_CONTAINER_BLOCK_NAME);
        }
        const stepContainerBlock = containerBlock as stepContainer.StepContainerBlock;
        const stepItemBlocks: stepContainer.StepItemBlock[] = stepContainerBlock.getStepItemBlocks();

        this.mrcStepNames = [];
        stepItemBlocks.forEach((stepItemBlock) => {
            this.mrcStepNames.push(stepItemBlock.getName());
        });
        
        // Update jump blocks for any renamed steps
        const workspace = this.workspace;
        const jumpBlocks = workspace.getBlocksByType(MRC_JUMP_TO_STEP, false);
        stepItemBlocks.forEach((stepItemBlock) => {
            const oldName = stepItemBlock.getOriginalName();
            const newName = stepItemBlock.getName();
            if (oldName && oldName !== newName) {
                jumpBlocks.forEach((jumpBlock) => {
                    if (jumpBlock.getFieldValue('STEP_NAME') === oldName) {
                        jumpBlock.setFieldValue(newName, 'STEP_NAME');
                    }
                });
            }
        });
        
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
    mrcOnMutatorOpen: function (this: StepsBlock): void {
        stepContainer.onMutatorOpen(this);
    },
    mrcOnChange: function (this: StepsBlock): void {

    },
    mrcUpdateStepName: function (this: StepsBlock, step: number, newName: string): string {
        const oldName = this.mrcStepNames[step];
        const otherNames = this.mrcStepNames.filter((_name, index) => index !== step);
        let currentName = newName;

        // Make name unique if it conflicts
        while (otherNames.includes(currentName)) {
            // Check if currentName ends with a number
            const match = currentName.match(/^(.*?)(\d+)$/);
            if (match) {
                // If it ends with a number, increment it
                const baseName = match[1];
                const number = parseInt(match[2], 10);
                currentName = baseName + (number + 1);
            } else {
                // If it doesn't end with a number, append 2
                currentName = currentName + '2';
            }
        }
        this.mrcStepNames[step] = currentName;
        
        // Update all mrc_jump_to_step blocks that reference the old name
        if (oldName !== currentName) {
            const workspace = this.workspace;
            const jumpBlocks = workspace.getBlocksByType(MRC_JUMP_TO_STEP, false);
            jumpBlocks.forEach((jumpBlock) => {
                if (jumpBlock.getFieldValue('STEP_NAME') === oldName) {
                    jumpBlock.setFieldValue(currentName, 'STEP_NAME');
                }
            });
        }

        return currentName;
    },
    updateShape_: function (this: StepsBlock): void {
        // Build a map of step names to their current input indices
        const currentStepMap: { [stepName: string]: number } = {};
        let i = 0;
        while (this.getInput('CONDITION_' + i)) {
            const conditionInput = this.getInput('CONDITION_' + i);
            const field = conditionInput?.fieldRow[0];
            if (field) {
                currentStepMap[field.getValue()] = i;
            }
            i++;
        }

        // For each new step position, find where it currently is (if it exists)
        for (let j = 0; j < this.mrcStepNames.length; j++) {
            const stepName = this.mrcStepNames[j];
            const currentIndex = currentStepMap[stepName];
            
            if (currentIndex !== undefined && currentIndex !== j) {
                // Step exists but is at wrong position - move it
                const conditionConnection = this.getInput('CONDITION_' + currentIndex)?.connection?.targetConnection;
                const stepConnection = this.getInput('STEP_' + currentIndex)?.connection?.targetConnection;
                
                // Temporarily disconnect
                if (conditionConnection) conditionConnection.disconnect();
                if (stepConnection) stepConnection.disconnect();
                
                // Remove old inputs
                this.removeInput('CONDITION_' + currentIndex, false);
                this.removeInput('STEP_' + currentIndex, false);
                
                // Create new inputs at correct position
                const fieldFlydown = createStepFieldFlydown(stepName, true);
                fieldFlydown.setValidator(this.mrcUpdateStepName.bind(this, j));
                
                this.appendValueInput('CONDITION_' + j)
                    .appendField(fieldFlydown)
                    .setCheck('Boolean')
                    .appendField(Blockly.Msg.REPEAT_UNTIL);
                this.appendStatementInput('STEP_' + j);
                
                // Reconnect
                if (conditionConnection) {
                    this.getInput('CONDITION_' + j)?.connection?.connect(conditionConnection);
                }
                if (stepConnection) {
                    this.getInput('STEP_' + j)?.connection?.connect(stepConnection);
                }
                
                delete currentStepMap[stepName];
            } else if (currentIndex !== undefined) {
                // Step is at correct position - just update the field
                const conditionInput = this.getInput('CONDITION_' + j);
                const field = conditionInput?.fieldRow[0];
                if (field && field.getValue() !== stepName) {
                    field.setValue(stepName);
                }
                delete currentStepMap[stepName];
            } else {
                // Step doesn't exist - create it
                const fieldFlydown = createStepFieldFlydown(stepName, true);
                fieldFlydown.setValidator(this.mrcUpdateStepName.bind(this, j));
                
                this.appendValueInput('CONDITION_' + j)
                    .appendField(fieldFlydown)
                    .setCheck('Boolean')
                    .appendField(Blockly.Msg.REPEAT_UNTIL);
                this.appendStatementInput('STEP_' + j);
            }
        }

        // Remove any leftover inputs (steps that were deleted)
        for (const stepName in currentStepMap) {
            const index = currentStepMap[stepName];
            this.removeInput('CONDITION_' + index, false);
            this.removeInput('STEP_' + index, false);
        }
    },
    mrcGetStepNames: function (this: StepsBlock): string[] {
        return this.mrcStepNames;
    }
};

export const setup = function () {
    Blockly.Blocks[BLOCK_NAME] = STEPS;
};

export function isStepsInWorkspace(workspace: Blockly.Workspace): boolean {
    const blocks = workspace.getBlocksByType(BLOCK_NAME);
    return blocks.length > 0;
};

export const pythonFromBlock = function (
    block: StepsBlock,
    generator: ExtendedPythonGenerator,
) {
    let code = 'def steps(self):\n';
    code += generator.INDENT + 'if not self._initialized_steps:\n';
    code += generator.INDENT.repeat(2) + 'self._current_step = "' + block.mrcStepNames[0] + '"\n';
    code += generator.INDENT.repeat(2) + 'self.initialized_steps = True\n\n';
    code += generator.INDENT + 'if self._current_step == None:\n';
    code += generator.INDENT.repeat(2) + 'return\n';


    code += generator.INDENT + 'match self._current_step:\n';
    block.mrcStepNames.forEach((stepName, index) => {
        code += generator.INDENT.repeat(2) + `case "${stepName}":\n`;
        let stepCode = generator.statementToCode(block, 'STEP_' + index);
        if (stepCode !== '') {
            code += generator.prefixLines(stepCode, generator.INDENT.repeat(2));
        }
        let conditionCode = generator.valueToCode(block, 'CONDITION_' + index, Order.NONE) || 'False';
        code += generator.INDENT.repeat(3) + 'if ' + conditionCode + ':\n';
        if (index === block.mrcStepNames.length - 1) {
            code += generator.INDENT.repeat(4) + 'self._current_step = None\n';
        } else {
            code += generator.INDENT.repeat(4) + 'self._current_step = "' + block.mrcStepNames[index + 1] + '"\n';
        }
    });

    generator.addClassMethodDefinition('steps', code);

    return ''
}