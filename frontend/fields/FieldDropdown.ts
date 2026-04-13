/**
 * @license
 * Copyright 2024 Google LLC
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
import * as Blockly from 'blockly/core';
import { createFieldNonEditableText } from './FieldNonEditableText';

export function createFieldDropdown(items: string[]): Blockly.Field {
  // If there is only one item, don't create a dropdown.
  if (items.length === 1) {
    return createFieldNonEditableText(items[0]);
  }
  const options: Blockly.MenuOption[] = [];
  items.forEach((item) => {
    options.push([item, item]);
  });
  return new Blockly.FieldDropdown(options);
}

/*
 * Create a custom dropdown that accepts any value and displays it correctly
 * This is necessary because we need to be able to force a parameter or step into the dropdown
 * when we drag from it before it goes into a method or event that defines that parameter or a 
 * step container that contains that step.
 * 
 * WARNING: This class relies on Blockly internals that are not part of the public API.
 */
export class CustomDropdownWithoutValidation extends Blockly.FieldDropdown {
  override doClassValidation_(newValue?: string): string | null {
    // Always accept the value, even if it's not in the current options
    return newValue ?? null;
  }
  
  override getText_(): string {
    // Always return the current value, even if not in options
    return this.value_ || '';
  }
}