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
 * @fileoverview Block for Opmode details
 * @author alan@porpoiseful.com (Alan Smith)
 */

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
 * @fileoverview Create a component with a name of a certain type
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { PERIODIC_METHOD_NAME } from './utils/python';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator, OpModeDetails } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';

export const BLOCK_NAME = 'mrc_opmode_details';

const WARNING_ID_STEPS_OR_PERIODIC_REQUIRED = 'id_steps_or_periodic_required';

type OpmodeDetailsBlock = Blockly.Block & OpmodeDetailsMixin;
interface OpmodeDetailsMixin extends OpmodeDetailsMixinType {
  mrcHasStepsOrPeriodicRequiredWarning: boolean,
}
type OpmodeDetailsMixinType = typeof OPMODE_DETAILS;

const OPMODE_DETAILS = {
  /**
    * Block initialization.
    */
  init: function (this: OpmodeDetailsBlock): void {
    this.mrcHasStepsOrPeriodicRequiredWarning = false;
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.appendDummyInput()
      .appendField(Blockly.Msg.TYPE)
      // These aren't Blockly.Msg because they need to match the Python generator's expected values.
      .appendField(createFieldDropdown(["Auto", "Teleop", "Test"]), 'TYPE')
      .appendField('    ')
      .appendField(Blockly.Msg.ENABLED)
      .appendField(new Blockly.FieldCheckbox(true), 'ENABLED');

    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_NAME)
        .appendField(new Blockly.FieldTextInput(''), 'NAME')
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_GROUP)
        .appendField(new Blockly.FieldTextInput(''), 'GROUP');

    this.getField('TYPE')?.setTooltip(Blockly.Msg.OPMODE_TYPE_TOOLTIP);
    this.getField('ENABLED')?.setTooltip(Blockly.Msg.OPMODE_ENABLED_TOOLTIP);
    this.getField('NAME')?.setTooltip(Blockly.Msg.OPMODE_NAME_TOOLTIP);
    this.getField('GROUP')?.setTooltip(Blockly.Msg.OPMODE_GROUP_TOOLTIP);
  },
  checkOpMode(this: OpmodeDetailsBlock, editor: Editor): void {
    if (editor.isStepsInWorkspace() ||
        editor.getMethodNamesAlreadyOverriddenInWorkspace().includes(PERIODIC_METHOD_NAME)) {
      // Remove the previous warning.
      this.setWarningText(null, WARNING_ID_STEPS_OR_PERIODIC_REQUIRED);
      this.mrcHasStepsOrPeriodicRequiredWarning = false;
    } else {
      // Otherwise, add a warning to the block.
      if (!this.mrcHasStepsOrPeriodicRequiredWarning) {
        this.setWarningText(Blockly.Msg.WARNING_OPMODE_STEPS_OR_PERIODIC_REQUIRED, WARNING_ID_STEPS_OR_PERIODIC_REQUIRED);
        const icon = this.getIcon(Blockly.icons.IconType.WARNING);
        if (icon) {
          icon.setBubbleVisible(true);
        }
        this.mrcHasStepsOrPeriodicRequiredWarning = true;
      }
    }
  }
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = OPMODE_DETAILS;
}

export const pythonFromBlock = function (
  block: OpmodeDetailsBlock,
  generator: ExtendedPythonGenerator,
) {
    generator.setOpModeDetails(new OpModeDetails(
                                block.getFieldValue('NAME'),
                                block.getFieldValue('GROUP'),
                                block.getFieldValue('ENABLED') == 'TRUE',
                                block.getFieldValue('TYPE')
                              ));
    return '';
}

// Misc

export function checkOpMode(workspace: Blockly.Workspace, editor: Editor) {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as OpmodeDetailsBlock).checkOpMode(editor);
  });
}
