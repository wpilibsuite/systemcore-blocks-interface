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

// PortType enum values defined in external_samples/port.py.
const PORT_TYPE_CAN_PORT = 'CAN_PORT';
const PORT_TYPE_SMART_IO_PORT = 'SMART_IO_PORT';
const PORT_TYPE_I2C_PORT = 'I2C_PORT';
const PORT_TYPE_USB_PORT = 'USB_PORT';
const PORT_TYPE_SMART_MOTOR_PORT = 'SMART_MOTOR_PORT';
const PORT_TYPE_USB_HUB_PORT = 'USB_HUB_PORT';
const PORT_TYPE_EXPANSION_HUB_MOTOR_PORT = 'EXPANSION_HUB_MOTOR_PORT';
const PORT_TYPE_EXPANSION_HUB_SERVO_PORT = 'EXPANSION_HUB_SERVO_PORT';
const PORT_TYPE_USB_HUB = 'USB_HUB';
const PORT_TYPE_EXPANSION_HUB_MOTOR = 'EXPANSION_HUB_MOTOR';
const PORT_TYPE_EXPANSION_HUB_SERVO = 'EXPANSION_HUB_SERVO';

const FIELD_PREFIX_TYPE = 'TYPE_';
const FIELD_PREFIX_PORT_NUM = 'PORT_NUM_';

const VISIBLE_PORT_LABEL_CAN = 'can';
const VISIBLE_PORT_LABEL_SMART_IO = 'smart i/o';
const VISIBLE_PORT_LABEL_I2C = 'i2c';
const VISIBLE_PORT_LABEL_USB = 'usb';
const VISIBLE_PORT_LABEL_MOTIONCORE = 'MotionCore port';
const VISIBLE_PORT_LABEL_USB_HUB = 'usb hub';
const VISIBLE_PORT_LABEL_MOTOR = 'motor';
const VISIBLE_PORT_LABEL_SERVO = 'servo';

export type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
  mrcPortType: string,
  mrcPortCount: number,
}
type PortMixinType = typeof PORT;

type PortExtraState = {
  portType: string,
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
    };

    return state;
  },

  /**
   * Load the ports from the block's extra state.
   */
  loadExtraState: function (this: PortBlock, state: PortExtraState): void {
    let iField = 0;
    switch (state.portType) {
      case PORT_TYPE_CAN_PORT:
      case PORT_TYPE_SMART_IO_PORT:
      case PORT_TYPE_I2C_PORT:
      case PORT_TYPE_USB_PORT:
      case PORT_TYPE_SMART_MOTOR_PORT:
      case PORT_TYPE_USB_HUB_PORT:
      case PORT_TYPE_EXPANSION_HUB_MOTOR_PORT:
      case PORT_TYPE_EXPANSION_HUB_SERVO_PORT:
        appendFields(this.appendDummyInput(), state.portType, iField++);
        break;
      case PORT_TYPE_USB_HUB:
        appendFields(this.appendDummyInput(), PORT_TYPE_USB_PORT, iField++);
        appendFields(this.appendDummyInput(), PORT_TYPE_USB_HUB_PORT, iField++);
        break;
      case PORT_TYPE_EXPANSION_HUB_MOTOR:
        appendFields(this.appendDummyInput(), PORT_TYPE_USB_PORT, iField++);
        appendFields(this.appendDummyInput(), PORT_TYPE_EXPANSION_HUB_MOTOR_PORT, iField++);
        break;
      case PORT_TYPE_EXPANSION_HUB_SERVO:
        appendFields(this.appendDummyInput(), PORT_TYPE_USB_PORT, iField++);
        appendFields(this.appendDummyInput(), PORT_TYPE_EXPANSION_HUB_SERVO_PORT, iField++);
        break;
      default:
        throw new Error('Unexpected portType: ' + state.portType);
    }
    this.mrcPortType = state.portType;
    this.mrcPortCount = iField;
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = PORT;
}

