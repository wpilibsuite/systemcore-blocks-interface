// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Create a field that has a dropdown with a number range
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import { FieldDropdownWithBorderRect } from './FieldDropdown';
import { createFieldNonEditableText } from './FieldNonEditableText';

export function createFieldNumberDropdown(min: number, max: number): Blockly.Field {
  const options: Blockly.MenuOption[] = [];
  for (let i = min; i <= max; i++) {
    options.push([i.toString(), i.toString()]);
  }
  return createFieldLabeledDropdown(options);
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
  return new FieldDropdownWithBorderRect(options);
}
