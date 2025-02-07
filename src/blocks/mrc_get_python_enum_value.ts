/**
 * @license
 * Copyright 2024 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';

import * as pythonUtils from './utils/generated/python';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { getOutputCheck } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_ENUM } from '../themes/styles'


// A block to access a python enum.

export const BLOCK_NAME = 'mrc_get_python_enum_value';

// Variables and functions used for populating the drop down field for the enum values.

const PythonEnumValues = Object.create(null);
const PythonEnumTooltips = Object.create(null);

export function initializeEnum(
    enumClassName: string, enumValues: string[], tooltips: string[] | string): void {
  PythonEnumValues[enumClassName] = enumValues;
  PythonEnumTooltips[enumClassName] = tooltips;
}

//..............................................................................

type GetPythonEnumValueBlock = Blockly.Block & GetPythonEnumValueMixin;
interface GetPythonEnumValueMixin extends GetPythonEnumValueMixinType {
  mrcEnumType: string,
  mrcImportModule: string,
}
type GetPythonEnumValueMixinType = typeof GET_PYTHON_ENUM_VALUE;

/** Extra state for serialising mrc_get_python_enum_value blocks. */
type GetPythonEnumValueExtraState = {
  enumType: string,
  importModule: string,
};

const GET_PYTHON_ENUM_VALUE = {
  /**
   * Block initialization.
   */
  init: function(this: GetPythonEnumValueBlock): void {
    this.appendDummyInput('ENUM')
        .appendField(createFieldNonEditableText(''), pythonUtils.FIELD_ENUM_CLASS_NAME)
        .appendField('.');
    this.setStyle(MRC_STYLE_ENUM);
    this.setTooltip(() => {
      const enumClassName = this.getFieldValue(pythonUtils.FIELD_ENUM_CLASS_NAME);
      const enumValue = this.getFieldValue(pythonUtils.FIELD_ENUM_VALUE);
      let tooltip = 'Gets the enum value ' + enumClassName + '.' + enumValue + '.';
      const enumTooltip = PythonEnumTooltips[enumClassName]
      if (enumTooltip) {
        if (typeof enumTooltip === 'string') {
          tooltip += '\n\n' + enumTooltip;
        } else if (typeof enumTooltip === "object") {
          if (enumValue in enumTooltip) {
            tooltip += '\n\n' + enumTooltip[enumValue];
          }
        }
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: GetPythonEnumValueBlock): GetPythonEnumValueExtraState {
    const extraState: GetPythonEnumValueExtraState = {
      enumType: this.mrcEnumType,
      importModule: '',
    };
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: GetPythonEnumValueBlock,
      extraState: GetPythonEnumValueExtraState
  ): void {
    this.mrcEnumType = extraState.enumType;
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: GetPythonEnumValueBlock): void {
    // Set the output plug.
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.mrcEnumType);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    // Create the drop-down with the enum values.
    const enumValues = PythonEnumValues[this.mrcEnumType];
    this.getInput('ENUM')!
        .appendField(createFieldDropdown(enumValues), pythonUtils.FIELD_ENUM_VALUE);
  }
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = GET_PYTHON_ENUM_VALUE;
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: ExtendedPythonGenerator,
) {
  const getPythonEnumValueBlock = block as GetPythonEnumValueBlock;
  const enumClassName = block.getFieldValue(pythonUtils.FIELD_ENUM_CLASS_NAME);
  const enumValue = block.getFieldValue(pythonUtils.FIELD_ENUM_VALUE);
  if (getPythonEnumValueBlock.mrcImportModule) {
    generator.addImport(getPythonEnumValueBlock.mrcImportModule);
  }
  const code = enumClassName + '.' + enumValue;
  return [code, Order.MEMBER];
};
