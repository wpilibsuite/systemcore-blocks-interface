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

import { PERIODIC_METHOD_NAME, getAllowedTypesForSetCheck } from './utils/python';
import {
    BLOCK_NAME as MRC_CALL_PYTHON_FUNCTION,
    getConstructorCallFromBlockJson } from './mrc_call_python_function';
import {
    BLOCK_NAME as MRC_GET_PYTHON_VARIABLE,
    createClassVariableGetterBlockJson,
    getClassVariableFromBlockJson } from './mrc_get_python_variable';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator, OpModeDetails, OpModeDetailsParams } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import { NONDISABLEABLE_BLOCK } from './nondisableable_block';

export const BLOCK_NAME = 'mrc_opmode_details';

export const OPMODE_TYPE_AUTO = 'Auto';
export const OPMODE_TYPE_TELEOP = 'Teleop';
export const OPMODE_TYPE_UTILITY = 'Utility';
export const OPMODE_TYPES = [OPMODE_TYPE_AUTO, OPMODE_TYPE_TELEOP, OPMODE_TYPE_UTILITY];

export const FIELD_TYPE = 'TYPE';
const FIELD_ENABLED = 'ENABLED';
const FIELD_NAME = 'NAME';
const FIELD_GROUP = 'GROUP';
const FIELD_DESCRIPTION = 'DESCRIPTION';
const FIELD_FOREGROUND_COLOR_LABEL = 'FOREGROUND_COLOR_LABEL';
const FIELD_BACKGROUND_COLOR_LABEL = 'BACKGROUND_COLOR_LABEL';
const INPUT_FOREGROUND_COLOR = 'FOREGROUND_COLOR';
const INPUT_BACKGROUND_COLOR = 'BACKGROUND_COLOR';

const COLOR_CLASS_NAME = 'wpiutil.Color';
const COLOR_MODULE_NAME = 'wpiutil';
const DEFAULT_FOREGROUND_COLOR = 'WHITE';
const DEFAULT_BACKGROUND_COLOR = 'BLACK';

const WARNING_ID_STEPS_OR_PERIODIC_REQUIRED = 'id_steps_or_periodic_required';
const WARNING_ID_UNSUPPORTED_COLOR = 'id_unsupported_color';

type OpmodeDetailsBlock = Blockly.Block & OpmodeDetailsMixin;
interface OpmodeDetailsMixin extends OpmodeDetailsMixinType {
  mrcHasStepsOrPeriodicRequiredWarning: boolean,
  /** The ids of the blocks that have the unsupported color warning. */
  mrcUnsupportedColorBlockIds: Set<string>,
}
type OpmodeDetailsMixinType = typeof OPMODE_DETAILS;

