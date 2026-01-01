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

import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_VARIABLES } from '../themes/styles';
import { BLOCK_NAME as MRC_STEPS, StepsBlock } from './mrc_steps'
import { CustomDropdownWithoutValidation } from '../fields/FieldDropdown';

export const BLOCK_NAME = 'mrc_jump_to_step';

const FIELD_STEP_NAME = 'STEP_NAME';

const WARNING_ID_NOT_IN_STEP = 'not in step';


type JumpToStepBlock = Blockly.Block & JumpToStepMixin;

interface JumpToStepMixin extends JumpToStepMixinType {
  mrcHasWarning: boolean,
}

type JumpToStepMixinType = typeof JUMP_TO_STEP_BLOCK;

const JUMP_TO_STEP_BLOCK = {
  /**
   * Block initialization.
   */
  init: function (this: JumpToStepBlock): void {
    this.mrcHasWarning = false;

    this.setStyle(MRC_STYLE_VARIABLES);
       
    const blockRef = this;
    // Use a function to dynamically generate options when dropdown opens
    const dropdown: Blockly.Field = new CustomDropdownWithoutValidation(
      function() {
        // This function will be called to regenerate options when dropdown opens
        return blockRef.getStepOptions();
      }
    );
    
    dropdown.setValidator(this.validateStepSelection.bind(this));
    
    this.appendDummyInput()
      .appendField(Blockly.Msg.JUMP_TO)
      .appendField(dropdown, FIELD_STEP_NAME);
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(() => {
      const stepName = this.getFieldValue(FIELD_STEP_NAME);
      let tooltip = Blockly.Msg.JUMP_TO_STEP_TOOLTIP;
      tooltip = tooltip.replace('{{stepName}}', stepName);
      return tooltip;
    });
  },
  getStepOptions: function(this: JumpToStepBlock): [string, string][] {
    const legalStepNames: string[] = [];

    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock && rootBlock.type === MRC_STEPS) {
      const stepsBlock = rootBlock as StepsBlock;
      legalStepNames.push(...stepsBlock.mrcGetStepNames());
    }

    // Get the field to check its value
    const field = this.getField(FIELD_STEP_NAME) as Blockly.FieldDropdown | null;
    const currentValue = field?.getValue();
    
    // Always include the current field value if it exists and isn't already in the list
    if (currentValue && currentValue !== '' && !legalStepNames.includes(currentValue)) {
      legalStepNames.unshift(currentValue);
    }

    if (legalStepNames.length === 0) {
      return [[Blockly.Msg.NO_STEPS, '']];
    }

    return legalStepNames.map(name => [name, name]);
  },
  validateStepSelection: function(this: JumpToStepBlock, newValue: string): string {
    // Clear any previous warnings
    this.setWarningText(null, WARNING_ID_NOT_IN_STEP);
    this.mrcHasWarning = false;
    
    // Options will be regenerated automatically on next dropdown open
    // via the function passed to the CustomStepDropdown constructor
    
    return newValue;
  },
  /**
   * mrcOnMove is called when a JumpToStepBlock is moved.
   */
  mrcOnMove: function (this: JumpToStepBlock, _editor: Editor, _reason: string[]): void {
    this.checkBlockPlacement();
  },
  mrcOnAncestorMove: function (this: JumpToStepBlock): void {
    this.checkBlockPlacement();
  },
  checkBlockPlacement: function (this: JumpToStepBlock): void {
    const legalStepNames: string[] = [];

    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock.type === MRC_STEPS) {
      // This block is within a steps block.
      const stepsBlock = rootBlock as StepsBlock;
      // Add the step names to legalStepNames.
      legalStepNames.push(...stepsBlock.mrcGetStepNames());
    }

    const currentStepName = this.getFieldValue(FIELD_STEP_NAME);
    
    if (legalStepNames.includes(currentStepName)) {
      // If this blocks's step name is in legalStepNames, it's good.
      this.setWarningText(null, WARNING_ID_NOT_IN_STEP);
      this.mrcHasWarning = false;
    } else {
      // Otherwise, add a warning to this block.
      if (!this.mrcHasWarning) {
        // Provide a more specific message depending on the situation
        let warningMessage: string;
        if (rootBlock.type === MRC_STEPS) {
          // We're in a steps block but the step doesn't exist
          if (currentStepName && currentStepName !== '') {
            const messageTemplate = Blockly.Msg.STEP_DOES_NOT_EXIST_IN_STEPS;
            warningMessage = messageTemplate.replace('%1', currentStepName);
          } else {
            warningMessage = Blockly.Msg.NO_STEP_SELECTED;
          }
        } else {
          // We're not even in a steps block
          warningMessage = Blockly.Msg.JUMP_CAN_ONLY_GO_IN_THEIR_STEPS_BLOCK;
        }
        
        this.setWarningText(warningMessage, WARNING_ID_NOT_IN_STEP);
        const icon = this.getIcon(Blockly.icons.IconType.WARNING);
        if (icon) {
          icon.setBubbleVisible(true);
        }
        this.mrcHasWarning = true;
      }
    }
  },
  /**
   * Called to recheck step validity. Used when steps are changed.
   */
  mrcCheckStep: function(this: JumpToStepBlock): void {
    this.checkBlockPlacement();
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = JUMP_TO_STEP_BLOCK;
};

export const pythonFromBlock = function (
  block: JumpToStepBlock,
  _generator: ExtendedPythonGenerator,
) {
  let code = 'self._current_step = \'' +
    block.getFieldValue(FIELD_STEP_NAME) + '\'\n';
  code += 'return\n';

  return code;
};

export function renameSteps(workspace: Blockly.Workspace, mapOldStepNameToNewStepName: {[newStepName: string]: string}): void {
  workspace.getBlocksByType(BLOCK_NAME, false).forEach((jumpBlock) => {
    const stepName = jumpBlock.getFieldValue(FIELD_STEP_NAME);
    if (stepName in mapOldStepNameToNewStepName) {
      const newStepName = mapOldStepNameToNewStepName[stepName];
      jumpBlock.setFieldValue(newStepName, FIELD_STEP_NAME);
    }
  });
}
