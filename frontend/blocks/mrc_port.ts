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
 * @fileoverview A block that represents a port.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_PORTS } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldNumberDropdown } from '../fields/field_number_dropdown';
import {
    PortType,
    portTypeArrayToString,
    portTypeToString,
    stringToPortType,
    stringToPortTypeArray,
    upgradePortTypeString } from './utils/python_json_types';

export const BLOCK_NAME = 'mrc_port';
export const OUTPUT_NAME = 'mrc_port';

const FIELD_PREFIX_TYPE = 'TYPE_';
const FIELD_PREFIX_PORT_NUM = 'PORT_NUM_';

const VISIBLE_PORT_LABEL_CAN = 'can';
const VISIBLE_PORT_LABEL_SMART_IO = 'smart i/o';
const VISIBLE_PORT_LABEL_I2C = 'i2c';
const VISIBLE_PORT_LABEL_USB = 'usb';
const VISIBLE_PORT_LABEL_MOTIONCORE = 'MotionCore port';
const VISIBLE_PORT_LABEL_ENCODER = 'encoder';
const VISIBLE_PORT_LABEL_USB_HUB = 'usb hub';
const VISIBLE_PORT_LABEL_MOTOR = 'motor';
const VISIBLE_PORT_LABEL_SERVO = 'servo';

export type PortBlock = Blockly.Block & PortMixin;
interface PortMixin extends PortMixinType {
  mrcPortTypes: PortType[],
}
type PortMixinType = typeof PORT;

type PortExtraState = {
  // TODO: Remove portType in the near future.
  // A single string consisting of one or more port types. Multiple port types are
  // separated by __ (two underscores). Each port type matches one of the PortType
  // enum values in src/storage/module_content.ts.
  portType?: string,

  portTypes?: string[],
}

const PORT = {
  /**
    * Block initialization.
    */
  init: function (this: PortBlock): void {
    this.mrcPortTypes = [];
    this.setStyle(MRC_STYLE_PORTS);
    this.setOutput(true);
  },

  /**
   * Save the ports to the block's extra state.
   */
  saveExtraState: function (this: PortBlock): PortExtraState {
    const state: PortExtraState = {
      portTypes: this.mrcPortTypes.map((portType) => portTypeToString(portType)),
    };
    return state;
  },

  /**
   * Load the ports from the block's extra state.
   */
  loadExtraState: function (this: PortBlock, state: PortExtraState): void {
    if (state.portTypes) {
      state.portTypes.forEach((s) => {
        const portType = stringToPortType(s);
        if (portType) {
          this.mrcPortTypes.push(portType);
        }
      });
    } else if (state.portType) {
      const upgradedPortType = upgradePortTypeString(state.portType);
      this.mrcPortTypes.push(...stringToPortTypeArray(upgradedPortType));
    }

    // Now create one input for each element of this.mrcPortTypes.
    for (let i = 0; i < this.mrcPortTypes.length; i++) {
      // Create the field but don't set the field value. The field value will be
      // set by blockly as the block is loaded.
      this.appendDummyInput()
          .appendField(createFieldNonEditableText(''), FIELD_PREFIX_TYPE + i)
          .appendField(createFieldDropdownForPortNumber(this.mrcPortTypes[i]), FIELD_PREFIX_PORT_NUM + i)
          .setAlign(Blockly.inputs.Align.RIGHT);
    }

    // Set the output check so that this port block can only be plugged into a component or
    // mechanism's input socket that is for this kind of port.
    this.setOutput(true, this.makeOutputCheck());
  },
  makeOutputCheck(this: PortBlock): string {
    return portTypeArrayToString(this.mrcPortTypes)
  },
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = PORT;
}

export const pythonFromBlock = function (
    block: PortBlock,
    _: ExtendedPythonGenerator) {
  let code = '';
  for (let i = 0; i < block.mrcPortTypes.length; i++) {
    const portNum = block.getFieldValue(FIELD_PREFIX_PORT_NUM + i);
    const portLabel = getLabelForPort(block.mrcPortTypes[i]);
    code += portNum + ', # ' + portLabel + '\n';
  }
  return [code, Order.NONE];
}

function createFieldDropdownForPortNumber(portType: PortType): Blockly.Field {
  switch (portType) {
    case PortType.SYSTEMCORE_CAN_PORT:
      return createFieldNumberDropdown(0, 4);
    case PortType.SYSTEMCORE_SMART_IO_PORT:
      return createFieldNumberDropdown(0, 5);
    case PortType.SYSTEMCORE_I2C_PORT:
      return createFieldNumberDropdown(0, 1);
    case PortType.SYSTEMCORE_USB_PORT:
      return createFieldNumberDropdown(0, 3);
    case PortType.EXPANSION_HUB_MOTOR_PORT:
      return createFieldNumberDropdown(0, 3);
    case PortType.EXPANSION_HUB_SERVO_PORT:
      return createFieldNumberDropdown(0, 5);
    case PortType.MOTIONCORE_DEVICE_PORT:
      return createFieldNumberDropdown(0, 19);
    case PortType.MOTIONCORE_ENCODER_PORT:
      return createFieldNumberDropdown(0, 3);
    case PortType.USB_HUB_PORT:
      // TODO: How many ports are on a USB hub? Some have 2, some have 4. Should they be numbered 0..N-1 or 1..N?
      return createFieldNumberDropdown(0, 3);
    default:
      throw new Error('Unexpected portType: ' + portType)
  }
}

/**
 * Parses the given string into an array of PortType.
 *
 * @param portTypeString A single string consisting of one or more port types.
 * Multiple port types are separated by __ (two underscores). Each port type
 * matches one of the PortType enum values.
 */
export function createPort(portTypeString: string): any {
  const portTypes = stringToPortTypeArray(portTypeString);

  // Based on the port type, specify the appropriate fields.
  const fields: {[key: string]: any} = {};
  let iField = 0;
  for (const portType of portTypes) {
    const label = getLabelForPort(portType);
    if (label) {
      fields[FIELD_PREFIX_TYPE + iField] = label;
      fields[FIELD_PREFIX_PORT_NUM + iField] = '0';
      iField++;
    }
  }
  const extraState: PortExtraState = {
    portTypes: portTypes.map((portType) => portTypeToString(portType)),
  };
  return {
    block: {
      type: BLOCK_NAME,
      extraState,
      fields,
    },
  };
}

function getLabelForPort(portType: PortType): string {
  switch (portType) {
    case PortType.SYSTEMCORE_CAN_PORT:
      return VISIBLE_PORT_LABEL_CAN;
    case PortType.SYSTEMCORE_SMART_IO_PORT:
      return VISIBLE_PORT_LABEL_SMART_IO;
    case PortType.SYSTEMCORE_I2C_PORT:
      return VISIBLE_PORT_LABEL_I2C;
    case PortType.SYSTEMCORE_USB_PORT:
      return VISIBLE_PORT_LABEL_USB;
    case PortType.EXPANSION_HUB_MOTOR_PORT:
      return VISIBLE_PORT_LABEL_MOTOR;
    case PortType.EXPANSION_HUB_SERVO_PORT:
      return VISIBLE_PORT_LABEL_SERVO;
    case PortType.MOTIONCORE_DEVICE_PORT:
      return VISIBLE_PORT_LABEL_MOTIONCORE;
    case PortType.MOTIONCORE_ENCODER_PORT:
      return VISIBLE_PORT_LABEL_ENCODER;
    case PortType.USB_HUB_PORT:
      return VISIBLE_PORT_LABEL_USB_HUB;
  }
  console.error('Unknown port type ' + portType);
  return '';
}
