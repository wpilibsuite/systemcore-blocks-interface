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

import { ExtendedPythonGenerator, OpModeDetails } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';

export const BLOCK_NAME = 'mrc_opmode_details';

type OpmodeDetailsBlock = Blockly.Block & OpmodeDetailsMixin;
interface OpmodeDetailsMixin extends OpmodeDetailsMixinType {
}
type OpmodeDetailsMixinType = typeof OPMODE_DETAILS;

const OPMODE_DETAILS = {
  /**
    * Block initialization.
    */
  init: function (this: OpmodeDetailsBlock): void {
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.appendDummyInput()
      .appendField('Type')
      .appendField(createFieldDropdown(['Auto', 'Teleop', 'Test']), 'TYPE')
      .appendField('    ')
      .appendField('Enabled')
      .appendField(new Blockly.FieldCheckbox(true), 'ENABLED');

    this.appendDummyInput()
        .appendField('Display Name')
        .appendField(new Blockly.FieldTextInput(''), 'NAME')
    this.appendDummyInput()
        .appendField('Display Group')
        .appendField(new Blockly.FieldTextInput(''), 'GROUP');

    this.getField('TYPE')?.setTooltip('What sort of OpMode this is');
    this.getField('ENABLED')?.setTooltip('Whether the OpMode is shown on Driver Station');
    this.getField('NAME')?.setTooltip('The name shown on the Driver Station.  If blank will use the class name.');
    this.getField('GROUP')?.setTooltip('An optional group to group OpModes on Driver Station');
  },
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
