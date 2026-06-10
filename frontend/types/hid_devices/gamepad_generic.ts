/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

export type ConfigEntry = {
  display: () => string;
  method: string;
  comment: string;
};

export type RumbleConfigEntry = {
  display: () => string;
  rumbleType: string;
};

const BUTTON_CONFIG : Map<string, ConfigEntry> = new Map([
    ['SOUTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_SOUTH_FACE'], method: 'getSouthFaceButton', comment: '' }],
    ['EAST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_EAST_FACE'], method: 'getEastFaceButton', comment: '' }],
    ['WEST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_WEST_FACE'], method: 'getWestFaceButton', comment: '' }],
    ['NORTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_NORTH_FACE'], method: 'getNorthFaceButton', comment: '' }],
    ['BACK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_BACK'], method: 'getBackButton', comment: '' }],
    ['GUIDE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_GUIDE'], method: 'getGuideButton', comment: '' }],
    ['START', { display: () => Blockly.Msg['GAMEPAD_BUTTON_START'], method: 'getStartButton', comment: '' }],
    ['LEFT_STICK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_STICK'], method: 'getLeftStickButton', comment: '' }],
    ['RIGHT_STICK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_STICK'], method: 'getRightStickButton', comment: '' }],
    ['LEFT_BUMPER', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_BUMPER'], method: 'getLeftBumperButton', comment: '' }],
    ['RIGHT_BUMPER', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_BUMPER'], method: 'getRightBumperButton', comment: '' }],
    ['DPAD_UP', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_UP'], method: 'getDpadUpButton', comment: '' }],
    ['DPAD_DOWN', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_DOWN'], method: 'getDpadDownButton', comment: '' }],
    ['DPAD_LEFT', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_LEFT'], method: 'getDpadLeftButton', comment: '' }],
    ['DPAD_RIGHT', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_RIGHT'], method: 'getDpadRightButton', comment: '' }],
    ['MISC1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC1'], method: 'getMisc1Button', comment: '' }],
    ['RIGHT_PADDLE_1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_PADDLE_1'], method: 'getRightPaddle1Button', comment: '' }],
    ['LEFT_PADDLE_1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_PADDLE_1'], method: 'getLeftPaddle1Button', comment: '' }],
    ['RIGHT_PADDLE_2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_PADDLE_2'], method: 'getRightPaddle2Button', comment: '' }],
    ['LEFT_PADDLE_2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_PADDLE_2'], method: 'getLeftPaddle2Button', comment: '' }],
    ['TOUCHPAD', { display: () => Blockly.Msg['GAMEPAD_BUTTON_TOUCHPAD'], method: 'getTouchpadButton', comment: '' }],
    ['MISC2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC2'], method: 'getMisc2Button', comment: '' }],
    ['MISC3', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC3'], method: 'getMisc3Button', comment: '' }],
    ['MISC4', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC4'], method: 'getMisc4Button', comment: '' }],
    ['MISC5', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC5'], method: 'getMisc5Button', comment: '' }],
    ['MISC6', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC6'], method: 'getMisc6Button', comment: '' }],
]);

const AXIS_CONFIG  : Map<string, ConfigEntry> = new Map([
    ['LEFT_STICK_X', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_STICK_X'], method: 'getLeftX', comment: '' }],
    ['LEFT_STICK_Y', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_STICK_Y'], method: 'getLeftY', comment: '' }],
    ['RIGHT_STICK_X', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_STICK_X'], method: 'getRightX', comment: '' }],
    ['RIGHT_STICK_Y', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_STICK_Y'], method: 'getRightY', comment: '' }],
    ['LEFT_TRIGGER', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_TRIGGER'], method: 'getLeftTriggerAxis', comment: '' }],
    ['RIGHT_TRIGGER', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_TRIGGER'], method: 'getRightTriggerAxis', comment: '' }],
]);

const RUMBLE_CONFIG : Map<string, RumbleConfigEntry> = new Map([
    ['LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT'], rumbleType: 'kLeftRumble'}],
    ['RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT'], rumbleType: 'kRightRumble'}],
    ['TRIGGER_LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT_TRIGGER'], rumbleType: 'kLeftTriggerRumble'}],
    ['TRIGGER_RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT_TRIGGER'], rumbleType: 'kRightTriggerRumble'}],
]);

const LED_CONFIG : Map<string, ConfigEntry> = new Map([
    ['LEDS', { display: () => Blockly.Msg['GAMEPAD_LEDS'], method: 'setLeds', comment: ''}],
]);


/** Returns the button configuration for generic gamepad. */
export function getButtonConfig() {
    return BUTTON_CONFIG;
}

/** Returns the axis configuration for generic gamepad. */
export function getAxisConfig() {
    return AXIS_CONFIG;
}

/** Returns the rumble configuration for generic gamepad. */
export function getRumbleConfig() {
    return RUMBLE_CONFIG;
}

/** Returns the LED configuration for generic gamepad. */
export function getLEDConfig() {
    return LED_CONFIG;
}

//TODO(alan): Touchpad fingers not supported yet in this version