// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.LEDPattern.LEDReader

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "LEDReader",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDReader"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.LEDPattern.LEDReader", "args": [{"name": "impl", "type": "Callable[[int], wpilib._wpilib.AddressableLED.LEDData]"}, {"name": "size", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LEDPattern.LEDReader"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData]"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "int", "args": [{"name": "lEDReader", "type": "wpilib._wpilib.LEDPattern.LEDReader"}], "importModule": ""}, "fields": {"CLASS": "wpilib.LEDPattern.LEDReader", "FUNC": "size"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDReader"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
