/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Create a field that has a dropdown with a number range
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import { createFieldDropdown } from './FieldDropdown';
import { createFieldNonEditableText } from './FieldNonEditableText';

export function createFieldNumberDropdown(min: number, max: number): Blockly.Field {
  const items: string[] = [];
  for (let i = min; i <= max; i++) {
    items.push(i.toString());
  }
  return createFieldDropdown(items);
}

/**
 * Creates a field with a dropdown whose displayed labels differ from the values that are
 * stored on the block. Each option is a [label, value] pair.
 */
export function createFieldLabeledDropdown(options: Blockly.MenuOption[]): Blockly.Field {
  // If there is only one option, don't create a dropdown.
  if (options.length === 1) {
    return createFieldNonEditableText(options[0][1] as string);
  }
  return new Blockly.FieldDropdown(options);
}
