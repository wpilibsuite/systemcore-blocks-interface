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

const FIELD_PREFIX_TYPE = 'TYPE_';
const FIELD_PREFIX_PORT_NUM = 'PORT_NUM_';

const VISIBLE_PORT_TYPE_CAN = 'can';
const VISIBLE_PORT_TYPE_SMART_IO = 'smartio';
const VISIBLE_PORT_TYPE_SMART_MOTOR = 'MotionCore port';
const VISIBLE_PORT_TYPE_I2C = 'i2c';
const VISIBLE_PORT_TYPE_USB = 'usb';
const VISIBLE_PORT_TYPE_MOTOR = 'motor';
const VISIBLE_PORT_TYPE_SERVO = 'servo';
const VISIBLE_PORT_TYPE_USB_HUB_IN = 'usb in';
const VISIBLE_PORT_TYPE_USB_HUB_OUT = 'usb out';

type MrcPortType = {
  portType: string,
  portNumber: number,
};

type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
  mrcPortType: string,
  mrcPorts: MrcPortType[],
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
      portType: this.mrcPortType,
      ports: this.mrcPorts
    };

    return state;
  },

  /**
   * Load the ports from the block's extra state.
   */
  loadExtraState: function (this: PortBlock, state: PortExtraState): void {
    this.mrcPortType = state.portType || '';
    this.mrcPorts = state.ports || [];

    // Add an input for each port.
    for (let i = 0; i < this.mrcPorts.length; i++) {
      const port = this.mrcPorts[i];
      this.appendDummyInput()
        .appendField(createFieldNonEditableText(port.portType), FIELD_PREFIX_TYPE + i)
        .appendField(createFieldDropdownForPortType(port.portType, port.portNumber), FIELD_PREFIX_PORT_NUM + i)
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

  for (let i = 0; i < block.mrcPorts.length; i++) {
    ports.push(block.getFieldValue(FIELD_PREFIX_PORT_NUM + i));
  }
  let code = 'port.';
  
  if (ports.length === 1) {
     code += `SimplePort(port_type = port.PortType.${block.mrcPortType}, location = ${ports[0]})`;

  } else if (ports.length === 2) {
    let port1Type = 'UNKNOWN';
    let port2Type = 'UNKNOWN';

    switch (block.mrcPortType) {
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
    code += `CompoundPort(port_type = port.PortType.${block.mrcPortType},\n`;
    code += `${generator.INDENT}port1 = port.SimplePort(port_type = port.PortType.${port1Type}, location = ${ports[0]}),\n`;
    code += `${generator.INDENT}port2 = port.SimplePort(port_type = port.PortType.${port2Type}, location = ${ports[1]}))`;
  }

  return [code, Order.ATOMIC];
}

function createFieldDropdownForPortType(portType: string, defaultVal: number): Blockly.Field {
  switch (portType) {
    case VISIBLE_PORT_TYPE_CAN:
      return createFieldNumberDropdown(0, 4, defaultVal);
    case VISIBLE_PORT_TYPE_SMART_IO:
      return createFieldNumberDropdown(0, 5, defaultVal);
    case VISIBLE_PORT_TYPE_SMART_MOTOR:
      return createFieldNumberDropdown(1, 6, defaultVal);
    case VISIBLE_PORT_TYPE_I2C:
      return createFieldNumberDropdown(0, 1, defaultVal);
    case VISIBLE_PORT_TYPE_USB_HUB_IN:
      return createFieldNumberDropdown(0, 3, defaultVal);
    case VISIBLE_PORT_TYPE_MOTOR:
      return createFieldNumberDropdown(1, 6, defaultVal);
    case VISIBLE_PORT_TYPE_SERVO:
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
      ports.push({ portType: VISIBLE_PORT_TYPE_CAN, portNumber: 1 });
      break;
    case 'SMART_IO_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_SMART_IO, portNumber: 1 });
      break;
    case 'SMART_MOTOR_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_SMART_MOTOR, portNumber: 1 });
      break;
    case 'SERVO_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_SERVO, portNumber: 1 });
      break;
    case 'I2C_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_I2C, portNumber: 1 });
      break;
    case 'USB_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_USB, portNumber: 1 });
      break;
    case 'EXPANSION_HUB_MOTOR_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_MOTOR, portNumber: 1 });
      break;
    case 'EXPANSION_HUB_SERVO_PORT':
      ports.push({ portType: VISIBLE_PORT_TYPE_SERVO, portNumber: 1 });
      break;
    case 'USB_HUB':
      ports.push({ portType: VISIBLE_PORT_TYPE_USB_HUB_IN, portNumber: 1 });
      ports.push({ portType: VISIBLE_PORT_TYPE_USB_HUB_OUT, portNumber: 1 });
      break;
    case 'EXPANSION_HUB_MOTOR':
      ports.push({ portType: VISIBLE_PORT_TYPE_USB_HUB_IN, portNumber: 1 });
      ports.push({ portType: VISIBLE_PORT_TYPE_MOTOR, portNumber: 1 });
      break;
    case 'EXPANSION_HUB_SERVO':
      ports.push({ portType: VISIBLE_PORT_TYPE_USB_HUB_IN, portNumber: 1 });
      ports.push({ portType: VISIBLE_PORT_TYPE_SERVO, portNumber: 1 });
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
