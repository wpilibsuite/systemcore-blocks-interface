// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.AddressableLED.LEDData

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.AddressableLED.LEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.AddressableLED.LEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "LEDData",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.AddressableLED.LEDData", "varType": "int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.AddressableLED.LEDData", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.AddressableLED.LEDData", "args": [{"name": "r", "type": "int"}, {"name": "g", "type": "int"}, {"name": "b", "type": "int"}], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData"}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "h", "type": "int"}, {"name": "s", "type": "int"}, {"name": "v", "type": "int"}], "tooltip": "A helper method to set all values of the LED.\n\n:param h: the h value [0-180]\n:param s: the s value [0-255]\n:param v: the v value [0-255]", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setHSV"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "color", "type": "wpilib._wpilib.Color"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setLED"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setLED"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "r", "type": "int"}, {"name": "g", "type": "int"}, {"name": "b", "type": "int"}], "tooltip": "A helper method to set all values of the LED.\n\n:param r: the r value [0-255]\n:param g: the g value [0-255]\n:param b: the b value [0-255]", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setRGB"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
