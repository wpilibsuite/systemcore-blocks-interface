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

/** Returns the button configuration for PS4 gamepad. */
export function getButtonConfig() {
    const genericButtonConfig = Generic.getButtonConfig();
    const buttonConfig = new Map(genericButtonConfig);
    
    // Change naming for face buttons to match PS4 layout
    buttonConfig.set('SOUTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_CROSS'], method: 'getSouthFace', comment: 'X' });
    buttonConfig.set('EAST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_CIRCLE'], method: 'getEastFace', comment: 'O' });
    buttonConfig.set('WEST_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_SQUARE'], method: 'getWestFace', comment: '□' });
    buttonConfig.set('NORTH_FACE', { display: () => Blockly.Msg['GAMEPAD_BUTTON_TRIANGLE'], method: 'getNorthFace', comment: 'Δ' });

    buttonConfig.delete('MISC1'); // Remove Misc1 - PS4 does not have this button
    buttonConfig.delete('MISC2'); // Remove Misc2 - PS4 does not have this button
    buttonConfig.delete('MISC3'); // Remove Misc3 - PS4 does not have this button
    buttonConfig.delete('MISC4'); // Remove Misc4 - PS4 does not have this button
    buttonConfig.delete('MISC5'); // Remove Misc5 - PS4 does not have this button
    buttonConfig.delete('MISC6'); // Remove Misc6 - PS4 does not have this button
    buttonConfig.delete('RIGHT_PADDLE_1'); // Remove Right Paddle 1 - PS4 does not have this button
    buttonConfig.delete('LEFT_PADDLE_1'); // Remove Left Paddle 1 - PS4 does not have this button
    buttonConfig.delete('RIGHT_PADDLE_2'); // Remove Right Paddle 2 - PS4 does not have this button
    buttonConfig.delete('LEFT_PADDLE_2'); // Remove Left Paddle 2 - PS4 does not have this button
   
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