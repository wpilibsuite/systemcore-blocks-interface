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

/** URL query parameter that turns on debug features, for example `/?debug`. */
const DEBUG_PARAM = 'debug';

/**
 * Returns true if debug features, which normal users don't see, should be shown.
 * Debug mode is turned on by adding `?debug` to the URL.
 */
export function isDebugMode(): boolean {
  return new URLSearchParams(window.location.search).has(DEBUG_PARAM);
}
