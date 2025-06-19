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
import { Order } from 'blockly/python';

import { MRC_STYLE_VARIABLES } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';

export const BLOCK_NAME = 'mrc_get_parameter';


type GetParameterBlock = Blockly.Block & GetParameterMixin;
interface GetParameterMixin extends GetParameterMixinType {
}
type GetParameterMixinType = typeof GET_PARAMETER_BLOCK;

const GET_PARAMETER_BLOCK = {
  parameterType : '',  // Later this will be set to the type of the parameter, e.g. 'string', 'number', etc.
  /**
    * Block initialization.
    */
  init: function (this: GetParameterBlock): void {
    this.setStyle(MRC_STYLE_VARIABLES);
    this.appendDummyInput()
      .appendField('parameter')
      .appendField(createFieldNonEditableText('parameter'), 'PARAMETER_NAME');

    this.setOutput(true, this.parameterType);
  },
  setNameAndType: function (this: GetParameterBlock, name: string, type: string): void {
    this.setFieldValue(name, 'PARAMETER_NAME');
    this.parameterType = type;
    this.setOutput(true, type);
  }
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = GET_PARAMETER_BLOCK;
}

export const pythonFromBlock = function (
  block: GetParameterBlock,
  generator: ExtendedPythonGenerator,
) {
    //TODO (Alan) : Specify the type here as well
    let code = block.getFieldValue('PARAMETER_NAME');

    return [code, Order.ATOMIC];
}
