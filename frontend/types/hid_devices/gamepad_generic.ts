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
    ['SOUTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_SOUTH_FACE'], method: 'get_face_down_button', comment: '' }],
    ['EAST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_EAST_FACE'], method: 'get_face_right_button', comment: '' }],
    ['WEST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_WEST_FACE'], method: 'get_face_left_button', comment: '' }],
    ['NORTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_NORTH_FACE'], method: 'get_face_up_button', comment: '' }],
    ['BACK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_BACK'], method: 'get_back_button', comment: '' }],
    ['GUIDE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_GUIDE'], method: 'get_guide_button', comment: '' }],
    ['START', { display: () => Blockly.Msg['GAMEPAD_BUTTON_START'], method: 'get_start_button', comment: '' }],
    ['LEFT_STICK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_STICK'], method: 'get_left_stick_button', comment: '' }],
    ['RIGHT_STICK', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_STICK'], method: 'get_right_stick_button', comment: '' }],
    ['LEFT_BUMPER', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_BUMPER'], method: 'get_left_bumper_button', comment: '' }],
    ['RIGHT_BUMPER', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_BUMPER'], method: 'get_right_bumper_button', comment: '' }],
    ['DPAD_UP', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_UP'], method: 'get_dpad_up_button', comment: '' }],
    ['DPAD_DOWN', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_DOWN'], method: 'get_dpad_down_button', comment: '' }],
    ['DPAD_LEFT', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_LEFT'], method: 'get_dpad_left_button', comment: '' }],
    ['DPAD_RIGHT', { display: () => Blockly.Msg['GAMEPAD_BUTTON_DPAD_RIGHT'], method: 'get_dpad_right_button', comment: '' }],
    ['MISC1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC1'], method: 'get_misc1_button', comment: '' }],
    ['RIGHT_PADDLE_1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_PADDLE_1'], method: 'get_right_paddle1_button', comment: '' }],
    ['LEFT_PADDLE_1', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_PADDLE_1'], method: 'get_left_paddle1_button', comment: '' }],
    ['RIGHT_PADDLE_2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_RIGHT_PADDLE_2'], method: 'get_right_paddle2_button', comment: '' }],
    ['LEFT_PADDLE_2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_LEFT_PADDLE_2'], method: 'get_left_paddle2_button', comment: '' }],
    ['TOUCHPAD', { display: () => Blockly.Msg['GAMEPAD_BUTTON_TOUCHPAD'], method: 'get_touchpad_button', comment: '' }],
    ['MISC2', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC2'], method: 'get_misc2_button', comment: '' }],
    ['MISC3', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC3'], method: 'get_misc3_button', comment: '' }],
    ['MISC4', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC4'], method: 'get_misc4_button', comment: '' }],
    ['MISC5', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC5'], method: 'get_misc5_button', comment: '' }],
    ['MISC6', { display: () => Blockly.Msg['GAMEPAD_BUTTON_MISC6'], method: 'get_misc6_button', comment: '' }],
]);

const AXIS_CONFIG  : Map<string, ConfigEntry> = new Map([
    ['LEFT_STICK_X', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_STICK_X'], method: 'get_left_x', comment: '' }],
    ['LEFT_STICK_Y', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_STICK_Y'], method: 'get_left_y', comment: '' }],
    ['RIGHT_STICK_X', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_STICK_X'], method: 'get_right_x', comment: '' }],
    ['RIGHT_STICK_Y', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_STICK_Y'], method: 'get_right_y', comment: '' }],
    ['LEFT_TRIGGER', { display: () => Blockly.Msg['GAMEPAD_AXIS_LEFT_TRIGGER'], method: 'get_left_trigger_axis', comment: '' }],
    ['RIGHT_TRIGGER', { display: () => Blockly.Msg['GAMEPAD_AXIS_RIGHT_TRIGGER'], method: 'get_right_trigger_axis', comment: '' }],
]);

const RUMBLE_CONFIG : Map<string, RumbleConfigEntry> = new Map([
    ['LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT'], rumbleType: 'LEFT_RUMBLE'}],
    ['RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT'], rumbleType: 'RIGHT_RUMBLE'}],
    ['TRIGGER_LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT_TRIGGER'], rumbleType: 'LEFT_TRIGGER_RUMBLE'}],
    ['TRIGGER_RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT_TRIGGER'], rumbleType: 'RIGHT_TRIGGER_RUMBLE'}],
]);

const LED_CONFIG : Map<string, ConfigEntry> = new Map([
    ['LEDS', { display: () => Blockly.Msg['GAMEPAD_LEDS'], method: 'set_leds', comment: ''}],
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