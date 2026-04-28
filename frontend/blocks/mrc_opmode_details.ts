/**
 * @license
 * Copyright 2025-26 Porpoiseful LLC
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

import * as Blockly from 'blockly';

import { PERIODIC_METHOD_NAME } from './utils/python';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator, OpModeDetails } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';

export const BLOCK_NAME = 'mrc_opmode_details';

const OPMODE_TYPE_AUTO = 'Auto';
const OPMODE_TYPE_TELEOP = 'Teleop';
const OPMODE_TYPE_UTILITY = 'Utility';
const OPMOODE_TYPES = [OPMODE_TYPE_AUTO, OPMODE_TYPE_TELEOP, OPMODE_TYPE_UTILITY];

const FIELD_TYPE = 'TYPE';
const FIELD_ENABLED = 'ENABLED';
const FIELD_NAME = 'NAME';
const FIELD_GROUP = 'GROUP';
const FIELD_DESCRIPTION = 'DESCRIPTION';

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
      .appendField(createFieldDropdown(OPMOODE_TYPES), 'TYPE')
      .appendField('    ')
      .appendField(Blockly.Msg.ENABLED)
      .appendField(new Blockly.FieldCheckbox(true), 'ENABLED');

    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_NAME)
        .appendField(new Blockly.FieldTextInput(''), 'NAME')
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_GROUP)
        .appendField(new Blockly.FieldTextInput(''), 'GROUP');
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_DESCRIPTION)
        .appendField(new Blockly.FieldTextInput(''), 'DESCRIPTION');        

    this.getField(FIELD_TYPE)?.setTooltip(Blockly.Msg.OPMODE_TYPE_TOOLTIP);
    this.getField(FIELD_ENABLED)?.setTooltip(Blockly.Msg.OPMODE_ENABLED_TOOLTIP);
    this.getField(FIELD_NAME)?.setTooltip(Blockly.Msg.OPMODE_NAME_TOOLTIP);
    this.getField(FIELD_GROUP)?.setTooltip(Blockly.Msg.OPMODE_GROUP_TOOLTIP);
    this.getField(FIELD_DESCRIPTION)?.setTooltip(Blockly.Msg.OPMODE_DESCRIPTION_TOOLTIP);
  },
  ...NONCOPYABLE_BLOCK,
  checkOpMode(this: OpmodeDetailsBlock, editor: Editor): void {
    // Check that a Steps block is in the workspace or the periodic method is overridden.
    // It's ok to have both.
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
  },
  upgrade_0014_to_0015: function(this: OpmodeDetailsBlock) {
      if (this.getField(FIELD_TYPE) && this.getFieldValue(FIELD_TYPE) === 'Test') {
        this.setFieldValue(OPMODE_TYPE_UTILITY, FIELD_TYPE);
      }
  }
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = OPMODE_DETAILS;
}

export const pythonFromBlock = function (
  _block: OpmodeDetailsBlock,
  _generator: ExtendedPythonGenerator,
) {  
    return '';
}

// Misc

/**
 * Extracts OpModeDetails from a module's blocks JSON without creating a workspace.
 * The blocksJson is the value returned by ModuleContent.getBlocks().
 */
export function getOpModeDetailsFromBlocksJson(blocksJson: {[key: string]: any}, className: string = ''): OpModeDetails | null {
  const blocks = blocksJson?.blocks?.blocks;
  if (!Array.isArray(blocks)) return null;
  for (const block of blocks) {
    if (block.type === BLOCK_NAME) {
      return new OpModeDetails(
        className,
        block.fields?.FIELD_NAME || className,
        block.fields?.FIELD_GROUP ?? '',
        block.fields?.FIELD_DESCRIPTION ?? '',
        block.fields?.FIELD_ENABLED !== false && block.fields?.FIELD_ENABLED !== 'FALSE',
        block.fields?.FIELD_TYPE ?? 'Teleop',
      );
    }
  }
  return null;
}

export function checkOpMode(workspace: Blockly.Workspace, editor: Editor) {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as OpmodeDetailsBlock).checkOpMode(editor);
  });
}

/**  
 * Upgrades the OpmodeDetailsBlocks in the given workspace from version 0014 to 0015.  
 * This function should only be called when upgrading old projects.  
 */  
export function upgrade_0014_to_0015(workspace: Blockly.Workspace): void {  
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {  
    (block as OpmodeDetailsBlock).upgrade_0014_to_0015();  
  });  
}  
