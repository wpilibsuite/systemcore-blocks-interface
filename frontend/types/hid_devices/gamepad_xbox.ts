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
import * as Generic from './gamepad_generic';
import * as Blockly from 'blockly';

/** Returns the button configuration for XBOX gamepad. */
export function getButtonConfig() {
    const genericButtonConfig = Generic.getButtonConfig();
    const buttonConfig = new Map(genericButtonConfig);
    
    // Change naming for face buttons to match XBOX layout
    buttonConfig.set('SOUTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_A'], method: 'getSouthFace', comment: 'A' });
    buttonConfig.set('EAST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_B'], method: 'getEastFace', comment: 'B' });
    buttonConfig.set('WEST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_X'], method: 'getWestFace', comment: 'X' });
    buttonConfig.set('NORTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_Y'], method: 'getNorthFace', comment: 'Y' });

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

/** Returns the LED configuration for generic gamepad. */
export function getLEDConfig() {
    return Generic.getLEDConfig();
}