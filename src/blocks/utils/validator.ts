/**
 * @license
 * Copyright 2025 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

/**
 * Take the proposed name, and return a legal name.
 * A legal name is:
 * 1. not empty.
 * 2. doesn't collide with other names.
 * 3. Optional: begins with a letter.
 */
export function makeLegalName(proposedName: string, otherNames: string[], mustBeginWithLetter: boolean): string {
  const otherNamesLowerCase = otherNames.map(n => n.toLowerCase());

  // Strip leading and trailing whitespace.
  let name = proposedName.trim();

  // Make the name non-empty.
  name = name || 'unnamed';

  if (mustBeginWithLetter) {
    // If the name begins with a non-alphabetic character, insert the letter a at the beginning.
    if (!name.match(/^[a-zA-Z].*$/)) {
      name = 'a' + name;
    }
  }

  while (otherNamesLowerCase.includes(name.toLowerCase())) {
    // Collision with another name.
    const r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      name += '2';
    } else {
      name = r[1] + (parseInt(r[2]) + 1);
    }
  }
  return name;
}
