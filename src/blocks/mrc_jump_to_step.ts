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

import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {createFieldNonEditableText} from '../fields/FieldNonEditableText';
import {MRC_STYLE_VARIABLES} from '../themes/styles';
import {BLOCK_NAME as MRC_STEPS, StepsBlock} from './mrc_steps'

export const BLOCK_NAME = 'mrc_jump_to_step';

const FIELD_STEP_NAME = 'STEP_NAME';

const WARNING_ID_NOT_IN_STEP = 'not in step';


type JumpToStepBlock = Blockly.Block & Blockly.BlockSvg & JumpToStepMixin;

interface JumpToStepMixin extends JumpToStepMixinType {
  mrcHasWarning: boolean,
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
      /**
         * mrcOnMove is called when an EventBlock is moved.
         */
        mrcOnMove: function(this: JumpToStepBlock, _reason: string[]): void {
          this.checkBlockPlacement();
        },
        mrcOnAncestorMove: function(this: JumpToStepBlock): void {
          this.checkBlockPlacement();
        },
        checkBlockPlacement: function(this: JumpToStepBlock): void {
          const legalStepNames: string[] = [];
      
          const rootBlock: Blockly.Block | null = this.getRootBlock();
          if (rootBlock.type === MRC_STEPS) {
            // This block is within a class method definition.
            const stepsBlock = rootBlock as StepsBlock;
            // Add the method's parameter names to legalStepNames.
            legalStepNames.push(...stepsBlock.mrcGetStepNames());
          } 
      
          if (legalStepNames.includes(this.getFieldValue(FIELD_STEP_NAME))) {
            // If this blocks's parameter name is in legalParameterNames, it's good.
            this.setWarningText(null, WARNING_ID_NOT_IN_STEP);
            this.mrcHasWarning = false;
          } else {
            // Otherwise, add a warning to this block.
            if (!this.mrcHasWarning) {
              this.setWarningText(Blockly.Msg.JUMP_CAN_ONLY_GO_IN_THEIR_STEPS_BLOCK, WARNING_ID_NOT_IN_STEP);
              this.getIcon(Blockly.icons.IconType.WARNING)!.setBubbleVisible(true);
              this.mrcHasWarning = true;
            }
          }
        },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = JUMP_TO_STEP_BLOCK;
};

export const pythonFromBlock = function(
    block: JumpToStepBlock,
    _generator: ExtendedPythonGenerator,
) {
  let code = 'self.current_step_index = self.mrc_step_name_to_index["' +
      block.getFieldValue(FIELD_STEP_NAME) + '"]\n';
  code += 'return\n';

  return code;
};
