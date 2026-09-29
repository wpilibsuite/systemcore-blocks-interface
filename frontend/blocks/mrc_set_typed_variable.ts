/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Block that sets a variable of a specific python type, like
 * telemetry.TelemetryTable. The dropdown only shows the variables of that type.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { FieldTypedVariable } from '../fields/field_typed_variable';
import { getAllowedTypesForSetCheck } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MRC_STYLE_VARIABLES } from '../themes/styles';
import * as toolboxItems from '../toolbox/items';

export const BLOCK_NAME = 'mrc_set_typed_variable';

const FIELD_VAR = 'VAR';
const INPUT_VALUE = 'VALUE';

/** Extra state for serialising mrc_set_typed_variable blocks. */
type TypedVariableExtraState = {
  /**
   * The python type of the variable.
   */
  varType: string,
};

type SetTypedVariableBlock = Blockly.Block & SetTypedVariableMixin;
interface SetTypedVariableMixin extends SetTypedVariableMixinType {
  mrcVarType: string,
}
type SetTypedVariableMixinType = typeof SET_TYPED_VARIABLE;

const SET_TYPED_VARIABLE = {
  /**
   * Block initialization.
   */
  init: function(this: SetTypedVariableBlock): void {
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle(MRC_STYLE_VARIABLES);
    this.setTooltip(Blockly.Msg['VARIABLES_SET_TOOLTIP']);
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(this: SetTypedVariableBlock): TypedVariableExtraState {
    return {
      varType: this.mrcVarType,
    };
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(this: SetTypedVariableBlock, extraState: TypedVariableExtraState): void {
    this.mrcVarType = extraState.varType;
    this.updateBlock_();
  },
  /**
   * Adds the variable dropdown and value input, which depend on the type of the variable.
   */
  updateBlock_: function(this: SetTypedVariableBlock): void {
    if (!this.getInput(INPUT_VALUE)) {
      this.appendValueInput(INPUT_VALUE)
          .appendField(Blockly.Msg['SET'])
          .appendField(new FieldTypedVariable(this.mrcVarType), FIELD_VAR)
          .appendField(Blockly.Msg['TO']);
    }
    this.getInput(INPUT_VALUE)!.setCheck(getAllowedTypesForSetCheck(this.mrcVarType));
  },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = SET_TYPED_VARIABLE;
};

export const pythonFromBlock = function(
    block: SetTypedVariableBlock,
    generator: ExtendedPythonGenerator,
): string {
  const varName = generator.getVariableName(block.getFieldValue(FIELD_VAR));
  const value = generator.valueToCode(block, INPUT_VALUE, Order.NONE) || 'None';
  return varName + ' = ' + value + '\n';
};

/** Returns a setter block for a variable of the given type, with the given block plugged into it. */
export function createTypedVariableSetterBlock(
    varType: string, valueBlock: toolboxItems.Block): toolboxItems.Block {
  const extraState: TypedVariableExtraState = {
    varType: varType,
  };
  return new toolboxItems.Block(BLOCK_NAME, extraState, null, {[INPUT_VALUE]: {'block': valueBlock}});
}
