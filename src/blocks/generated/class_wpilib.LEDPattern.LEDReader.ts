// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.LEDPattern.LEDReader

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "LEDReader",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDReader"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.LEDPattern.LEDReader", "args": [{"name": "impl", "type": "Callable[[int], wpilib._wpilib.AddressableLED.LEDData]"}, {"name": "size", "type": "int"}], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LEDPattern.LEDReader"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData]"}}}}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "lEDReader", "type": "wpilib._wpilib.LEDPattern.LEDReader"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.LEDPattern.LEDReader", "FUNC": "size"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDReader"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