const OPMODE_DETAILS = {
  /**
    * Block initialization.
    */
  init: function (this: OpmodeDetailsBlock): void {
    this.mrcHasStepsOrPeriodicRequiredWarning = false;
    this.mrcUnsupportedColorBlockIds = new Set();
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.appendDummyInput()
      .appendField(Blockly.Msg.TYPE)
      // These aren't Blockly.Msg because they need to match the Python generator's expected values.
      .appendField(createFieldDropdown(OPMODE_TYPES), FIELD_TYPE)
      .appendField('    ')
      .appendField(Blockly.Msg.ENABLED)
      .appendField(new Blockly.FieldCheckbox(true), FIELD_ENABLED);

    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_NAME)
        .appendField(new Blockly.FieldTextInput(''), FIELD_NAME)
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_GROUP)
        .appendField(new Blockly.FieldTextInput(''), FIELD_GROUP);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DISPLAY_DESCRIPTION)
        .appendField(new Blockly.FieldTextInput(''), FIELD_DESCRIPTION);
    this.appendValueInput(INPUT_FOREGROUND_COLOR)
        .setCheck(getAllowedTypesForSetCheck(COLOR_CLASS_NAME))
        .appendField(new Blockly.FieldLabel(Blockly.Msg.DISPLAY_FOREGROUND_COLOR), FIELD_FOREGROUND_COLOR_LABEL);
    this.appendValueInput(INPUT_BACKGROUND_COLOR)
        .setCheck(getAllowedTypesForSetCheck(COLOR_CLASS_NAME))
        .appendField(new Blockly.FieldLabel(Blockly.Msg.DISPLAY_BACKGROUND_COLOR), FIELD_BACKGROUND_COLOR_LABEL);

    this.getField(FIELD_TYPE)?.setTooltip(Blockly.Msg.OPMODE_TYPE_TOOLTIP);
    this.getField(FIELD_ENABLED)?.setTooltip(Blockly.Msg.OPMODE_ENABLED_TOOLTIP);
    this.getField(FIELD_NAME)?.setTooltip(Blockly.Msg.OPMODE_NAME_TOOLTIP);
    this.getField(FIELD_GROUP)?.setTooltip(Blockly.Msg.OPMODE_GROUP_TOOLTIP);
    this.getField(FIELD_DESCRIPTION)?.setTooltip(Blockly.Msg.OPMODE_DESCRIPTION_TOOLTIP);
    this.getField(FIELD_FOREGROUND_COLOR_LABEL)?.setTooltip(Blockly.Msg.OPMODE_FOREGROUND_COLOR_TOOLTIP);
    this.getField(FIELD_BACKGROUND_COLOR_LABEL)?.setTooltip(Blockly.Msg.OPMODE_BACKGROUND_COLOR_TOOLTIP);
  },
  ...NONCOPYABLE_BLOCK,
  ...NONDISABLEABLE_BLOCK,
  
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
    this.checkColors();
  },
  /**
   * Adds a warning to each block in the color inputs that keeps the color from
   * being passed to add_opmode, and removes the warning from blocks that no
   * longer do.
   */
  checkColors(this: OpmodeDetailsBlock): void {
    const unsupportedBlockIds = new Set<string>();
    for (const inputName of [INPUT_FOREGROUND_COLOR, INPUT_BACKGROUND_COLOR]) {
      const target = this.getInputTargetBlock(inputName);
      if (target) {
        const blockJson = Blockly.serialization.blocks.save(target, {addCoordinates: false, addNextBlocks: false});
        const unsupportedBlockId = analyzeColorInputJson({block: blockJson}).unsupportedBlockId;
        if (unsupportedBlockId) {
          unsupportedBlockIds.add(unsupportedBlockId);
        }
      }
    }
    // Remove the warning from blocks that are no longer unsupported, or are no
    // longer in a color input.
    for (const id of this.mrcUnsupportedColorBlockIds) {
      if (!unsupportedBlockIds.has(id)) {
        this.workspace.getBlockById(id)?.setWarningText(null, WARNING_ID_UNSUPPORTED_COLOR);
      }
    }
    // Add the warning to blocks that just became unsupported.
    for (const id of unsupportedBlockIds) {
      if (!this.mrcUnsupportedColorBlockIds.has(id)) {
        const block = this.workspace.getBlockById(id);
        if (block) {
          block.setWarningText(Blockly.Msg.WARNING_OPMODE_UNSUPPORTED_COLOR, WARNING_ID_UNSUPPORTED_COLOR);
          block.getIcon(Blockly.icons.IconType.WARNING)?.setBubbleVisible(true);
        }
      }
    }
    this.mrcUnsupportedColorBlockIds = unsupportedBlockIds;
  },
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
      const params: OpModeDetailsParams = {
        className,
        name: block.fields[FIELD_NAME] || className,
        group: block.fields[FIELD_GROUP] ?? '',
        description: block.fields[FIELD_DESCRIPTION] ?? '',
        enabled: block.fields[FIELD_ENABLED] !== false && block.fields[FIELD_ENABLED] !== 'FALSE',
        type: block.fields[FIELD_TYPE] ?? OPMODE_TYPE_TELEOP,
        foregroundColor: getColorCodeFromInputJson(block.inputs?.[INPUT_FOREGROUND_COLOR]),
        backgroundColor: getColorCodeFromInputJson(block.inputs?.[INPUT_BACKGROUND_COLOR]),
      };
      return new OpModeDetails(params);
    }
  }
  return null;
}

