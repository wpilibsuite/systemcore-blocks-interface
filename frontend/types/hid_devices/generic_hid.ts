// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import * as GenericGamepad from './gamepad_generic';

/** The number of buttons and axes that can be selected for a generic HID. */
const COUNT = 16;

/** Makes a config with an entry for each number from 1 to COUNT. */
function makeNumberedConfig(method: string): Map<string, GenericGamepad.ConfigEntry> {
    const config = new Map<string, GenericGamepad.ConfigEntry>();
    for (let i = 1; i <= COUNT; i++) {
        config.set(String(i), { display: () => String(i), method, args: String(i) });
    }
    return config;
}

const BUTTON_CONFIG = makeNumberedConfig('get_raw_button');

const AXIS_CONFIG = makeNumberedConfig('get_raw_axis');

const RUMBLE_CONFIG = new Map([
    ['LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT'], rumbleType: 'LEFT_RUMBLE'}],
    ['RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT'], rumbleType: 'RIGHT_RUMBLE'}],
    ['TRIGGER_LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT_TRIGGER'], rumbleType: 'LEFT_TRIGGER_RUMBLE'}],
    ['TRIGGER_RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT_TRIGGER'], rumbleType: 'RIGHT_TRIGGER_RUMBLE'}],
]);

const LED_CONFIG = new Map([
    ['LEDS', { display: () => Blockly.Msg['GAMEPAD_LEDS'], method: 'set_leds'}],
]);


/** Returns the button configuration for generic HID. */
export function getButtonConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return BUTTON_CONFIG;
}

/** Returns the axis configuration for generic HID. */
export function getAxisConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return AXIS_CONFIG;
}

/** Returns the rumble configuration for generic HID. */
export function getRumbleConfig() : Map<string, GenericGamepad.RumbleConfigEntry> {
    return RUMBLE_CONFIG;
}

/** Returns the LED configuration for generic HID. */
export function getLEDConfig() : Map<string, GenericGamepad.ConfigEntry> {
    return LED_CONFIG;
}

//TODO(alan): Touchpad fingers not supported yet in this version
