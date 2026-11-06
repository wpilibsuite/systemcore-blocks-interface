// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Generic from './gamepad_generic';
import * as Blockly from 'blockly';

/** Returns the button configuration for XBOX gamepad. */
export function getButtonConfig() {
    const genericButtonConfig = Generic.getButtonConfig();
    const buttonConfig = new Map(genericButtonConfig);
    
    // Change naming for face buttons to match XBOX layout
    buttonConfig.set('SOUTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_A'], method: 'get_face_down_button', comment: 'A' });
    buttonConfig.set('EAST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_B'], method: 'get_face_right_button', comment: 'B' });
    buttonConfig.set('WEST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_X'], method: 'get_face_left_button', comment: 'X' });
    buttonConfig.set('NORTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_Y'], method: 'get_face_up_button', comment: 'Y' });

    buttonConfig.delete('MISC1'); // Remove Misc1 - XBOX does not have this button
    buttonConfig.delete('MISC2'); // Remove Misc2 - XBOX does not have this button
    buttonConfig.delete('MISC3'); // Remove Misc3 - XBOX does not have this button
    buttonConfig.delete('MISC4'); // Remove Misc4 - XBOX does not have this button
    buttonConfig.delete('MISC5'); // Remove Misc5 - XBOX does not have this button
    buttonConfig.delete('MISC6'); // Remove Misc6 - XBOX does not have this button
    buttonConfig.delete('TOUCHPAD'); // Remove Touchpad - XBOX does not have this button
    buttonConfig.delete('RIGHT_PADDLE_1'); // Remove Right Paddle 1 - XBOX does not have this button
    buttonConfig.delete('LEFT_PADDLE_1'); // Remove Left Paddle 1 - XBOX does not have this button
    buttonConfig.delete('RIGHT_PADDLE_2'); // Remove Right Paddle 2 - XBOX does not have this button
    buttonConfig.delete('LEFT_PADDLE_2'); // Remove Left Paddle 2 - XBOX does not have this button
   
    return buttonConfig;
}

/** Returns the axis configuration for generic gamepad. */
export function getAxisConfig() {
    return Generic.getAxisConfig();
}

export function getRumbleConfig() {
    return Generic.getRumbleConfig();
}

/** An XBOX controller doesn't have an LED */
export function getLEDConfig() {
    return null;
}