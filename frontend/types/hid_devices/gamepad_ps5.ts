// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Generic from './gamepad_generic';
import * as PS4 from './gamepad_ps4';

/** Returns the button configuration for PS5 gamepad. */
export function getButtonConfig() {
    return PS4.getButtonConfig();  // same as PS4 gamepad
}

/** Returns the axis configuration for PS5 gamepad. */
export function getAxisConfig() {
    return PS4.getAxisConfig();
}

/** Returns the rumble configuration for PS5 gamepad. */
export function getRumbleConfig() {
    return Generic.getRumbleConfig();  // unlike the PS4, the PS5 has trigger rumble
}

/** Returns the LED configuration for PS5 gamepad. */
export function getLEDConfig() {
    return PS4.getLEDConfig();
}