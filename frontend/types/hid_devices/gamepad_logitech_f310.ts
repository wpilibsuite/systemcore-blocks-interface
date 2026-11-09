// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as XBox from './gamepad_xbox';

/** Returns the button configuration for Logitech F310 gamepad. */
export function getButtonConfig() {
    return XBox.getButtonConfig();  // same as XBOX gamepad
}

/** Returns the axis configuration for generic gamepad. */
export function getAxisConfig() {
    return XBox.getAxisConfig(); // same as XBOX gamepad
}

export function getRumbleConfig() {
    return null; // Logitech F310 does not have rumble support
}

/** Returns the LED configuration for generic gamepad. */
export function getLEDConfig() {
    return null; // Logitech F310 does not have LED support
}