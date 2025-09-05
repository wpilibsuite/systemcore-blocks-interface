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
import { createFieldNumberDropdown } from '../fields/field_number_dropdown';

export const BLOCK_NAME = 'mrc_port';
export const OUTPUT_NAME = 'mrc_port';

export type MrcPortType = {
  portType: string,
  portNumber: number,
};

type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
  portType_ : string,
  ports_ : MrcPortType[],
}
type PortMixinType = typeof PORT;

type PortExtraState = {
  //TODO(Alan) - Figure out how to not have this duplicated for a simple port
  portType: string,
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
      portType: this.portType_,
      ports: this.ports_
    };

    return state;
  },

  /**
   * Load the ports from the block's extra state.
   */
  loadExtraState: function (this: PortBlock, state: PortExtraState): void {
    this.portType_ = state.portType || '';
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
        .appendField(createFieldDropdownForPortType(port.portType, port.portNumber), 'PORT_NUM_' + i)
        .setAlign(Blockly.inputs.Align.RIGHT);
    }
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = PORT;
}

export const pythonFromBlock = function (
    block: PortBlock,
    generator: ExtendedPythonGenerator) {
  generator.addImport('port');
  
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
  let code = 'port.';
  
  if (ports.length === 1) {
     code += `SimplePort(port_type = port.PortType.${block.portType_}, location = ${ports[0]})`;

  } else if (ports.length === 2) {
    let port1Type = 'UNKNOWN';
    let port2Type = 'UNKNOWN';

    switch (block.portType_) {
      case 'USB_HUB':
        port1Type = 'USB_PORT';
        port2Type = 'USB_PORT';
        break;
      case 'EXPANSION_HUB_MOTOR':
        port1Type = 'USB_PORT';
        port2Type = 'EXPANSION_HUB_MOTOR_PORT';
        break;
      case 'EXPANSION_HUB_SERVO':
        port1Type = 'USB_PORT';
        port2Type = 'EXPANSION_HUB_SERVO_PORT';
        break;
    }
    code += `CompoundPort(port_type = port.PortType.${block.portType_},`;
    code += `\\ \n${generator.INDENT}port1 = port.SimplePort(port_type = port.PortType.${port1Type}, location = ${ports[0]}), `;
    code += `\\ \n${generator.INDENT}port2 = port.SimplePort(port_type = port.PortType.${port2Type}, location = ${ports[1]}))`;
  }

  return [code, Order.ATOMIC];
}

function createFieldDropdownForPortType(portType: string, defaultVal: number): Blockly.Field {
  switch (portType) {
    case 'can':
      return createFieldNumberDropdown(0, 4, defaultVal);
    case 'smartio':
      return createFieldNumberDropdown(0, 5, defaultVal);
    case 'MotionCore port':
      return createFieldNumberDropdown(1, 6, defaultVal);
    case 'i2c':
      return createFieldNumberDropdown(0, 1, defaultVal);
    case 'usb in':
      return createFieldNumberDropdown(0, 3, defaultVal);
    case 'motor':
      return createFieldNumberDropdown(1, 6, defaultVal);
    case 'servo':
      return createFieldNumberDropdown(1, 6, defaultVal);
    default:
      return createFieldNumberDropdown(0, 99, defaultVal);
  }
}

export function createPort(portType: string) {
  // Based off of the port type, create the right number and type of ports
  const ports: MrcPortType[] = [];
  switch (portType) {
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
      ports.push({ portType: 'unknown' + portType, portNumber: 1 });
      break;
  }
  return {
    block: {
      type: 'mrc_port',
      extraState: {
        portType: portType,
        ports: ports.map(port => ({
          portType: port.portType,
          portNumber: port.portNumber
        }))
      },
    },
  };
}
