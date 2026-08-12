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
import { createFieldLabeledDropdown, createFieldNumberDropdown } from '../fields/field_number_dropdown';
import {
    PORT_TYPE_DELIMITER,
    PortType,
    portTypeArrayToString,
    portTypeToString,
    stringToPortType,
    stringToPortTypeArray,
    upgradePortTypeString } from './utils/python_json_types';

export const BLOCK_NAME = 'mrc_port';
export const OUTPUT_NAME = 'mrc_port';

const FIELD_PREFIX_TYPE = 'TYPE_';
export const FIELD_PREFIX_PORT_NUM = 'PORT_NUM_';
const INPUT_PREFIX_PORT = 'PORT_';

/**
 * The number of CAN buses on the Systemcore itself. They are numbered 0 through
 * SYSTEMCORE_CAN_BUS_COUNT - 1.
 */
const SYSTEMCORE_CAN_BUS_COUNT = 5;

/**
 * The number of CAN buses provided by a MotionCore. They are labeled MC00 through MC19 and
 * their values follow the Systemcore's own CAN buses.  (So they start with 5...)
 */
const MOTIONCORE_CAN_BUS_COUNT = 20;

const VISIBLE_PORT_LABEL_CAN = 'can';
const VISIBLE_PORT_LABEL_CAN_DEVICE = 'device';
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

  /**
   * mrcDuplicatePortWarning is the DUPLICATE_PORT warning text that we most recently set on
   * the block, or null if there is none. It is checked so that we don't call setWarningText
   * with text that is already there. Otherwise, if we get two events in a row, we get a
   * detached warning balloon.
   * See https://github.com/wpilibsuite/systemcore-blocks-interface/issues/248.
   */
  mrcDuplicatePortWarning: string | null,
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
    this.mrcDuplicatePortWarning = null;
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
        // Note that stringToPortType can return 0, which is a valid PortType.
        if (portType !== null) {
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
      const portNumberField = createFieldDropdownForPortNumber(this.mrcPortTypes[i]);
      // Changing one port number can change whether another one is shown.
      portNumberField.setValidator((value: string) => {
        // The field value hasn't been changed yet, so wait until it has been.
        setTimeout(() => this.mrcUpdatePortNumbersShown(), 0);
        return value;
      });
      this.appendDummyInput(INPUT_PREFIX_PORT + i)
          .appendField(createFieldNonEditableText(''), FIELD_PREFIX_TYPE + i)
          .appendField(portNumberField, FIELD_PREFIX_PORT_NUM + i)
          .setAlign(Blockly.inputs.Align.RIGHT);
    }

    // Set the output check so that this port block can only be plugged into a component or
    // mechanism's input socket that is for this kind of port.
    this.setOutput(true, this.makeOutputCheck());

    // Blockly sets the field values after this method returns, so wait until it has before
    // deciding which port numbers to show. Doing this here rather than from one of the mrc
    // methods means it also happens for the blocks shown in the toolbox flyout, which are
    // in a workspace that doesn't have an editor.
    setTimeout(() => this.mrcUpdatePortNumbersShown(), 0);
  },
  makeOutputCheck(this: PortBlock): string {
    return portTypeArrayToString(this.mrcPortTypes)
  },
  /**
   * Shows or hides each port number. The field values aren't set until after loadExtraState
   * has run, so this is called once the block has been loaded or created, and again whenever
   * a port number changes.
   */
  mrcUpdatePortNumbersShown: function (this: PortBlock): void {
    if (this.isDisposed()) {
      return;
    }
    const portNumbers = this.getPortNumbers();
    for (let i = 0; i < this.mrcPortTypes.length; i++) {
      const input = this.getInput(INPUT_PREFIX_PORT + i);
      if (input) {
        input.setVisible(isPortNumberShown(this.mrcPortTypes, portNumbers, i));
      }
    }
    if (this.rendered) {
      (this as unknown as Blockly.BlockSvg).queueRender();
    }
  },
  /**
   * Returns the port number of each element of this port, whether it is shown or not.
   */
  getPortNumbers: function (this: PortBlock): string[] {
    return this.mrcPortTypes.map(
        (_portType, i) => String(this.getFieldValue(FIELD_PREFIX_PORT_NUM + i) ?? ''));
  },
}

