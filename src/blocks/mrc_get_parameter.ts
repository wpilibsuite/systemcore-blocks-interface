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
import { BLOCK_NAME as MRC_CLASS_METHOD_DEF,  ClassMethodDefBlock} from './mrc_class_method_def';
import * as ChangeFramework from './utils/change_framework'
import { truncate } from 'node:fs';

export const BLOCK_NAME = 'mrc_get_parameter';
export const OUTPUT_NAME = 'mrc_get_parameter_output';


type GetParameterBlock = Blockly.Block & Blockly.BlockSvg & GetParameterMixin;
interface GetParameterMixin extends GetParameterMixinType {
}
type GetParameterMixinType = typeof GET_PARAMETER_BLOCK;

const GET_PARAMETER_BLOCK = {
  parameterType: '',  // Later this will be set to the type of the parameter, e.g. 'string', 'number', etc.
  /**
    * Block initialization.
    */
  init: function (this: GetParameterBlock): void {
    this.setStyle(MRC_STYLE_VARIABLES);
    this.appendDummyInput()
      .appendField('parameter')
      .appendField(createFieldNonEditableText('parameter'), 'PARAMETER_NAME');

    this.setOutput(true, [OUTPUT_NAME, this.parameterType]);
    ChangeFramework.registerCallback(BLOCK_NAME, [Blockly.Events.BLOCK_MOVE], this.onBlockChanged);
  },
  setNameAndType: function (this: GetParameterBlock, name: string, type: string): void {
    this.setFieldValue(name, 'PARAMETER_NAME');
    this.parameterType = type;
    this.setOutput(true, [OUTPUT_NAME, type]);
  },

  onBlockChanged(block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase): void {
    let blockBlock = block as Blockly.Block;

    if (blockEvent.type === Blockly.Events.BLOCK_MOVE) {
      let parent = ChangeFramework.getParentOfType(block, MRC_CLASS_METHOD_DEF);
      
      if (parent) {
        // It is a class method definition, so we see if this variable is in it.
        let classMethodDefBlock = parent as ClassMethodDefBlock;
        for(const parameter of classMethodDefBlock.mrcParameters) {
          if (parameter.name === blockBlock.getFieldValue('PARAMETER_NAME')) {
            // If it is, we allow it to stay.
            blockBlock.setWarningText(null);
            return;
          }
        }
      }
      // If we end up here it shouldn't be allowed
      block.unplug(true);
      blockBlock.setWarningText("Parameters can only go in their method's block.")
    }
  },
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
