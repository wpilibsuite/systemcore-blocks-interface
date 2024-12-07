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

function createNonEditableField(label) {
  const field = new Blockly.FieldTextInput(label);
  field.CURSOR = '';
  field.showEditor_ = function(opt_quietInput) {};
  return field;
}

function createFieldDropdownForVariable(varNames) {
  // If there is only one choice, don't create a dropdown.
  if (varNames.length == 1) {
    return createNonEditableField(varNames[0]);
  }
  const varNameChoices = [];
  for (let i = 0; i < varNames.length; i++) {
    varNameChoices.push([varNames[i], varNames[i]]);
  }
  return new Blockly.FieldDropdown(varNameChoices)
}

export {
  createNonEditableField,
  createFieldDropdownForVariable
}