/**
 * Returns whether the given CAN bus is one provided by a MotionCore, rather than one of the
 * Systemcore's own CAN buses.
 */
export function isMotionCoreCanBus(portNumber: string): boolean {
  const busId = Number(portNumber);
  return Number.isInteger(busId) && busId >= SYSTEMCORE_CAN_BUS_COUNT;
}

/**
 * Returns whether the port number of the given element of the given port is shown to the
 * user. A CAN device id is not shown when the CAN bus is provided by a MotionCore, because
 * a MotionCore detects the device id itself.
 */
export function isPortNumberShown(
    portTypes: PortType[], portNumbers: string[], i: number): boolean {
  if (portTypes[i] !== PortType.CAN_DEVICE_ID) {
    return true;
  }
  const iCanBus = portTypes.indexOf(PortType.SYSTEMCORE_CAN_PORT);
  return iCanBus < 0 || !isMotionCoreCanBus(portNumbers[iCanBus]);
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
      return createFieldLabeledDropdown(createCanBusOptions());
    case PortType.CAN_DEVICE_ID:
      return createFieldNumberDropdown(0, 15);
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
 * Returns the given port number as it is shown to the user. For most kinds of ports that is
 * the port number itself, but a CAN bus provided by a MotionCore is shown as MC00 - MC19.
 * This is for code that has the port numbers but doesn't have a block to ask.
 */
export function getDisplayedPortNumber(portType: PortType, portNumber: string): string {
  if (portType === PortType.SYSTEMCORE_CAN_PORT) {
    const option = createCanBusOptions().find(option => option[1] === portNumber);
    if (option) {
      return option[0] as string;
    }
  }
  return portNumber;
}

/**
 * Returns the dropdown options for a CAN bus. The MotionCore buses are listed first,
 * labeled MC00 through MC19, followed by the Systemcore's own buses, labeled 0 through 4.
 * The value stored on the block is always the actual bus id.
 */
function createCanBusOptions(): Blockly.MenuOption[] {
  const options: Blockly.MenuOption[] = [];
  for (let i = 0; i < MOTIONCORE_CAN_BUS_COUNT; i++) {
    const label = 'MC' + i.toString().padStart(2, '0');
    options.push([label, (SYSTEMCORE_CAN_BUS_COUNT + i).toString()]);
  }
  for (let i = 0; i < SYSTEMCORE_CAN_BUS_COUNT; i++) {
    options.push([i.toString(), i.toString()]);
  }
  return options;
}

/**
 * Parses the given string into an array of mrc_port blocks
 *
 * @param portTypeString A single string consisting of one or more port types.
 * Multiple port types are separated by __ (two underscores). Each port type
 * matches one of the PortType enum values.
 * @param defaultPortNumbers The default port numbers, one for each port type, separated by
 * __ (two underscores). Port numbers that are not given default to 0.
 */
export function createPort(portTypeString: string, defaultPortNumbers?: string): any {
  const portTypes = stringToPortTypeArray(portTypeString);
  const portNumbers = defaultPortNumbers
      ? defaultPortNumbers.split(PORT_TYPE_DELIMITER) : [];

  // Based on the port type, specify the appropriate fields. The field numbers match the
  // positions in portTypes, which is what loadExtraState uses when it creates the fields.
  const fields: {[key: string]: any} = {};
  for (let i = 0; i < portTypes.length; i++) {
    const label = getLabelForPort(portTypes[i]);
    if (label) {
      fields[FIELD_PREFIX_TYPE + i] = label;
      fields[FIELD_PREFIX_PORT_NUM + i] = portNumbers[i] || '0';
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

export function getLabelForPort(portType: PortType): string {
  switch (portType) {
    case PortType.SYSTEMCORE_CAN_PORT:
      return VISIBLE_PORT_LABEL_CAN;
    case PortType.CAN_DEVICE_ID:
      return VISIBLE_PORT_LABEL_CAN_DEVICE;
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
