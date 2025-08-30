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

export const BLOCK_NAME = 'mrc_port';
export const OUTPUT_NAME = 'mrc_port';

export type MrcPortType = {
  portType: string,
  portNumber: number,
};

type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
  ports_ : MrcPortType[],
}
type PortMixinType = typeof PORT;

type PortExtraState = {
  /**
   * The ports.
   * For instance methods, args[0].name is the self label and args[0].type is
   * the self type.
   */
  ports: MrcPortType[],
}

const PORT = {
  /**
    * Block initialization.
    */
  init: function (this: PortBlock): void {
    this.setStyle(MRC_STYLE_PORTS);
    this.setOutput(true);
  },

  /**
   * Save the ports to the block's extra state.
   */
  saveExtraState: function (this: PortBlock): PortExtraState {
    const state: PortExtraState = {
      ports: this.ports_
    };

    return state;
  },

  /**
   * Load the ports from the block's extra state.
   */
  loadExtraState: function (this: PortBlock, state: PortExtraState): void {
    this.ports_ = state.ports || [];
    this.updateShape_();
  },

  /**
   * Update the block's shape based on the current ports.
   */
  updateShape_: function (this: PortBlock): void {
    // Remove all existing inputs
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const input = this.inputList[i];
      if (input && (input.name.startsWith('PORT_'))) {
        this.removeInput(input.name, true);
      }
    }

    // Initialize ports if not set
    if (!this.ports_) {
      this.ports_ = [{ portType: '', portNumber: 0 }];
    }

    // Add inputs for each port
    for (let i = 0; i < this.ports_.length; i++) {
      const port = this.ports_[i];
      this.appendDummyInput('PORT_' + i)
        .appendField(createFieldNonEditableText(port.portType), 'TYPE_' + i)
        .appendField(new Blockly.FieldTextInput(port.portNumber.toString()), 'PORT_NUM_' + i)
        .setAlign(Blockly.inputs.Align.RIGHT);
    }
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = PORT;
}

export const pythonFromBlock = function (
    block: PortBlock,
    _generator: ExtendedPythonGenerator) {
  const ports: string[] = [];
  
  for (let i = 0; i < block.inputList.length; i++) {
    const input = block.inputList[i];
    if (input.name.startsWith('PORT_')) {
      const portNumField = input.fieldRow.find(field => field.name === 'PORT_NUM_' + i);
      if (portNumField) {
        ports.push(portNumField.getValue() as string);
      }
    }
  }
  
  const code = ports.length === 1 ? ports[0] : `[${ports.join(', ')}]`;
  return [code, Order.ATOMIC];
}

export function createPortShadow(portType : string) {
  //TODO: Based off of the port type, create the right number and type of ports
  const ports : MrcPortType[] = [];
  switch(portType){
    case 'CAN_PORT':
      ports.push({ portType: 'can', portNumber: 1 });
      break;
    case 'SMART_IO_PORT':
      ports.push({ portType: 'smartio', portNumber: 1 });
      break;
    case 'SMART_MOTOR_PORT':
      ports.push({ portType: 'MotionCore port', portNumber: 1 });
      break;
    case 'SERVO_PORT':
      ports.push({ portType: 'servo', portNumber: 1 });
      break;
    case 'I2C_PORT':
      ports.push({ portType: 'i2c', portNumber: 1 });
      break;
    case 'USB_PORT':
      ports.push({ portType: 'usb', portNumber: 1 });
      break;
    case 'EXPANSION_HUB_MOTOR_PORT':
      ports.push({ portType: 'motor', portNumber: 1 });
      break;
    case 'EXPANSION_HUB_SERVO_PORT':
      ports.push({ portType: 'servo', portNumber: 1 });
      break;
    case 'SMART_MOTOR_PORT':
      ports.push({ portType: 'MotionCore port', portNumber: 1 });
      break;
    case 'USB_HUB':
      ports.push({ portType: 'usb in', portNumber: 1 });
      ports.push({ portType: 'usb out', portNumber: 1 });
      break;
    case 'EXPANSION_HUB_MOTOR':
      ports.push({ portType: 'usb in', portNumber: 1 });
      ports.push({ portType: 'motor', portNumber: 1 });
      break;
    case 'EXPANSION_HUB_SERVO':
      ports.push({ portType: 'usb in', portNumber: 1 });
      ports.push({ portType: 'servo', portNumber: 1 });
      break;
    default:
      ports.push({ portType: 'unknown', portNumber: 1 });
      break;
  }
  return {
    shadow: {
      type: 'mrc_port',
      extraState: {
        ports: ports.map(port => ({
          portType: port.portType,
          portNumber: port.portNumber
        }))
      },
    },
  };
}