/**
 * Returns the block JSON connected to the given input JSON, or null if nothing
 * is connected. A real block takes precedence over the shadow block.
 */
function getConnectedBlockJson(inputJson: {[key: string]: any} | undefined): {[key: string]: any} | null {
  return inputJson?.block ?? inputJson?.shadow ?? null;
}

type ColorAnalysis = {
  /** The python code for the color, or null if the color isn't supported. */
  code: string | null,
  /** The id of the block that makes the color unsupported, if there is one. */
  unsupportedBlockId: string | null,
};

/**
 * Returns the python code for the color plugged into the given input JSON, or
 * null if the color can't be determined without running the opmode.
 */
function getColorCodeFromInputJson(inputJson: {[key: string]: any} | undefined): string | null {
  return analyzeColorInputJson(inputJson).code;
}

/**
 * Analyzes the color plugged into the given input JSON.
 *
 * The colors are passed to add_opmode in the robot's __init__, which is
 * generated from the opmode's saved blocks, so only a wpiutil.Color constant
 * (for example, wpiutil.Color.WHITE) or a wpiutil.Color constructor whose
 * arguments are all numbers (for example, wpiutil.Color(255, 128, 0)) are
 * supported.
 */
function analyzeColorInputJson(inputJson: {[key: string]: any} | undefined): ColorAnalysis {
  const blockJson = getConnectedBlockJson(inputJson);
  if (!blockJson) {
    return {code: null, unsupportedBlockId: null};
  }
  if (blockJson.type === MRC_GET_PYTHON_VARIABLE) {
    const classVariable = getClassVariableFromBlockJson(blockJson);
    if (classVariable?.className === COLOR_CLASS_NAME) {
      return {code: COLOR_CLASS_NAME + '.' + classVariable.varName, unsupportedBlockId: null};
    }
  }
  if (blockJson.type === MRC_CALL_PYTHON_FUNCTION) {
    const constructorCall = getConstructorCallFromBlockJson(blockJson);
    if (constructorCall?.className === COLOR_CLASS_NAME) {
      const argCodes: string[] = [];
      for (const argInputJson of constructorCall.argInputJsons) {
        const argBlockJson = getConnectedBlockJson(argInputJson);
        if (!argBlockJson) {
          return {code: null, unsupportedBlockId: blockJson.id ?? null};
        }
        if (argBlockJson.type !== 'math_number' || argBlockJson.fields?.NUM === undefined) {
          // Variables and other expressions aren't available in the robot's __init__.
          return {code: null, unsupportedBlockId: argBlockJson.id ?? null};
        }
        argCodes.push(String(argBlockJson.fields.NUM));
      }
      return {code: COLOR_CLASS_NAME + '(' + argCodes.join(', ') + ')', unsupportedBlockId: null};
    }
  }
  return {code: null, unsupportedBlockId: blockJson.id ?? null};
}

function createColorShadowJson(colorName: string): {[key: string]: any} {
  return {
    shadow: createClassVariableGetterBlockJson(
        COLOR_MODULE_NAME, COLOR_CLASS_NAME, COLOR_CLASS_NAME, colorName),
  };
}

/**
 * Adds the default foreground and background color shadow blocks to an
 * mrc_opmode_details block's JSON, if they are missing.
 * Returns true if the block JSON was changed.
 */
export function upgradeBlockJsonTo_0_8_0(blockJson: {[key: string]: any}): boolean {
  let changed = false;
  blockJson.inputs ??= {};
  if (!blockJson.inputs[INPUT_FOREGROUND_COLOR]) {
    blockJson.inputs[INPUT_FOREGROUND_COLOR] = createColorShadowJson(DEFAULT_FOREGROUND_COLOR);
    changed = true;
  }
  if (!blockJson.inputs[INPUT_BACKGROUND_COLOR]) {
    blockJson.inputs[INPUT_BACKGROUND_COLOR] = createColorShadowJson(DEFAULT_BACKGROUND_COLOR);
    changed = true;
  }
  return changed;
}

export function checkOpMode(workspace: Blockly.Workspace, editor: Editor) {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as OpmodeDetailsBlock).checkOpMode(editor);
  });
}