export const pythonFromBlock = function (
    block: PortBlock,
    generator: ExtendedPythonGenerator) {

  const ports: string[] = [];
  for (let i = 0; i < block.mrcPortCount; i++) {
    ports.push(block.getFieldValue(FIELD_PREFIX_PORT_NUM + i));
  }

  const portType = generator.importModuleName('port', 'PortType');
  const simplePort = generator.importModuleName('port', 'SimplePort');
  const compoundPort = (ports.length === 2) ? generator.importModuleName('port', 'CompoundPort') : '';

  let code = '';

  if (ports.length === 1) {
     code += `${simplePort}(port_type = ${portType}.${block.mrcPortType}, location = ${ports[0]})`;

  } else if (ports.length === 2) {
    let port1Type = 'UNKNOWN';
    let port2Type = 'UNKNOWN';

    switch (block.mrcPortType) {
      case PORT_TYPE_USB_HUB:
        port1Type = PORT_TYPE_USB_PORT;
        port2Type = PORT_TYPE_USB_HUB_PORT;
        break;
      case PORT_TYPE_EXPANSION_HUB_MOTOR:
        port1Type = PORT_TYPE_USB_PORT;
        port2Type = PORT_TYPE_EXPANSION_HUB_MOTOR_PORT;
        break;
      case PORT_TYPE_EXPANSION_HUB_SERVO:
        port1Type = PORT_TYPE_USB_PORT;
        port2Type = PORT_TYPE_EXPANSION_HUB_SERVO_PORT;
        break;
    }
    code += `${compoundPort}(port_type = ${portType}.${block.mrcPortType},\n`;
    code += `${generator.INDENT}port1 = ${simplePort}(port_type = ${portType}.${port1Type}, location = ${ports[0]}),\n`;
    code += `${generator.INDENT}port2 = ${simplePort}(port_type = ${portType}.${port2Type}, location = ${ports[1]}))`;
  }

  return [code, Order.FUNCTION_CALL];
}

function appendFields(input: Blockly.Input, portType: string, iField: number): void {
  // Create the fields but don't set the field values. The field values will be
  // set by blockly as the block is loaded.
  input
      .appendField(createFieldNonEditableText(''), FIELD_PREFIX_TYPE + iField)
      .appendField(createFieldDropdownForPortNumber(portType), FIELD_PREFIX_PORT_NUM + iField)
      .setAlign(Blockly.inputs.Align.RIGHT);
}

function createFieldDropdownForPortNumber(portType: string): Blockly.Field {
  switch (portType) {
    case PORT_TYPE_CAN_PORT:
      return createFieldNumberDropdown(0, 4);
    case PORT_TYPE_SMART_IO_PORT:
      return createFieldNumberDropdown(0, 5);
    case PORT_TYPE_I2C_PORT:
      return createFieldNumberDropdown(0, 1);
    case PORT_TYPE_USB_PORT:
      return createFieldNumberDropdown(0, 3);
    case PORT_TYPE_SMART_MOTOR_PORT:
      return createFieldNumberDropdown(1, 6);
    case PORT_TYPE_USB_HUB_PORT:
      // TODO: How many ports are on a USB hub? Some have 2, some have 4. Should they be numbered 0..N-1 or 1..N?
      return createFieldNumberDropdown(0, 3);
    case PORT_TYPE_EXPANSION_HUB_MOTOR_PORT:
      return createFieldNumberDropdown(0, 4);
    case PORT_TYPE_EXPANSION_HUB_SERVO_PORT:
      return createFieldNumberDropdown(0, 5);
    default:
      throw new Error('Unexpected portType: ' + portType)
  }
}

export function createPort(portType: string): any {
  // Based on the port type, specify the appropriate fields.
  const fields: {[key: string]: any} = {};
  let iField = 0;
  switch (portType) {
    case PORT_TYPE_CAN_PORT:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_CAN;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_SMART_IO_PORT:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_SMART_IO;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_I2C_PORT:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_I2C;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_USB_PORT:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_USB;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_SMART_MOTOR_PORT:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_MOTIONCORE;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_USB_HUB:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_USB;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      iField++;
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_USB_HUB;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_EXPANSION_HUB_MOTOR:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_USB;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      iField++;
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_MOTOR;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
    case PORT_TYPE_EXPANSION_HUB_SERVO:
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_USB;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      iField++;
      fields[FIELD_PREFIX_TYPE + iField] = VISIBLE_PORT_LABEL_SERVO;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '1';
      break;
  }
  const extraState: PortExtraState = {
    portType: portType,
  };
  return {
    block: {
      type: BLOCK_NAME,
      extraState,
      fields,
    },
  };
}
