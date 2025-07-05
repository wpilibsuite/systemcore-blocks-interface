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

import { MRC_STYLE_PORTS } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';

export const BLOCK_NAME = 'mrc_port';
export const OUTPUT_NAME = 'mrc_port';


type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
}
type PortMixinType = typeof PORT;

const PORT = {
  /**
    * Block initialization.
    */
  init: function (this: PortBlock): void {
    this.setStyle(MRC_STYLE_PORTS);
    this.appendDummyInput()
      .appendField(createFieldNonEditableText(''), 'TYPE')
      .appendField(new Blockly.FieldTextInput(''), 'PORT_NUM');

    //this.setOutput(true, OUTPUT_NAME);
    this.setOutput(true);
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = PORT;
}

export const pythonFromBlock = function (
  block: PortBlock,
  generator: ExtendedPythonGenerator,
) {
    //TODO (Alan) : Specify the type here as well
    let code = block.getFieldValue('PORT_NUM');
    
    return [code, Order.ATOMIC];
}

export function createPortShadow(portType: string, portNum: int) {
  return {
    shadow: {
      type: 'mrc_port',
      fields: {
        TYPE: portType,
        PORT_NUM: portNum,
      },
    },
  };
}
