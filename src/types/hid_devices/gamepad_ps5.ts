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
import * as PS4 from './gamepad_ps4';

/** Returns the button configuration for PS5 gamepad. */
export function getButtonConfig() {
    return PS4.getButtonConfig();  // same as PS4 gamepad
}

/** Returns the axis configuration for PS5 gamepad. */
export function getAxisConfig() {
    return PS4.getAxisConfig();
}

/** Returns the axis configuration for PS5 gamepad. */
export function getRumbleConfig() {
    return PS4.getRumbleConfig();
}

/** Returns the LED configuration for PS5 gamepad. */
export function getLEDConfig() {
    return PS4.getLEDConfig();
}