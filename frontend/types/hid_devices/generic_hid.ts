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
import * as GenericGamepad from './gamepad_generic';

const BUTTON_CONFIG = new Map([
    ['1', { display: () => '1', method: 'get_raw_button(1)', comment: '' }],
    ['2', { display: () => '2', method: 'get_raw_button(2)', comment: '' }],
    ['3', { display: () => '3', method: 'get_raw_button(3)', comment: '' }],
    ['4', { display: () => '4', method: 'get_raw_button(4)', comment: '' }],
    ['5', { display: () => '5', method: 'get_raw_button(5)', comment: '' }],
    ['6', { display: () => '6', method: 'get_raw_button(6)', comment: '' }],
    ['7', { display: () => '7', method: 'get_raw_button(7)', comment: '' }],
    ['8', { display: () => '8', method: 'get_raw_button(8)', comment: '' }],
    ['9', { display: () => '9', method: 'get_raw_button(9)', comment: '' }],
    ['10', { display: () => '10', method: 'get_raw_button(10)', comment: '' }],
    ['11', { display: () => '11', method: 'get_raw_button(11)', comment: '' }],
    ['12', { display: () => '12', method: 'get_raw_button(12)', comment: '' }],
    ['13', { display: () => '13', method: 'get_raw_button(13)', comment: '' }],
    ['14', { display: () => '14', method: 'get_raw_button(14)', comment: '' }],
    ['15', { display: () => '15', method: 'get_raw_button(15)', comment: '' }],
    ['16', { display: () => '16', method: 'get_raw_button(16)', comment: '' }],
]);

const AXIS_CONFIG = new Map([
    ['1', { display: () => '1', method: 'get_raw_axis(1)', comment: '' }],
    ['2', { display: () => '2', method: 'get_raw_axis(2)', comment: '' }],
    ['3', { display: () => '3', method: 'get_raw_axis(3)', comment: '' }],
    ['4', { display: () => '4', method: 'get_raw_axis(4)', comment: '' }],
    ['5', { display: () => '5', method: 'get_raw_axis(5)', comment: '' }],
    ['6', { display: () => '6', method: 'get_raw_axis(6)', comment: '' }],
    ['7', { display: () => '7', method: 'get_raw_axis(7)', comment: '' }],
    ['8', { display: () => '8', method: 'get_raw_axis(8)', comment: '' }],
    ['9', { display: () => '9', method: 'get_raw_axis(9)', comment: '' }],
    ['10', { display: () => '10', method: 'get_raw_axis(10)', comment: '' }],
    ['11', { display: () => '11', method: 'get_raw_axis(11)', comment: '' }],
    ['12', { display: () => '12', method: 'get_raw_axis(12)', comment: '' }],
    ['13', { display: () => '13', method: 'get_raw_axis(13)', comment: '' }],
    ['14', { display: () => '14', method: 'get_raw_axis(14)', comment: '' }],
    ['15', { display: () => '15', method: 'get_raw_axis(15)', comment: '' }],
    ['16', { display: () => '16', method: 'get_raw_axis(16)', comment: '' }],
]);

const RUMBLE_CONFIG = new Map([
    ['LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT'], rumbleType: 'LEFT_RUMBLE'}],
    ['RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT'], rumbleType: 'RIGHT_RUMBLE'}],
    ['TRIGGER_LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT_TRIGGER'], rumbleType: 'LEFT_TRIGGER_RUMBLE'}],
    ['TRIGGER_RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT_TRIGGER'], rumbleType: 'RIGHT_TRIGGER_RUMBLE'}],
]);

const LED_CONFIG = new Map([
    ['LEDS', { display: () => Blockly.Msg['GAMEPAD_LEDS'], method: 'set_leds', comment: ''}],
]);


/** Returns the button configuration for generic gamepad. */
export function getButtonConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return BUTTON_CONFIG;
}

/** Returns the axis configuration for generic gamepad. */
export function getAxisConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return AXIS_CONFIG;
}

/** Returns the rumble configuration for generic gamepad. */
export function getRumbleConfig() : Map<string, GenericGamepad.RumbleConfigEntry> {
    return RUMBLE_CONFIG;
}

/** Returns the LED configuration for generic gamepad. */
export function getLEDConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return LED_CONFIG;
}

//TODO(alan): Touchpad fingers not supported yet in this version