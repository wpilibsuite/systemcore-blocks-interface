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