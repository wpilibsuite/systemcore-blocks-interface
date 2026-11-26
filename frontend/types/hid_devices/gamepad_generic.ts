// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

export type ConfigEntry = {
  display: () => string;
  // The name of the method on the wpilib class. For buttons, this is the name of the method that
  // returns whether the button is down. The names of the methods for pressed and released are made
  // by adding '_pressed' and '_released'.
  method: string;
  // The arguments to pass to the method, if any (for example, the button number).
  args?: string;
};

export type RumbleConfigEntry = {
  display: () => string;
  rumbleType: string;
};

// The buttons of wpilib.Gamepad, in the order of the button indexes of wpilib.Gamepad.Button.
// Each is the end of the name of the Blockly message with the display name, and the method.
// The key of each entry in the button config is its index, which is the same for the same
// physical button on every controller in first_ds_hids.json.
const BUTTONS: [string, string][] = [
    ['SOUTH_FACE', 'get_face_down_button'],
    ['EAST_FACE', 'get_face_right_button'],
    ['WEST_FACE', 'get_face_left_button'],
    ['NORTH_FACE', 'get_face_up_button'],
    ['BACK', 'get_back_button'],
    ['GUIDE', 'get_guide_button'],
    ['START', 'get_start_button'],
    ['LEFT_STICK', 'get_left_stick_button'],
    ['RIGHT_STICK', 'get_right_stick_button'],
    ['LEFT_BUMPER', 'get_left_bumper_button'],
    ['RIGHT_BUMPER', 'get_right_bumper_button'],
    ['DPAD_UP', 'get_dpad_up_button'],
    ['DPAD_DOWN', 'get_dpad_down_button'],
    ['DPAD_LEFT', 'get_dpad_left_button'],
    ['DPAD_RIGHT', 'get_dpad_right_button'],
    ['MISC1', 'get_misc1_button'],
    ['RIGHT_PADDLE_1', 'get_right_paddle1_button'],
    ['LEFT_PADDLE_1', 'get_left_paddle1_button'],
    ['RIGHT_PADDLE_2', 'get_right_paddle2_button'],
    ['LEFT_PADDLE_2', 'get_left_paddle2_button'],
    ['TOUCHPAD', 'get_touchpad_button'],
    ['MISC2', 'get_misc2_button'],
    ['MISC3', 'get_misc3_button'],
    ['MISC4', 'get_misc4_button'],
    ['MISC5', 'get_misc5_button'],
    ['MISC6', 'get_misc6_button'],
];

// The axes of wpilib.Gamepad, in the order of the axis indexes of wpilib.Gamepad.Axis.
const AXES: [string, string][] = [
    ['LEFT_STICK_X', 'get_left_x'],
    ['LEFT_STICK_Y', 'get_left_y'],
    ['RIGHT_STICK_X', 'get_right_x'],
    ['RIGHT_STICK_Y', 'get_right_y'],
    ['LEFT_TRIGGER', 'get_left_trigger'],
    ['RIGHT_TRIGGER', 'get_right_trigger'],
];

const BUTTON_CONFIG : Map<string, ConfigEntry> = new Map(BUTTONS.map(([name, method], index) =>
    [String(index), { display: () => Blockly.Msg['GAMEPAD_BUTTON_' + name], method }]));

const AXIS_CONFIG  : Map<string, ConfigEntry> = new Map(AXES.map(([name, method], index) =>
    [String(index), { display: () => Blockly.Msg['GAMEPAD_AXIS_' + name], method }]));

const RUMBLE_CONFIG : Map<string, RumbleConfigEntry> = new Map([
    ['LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT'], rumbleType: 'LEFT_RUMBLE'}],
    ['RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT'], rumbleType: 'RIGHT_RUMBLE'}],
    ['TRIGGER_LEFT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_LEFT_TRIGGER'], rumbleType: 'LEFT_TRIGGER_RUMBLE'}],
    ['TRIGGER_RIGHT_RUMBLE', { display: () => Blockly.Msg['GAMEPAD_RUMBLE_RIGHT_TRIGGER'], rumbleType: 'RIGHT_TRIGGER_RUMBLE'}],
]);

const LED_CONFIG : Map<string, ConfigEntry> = new Map([
    ['LEDS', { display: () => Blockly.Msg['GAMEPAD_LEDS'], method: 'set_leds'}],
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
