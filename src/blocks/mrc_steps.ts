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
 * @fileoverview Block for defining steps.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_STEPS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createStepFieldFlydown } from '../fields/field_flydown';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import { renameSteps as updateJumpToStepBlocks } from './mrc_jump_to_step';
import * as stepContainer from './mrc_step_container'
import { createBooleanShadowValue } from './utils/value';
import * as toolboxItems from '../toolbox/items';

export const BLOCK_NAME = 'mrc_steps';

export const STEPS_METHOD_NAME = '_steps';

const INPUT_CONDITION_PREFIX = 'CONDITION_';
const INPUT_STATEMENT_PREFIX = 'STATEMENT_';

/** Extra state for serialising mrc_steps blocks. */
type StepsExtraState = {
  /**
   * The step names.
   */
  stepNames: string[],
};

export type StepsBlock = Blockly.Block & StepsMixin;
interface StepsMixin extends StepsMixinType {
  mrcStepNames: string[];
}
type StepsMixinType = typeof STEPS;

const STEPS = {
  /**
   * Block initialization.
   */
  init: function (this: StepsBlock): void {
    this.mrcStepNames = [];
    this.appendDummyInput()
      .appendField(Blockly.Msg.STEPS);
    this.setInputsInline(false);
    this.setStyle(MRC_STYLE_STEPS);
    if (this.rendered) {
      this.setMutator(stepContainer.getMutatorIcon(this as unknown as Blockly.BlockSvg));
    }
  },
  ...NONCOPYABLE_BLOCK,
  saveExtraState: function (this: StepsBlock): StepsExtraState {
    return {
      stepNames: this.mrcStepNames,
    };
  },
  loadExtraState: function (this: StepsBlock, state: StepsExtraState): void {
    this.mrcStepNames = state.stepNames;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   */
  decompose: function (this: StepsBlock, workspace: Blockly.Workspace): stepContainer.StepContainerBlock {
    const stepNames: string[] = [];
    this.mrcStepNames.forEach(step => {
      stepNames.push(step);
    });
    return stepContainer.createMutatorBlocks(workspace, stepNames);
  },
  /**
   * Store condition and statement connections on the StepItemBlocks
   */
  saveConnections: function (this: StepsBlock, containerBlock: stepContainer.StepContainerBlock) {
    const stepItemBlocks: stepContainer.StepItemBlock[] = containerBlock.getStepItemBlocks();
    for (let i = 0; i < stepItemBlocks.length; i++) {
      const stepItemBlock = stepItemBlocks[i];
      const conditionInput = this.getInput(INPUT_CONDITION_PREFIX + i);
      stepItemBlock.conditionShadowState = 
          conditionInput && conditionInput.connection!.getShadowState(true);
      stepItemBlock.conditionTargetConnection =
          conditionInput && conditionInput.connection!.targetConnection;
      const statementInput = this.getInput(INPUT_STATEMENT_PREFIX + i);
      stepItemBlock.statementTargetConnection =
          statementInput && statementInput.connection!.targetConnection;
    }
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   */
  compose: function (this: StepsBlock, containerBlock: stepContainer.StepContainerBlock) {
    const mapOldStepNameToNewStepName: {[newStepName: string]: string} = {};
    const conditionShadowStates: Array<any> = [];
    const conditionTargetConnections: Array<Blockly.Connection | null> = [];
    const statementTargetConnections: Array<Blockly.Connection | null> = [];

    const stepItemBlocks: stepContainer.StepItemBlock[] = containerBlock.getStepItemBlocks();

    // Iterate through the step item blocks to:
    // - Update this.mrcStepNames
    // - Keep track of steps that were renamed
    // - Collect the condition and statement connections that were saved on the StepItemBlocks.
    this.mrcStepNames = [];
    stepItemBlocks.forEach((stepItemBlock) => {
      const oldStepName = stepItemBlock.getOriginalName();
      const newStepName = stepItemBlock.getName();
      stepItemBlock.setOriginalName(newStepName);
      this.mrcStepNames.push(newStepName);
      if (oldStepName !== newStepName) {
        mapOldStepNameToNewStepName[oldStepName] = newStepName;
      }
      conditionShadowStates.push(stepItemBlock.conditionShadowState);
      conditionTargetConnections.push(stepItemBlock.conditionTargetConnection as Blockly.Connection | null);
      statementTargetConnections.push(stepItemBlock.statementTargetConnection as Blockly.Connection | null);
    });

    this.updateShape_();

    // Reconnect blocks.
    for (let i = 0; i < this.mrcStepNames.length; i++) {
      // Reconnect the condition.
      conditionTargetConnections[i]?.reconnect(this, INPUT_CONDITION_PREFIX + i);
      // Add the boolean shadow block to the condition input. This must be done after the condition
      // has been reconnected. If it is done before the condition is reconnected, the shadow will
      // become disconnected.
      const conditionShadowState = conditionShadowStates[i] || createBooleanShadowValue(true).shadow;
      const conditionInput = this.getInput(INPUT_CONDITION_PREFIX + i);
      conditionInput?.connection?.setShadowState(conditionShadowState as any);
      // Reconnect the statement.
      statementTargetConnections[i]?.reconnect(this, INPUT_STATEMENT_PREFIX + i);
    }

    if (Object.keys(mapOldStepNameToNewStepName).length) {
      // Update jump blocks for any renamed steps.
      updateJumpToStepBlocks(this.workspace, mapOldStepNameToNewStepName);
    }
  },
  /**
   * mrcOnMutatorOpen is called when the mutator on an StepsBlock is opened.
   */
  mrcOnMutatorOpen: function (this: StepsBlock): void {
    if (this.rendered) {
      stepContainer.onMutatorOpen(this as unknown as Blockly.BlockSvg);
    }
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

    if (oldName !== currentName) {
      // Update all mrc_jump_to_step blocks that reference the old name
      const mapOldStepNameToNewStepName: {[newStepName: string]: string} = {};
      mapOldStepNameToNewStepName[oldName] = currentName;
      updateJumpToStepBlocks(this.workspace, mapOldStepNameToNewStepName);
    }

    return currentName;
  },
  updateShape_: function (this: StepsBlock): void {
    // Remove all inputs.
    for (let i = 0; this.getInput(INPUT_CONDITION_PREFIX + i); i++) {
      this.removeInput(INPUT_CONDITION_PREFIX + i);
      this.removeInput(INPUT_STATEMENT_PREFIX + i);
    }
    // Add inputs for each step.
    for (let i = 0; i < this.mrcStepNames.length; i++) {
      const stepName = this.mrcStepNames[i];
      const fieldFlydown = createStepFieldFlydown(stepName, true);
      fieldFlydown.setValidator(this.mrcUpdateStepName.bind(this, i));
      this.appendValueInput(INPUT_CONDITION_PREFIX + i)
        .appendField(fieldFlydown)
        .setCheck('Boolean')
        .appendField(Blockly.Msg.REPEAT_UNTIL);
      this.appendStatementInput(INPUT_STATEMENT_PREFIX + i);
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
  let code = 'def ' + STEPS_METHOD_NAME + '(self):\n';
  code += generator.INDENT + 'if not hasattr(self, \'_initialized_steps\'):\n';
  code += generator.INDENT.repeat(2) + 'self._current_step = \'' + block.mrcStepNames[0] + '\'\n';
  code += generator.INDENT.repeat(2) + 'self._initialized_steps = True\n\n';
  code += generator.INDENT + 'if self._current_step == None:\n';
  code += generator.INDENT.repeat(2) + 'return\n';


  code += generator.INDENT + 'match self._current_step:\n';
  block.mrcStepNames.forEach((stepName, index) => {
    code += generator.INDENT.repeat(2) + `case '${stepName}':\n`;
    const stepCode = generator.statementToCode(block, INPUT_STATEMENT_PREFIX + index);
    if (stepCode !== '') {
      code += generator.prefixLines(stepCode, generator.INDENT.repeat(2));
    }
    const conditionCode = generator.valueToCode(block, INPUT_CONDITION_PREFIX + index, Order.NONE) || 'False';
    code += generator.INDENT.repeat(3) + 'if ' + conditionCode + ':\n';
    if (index === block.mrcStepNames.length - 1) {
      code += generator.INDENT.repeat(4) + 'self._current_step = None\n';
    } else {
      code += generator.INDENT.repeat(4) + 'self._current_step = \'' + block.mrcStepNames[index + 1] + '\'\n';
    }
  });

  generator.addClassMethodDefinition(STEPS_METHOD_NAME, code);

  return ''
}

export function createStepsBlock(): toolboxItems.Block {
  const extraState: StepsExtraState = {
    stepNames: ['0'],
  };
  const fields: {[key: string]: any} = {};
  const inputs: {[key: string]: any} = {};
  inputs[INPUT_CONDITION_PREFIX + 0] = createBooleanShadowValue(true);
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, inputs);
}
