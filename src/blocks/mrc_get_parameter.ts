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
 * @fileoverview This is a block that allows your code to use a parameter
 * that is passed to a method.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import {Order} from 'blockly/python';

import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {createFieldNonEditableText} from '../fields/FieldNonEditableText';
import {MRC_STYLE_VARIABLES} from '../themes/styles';
import {BLOCK_NAME as MRC_CLASS_METHOD_DEF, ClassMethodDefBlock} from './mrc_class_method_def';
import {BLOCK_NAME as MRC_EVENT_HANDLER } from './mrc_event_handler';
import * as ChangeFramework from './utils/change_framework';


export const BLOCK_NAME = 'mrc_get_parameter';
export const OUTPUT_NAME = 'mrc_get_parameter_output';


type GetParameterBlock = Blockly.Block & Blockly.BlockSvg & GetParameterMixin;

interface GetParameterMixin extends GetParameterMixinType {}

type GetParameterMixinType = typeof GET_PARAMETER_BLOCK;

const GET_PARAMETER_BLOCK = {
  parameterType: '',  // Later this will be set to the type of the parameter, e.g. 'string', 'number', etc.
  /**
   * Block initialization.
   */
  init: function(this: GetParameterBlock): void {
    this.setStyle(MRC_STYLE_VARIABLES);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PARAMETER)
        .appendField(createFieldNonEditableText('parameter'), 'PARAMETER_NAME');

    this.setOutput(true, this.parameterType);
    ChangeFramework.registerCallback(BLOCK_NAME, [Blockly.Events.BLOCK_MOVE], this.onBlockChanged);
  },
  setNameAndType: function(this: GetParameterBlock, name: string, type: string): void {
    this.setFieldValue(name, 'PARAMETER_NAME');
    this.parameterType = type;
    this.setOutput(true, [OUTPUT_NAME, type]);
  },

  onBlockChanged(block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase): void {
    const blockBlock = block as Blockly.Block;

    if (blockEvent.type === Blockly.Events.BLOCK_MOVE) {
      let parent = blockBlock.getRootBlock();
      if( parent.type === MRC_CLASS_METHOD_DEF) {
        // It is a class method definition, so we see if this variable is in it.
        const classMethodDefBlock = parent as ClassMethodDefBlock;
        for (const parameter of classMethodDefBlock.mrcParameters) {
          if (parameter.name === blockBlock.getFieldValue('PARAMETER_NAME')) {
            // If it is, we allow it to stay.
            blockBlock.setWarningText(null);
            return;
          }
        }
      }
      else if (parent.type === MRC_EVENT_HANDLER) {
        const classMethodDefBlock = parent as ClassMethodDefBlock;
        for (const parameter of classMethodDefBlock.mrcParameters) {
          if (parameter.name === blockBlock.getFieldValue('PARAMETER_NAME')) {
            // If it is, we allow it to stay.
            blockBlock.setWarningText(null);
            return;
          }
        }
      }
      // If we end up here it shouldn't be allowed
      block.unplug(true);
      blockBlock.setWarningText(Blockly.Msg.PARAMETERS_CAN_ONLY_GO_IN_THEIR_METHODS_BLOCK);
    }
  },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = GET_PARAMETER_BLOCK;
};

export const pythonFromBlock = function(
    block: GetParameterBlock,
    _generator: ExtendedPythonGenerator,
) {
  // TODO (Alan) : Specify the type here as well
  const code = block.getFieldValue('PARAMETER_NAME');

  return [code, Order.ATOMIC];
};
