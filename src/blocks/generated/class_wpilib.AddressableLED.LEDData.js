// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.AddressableLED.LEDData

python.PythonVariableGetterNames["instance wpilib.AddressableLED.LEDData int"] = ["b", "g", "r"];
python.PythonVariableGetterTooltips["instance wpilib.AddressableLED.LEDData int"] = ["///< blue value", "///< green value", "///< red value"];
python.PythonVariableSetterNames["instance wpilib.AddressableLED.LEDData int"] = ["b", "g", "r"];
python.PythonVariableSetterTooltips["instance wpilib.AddressableLED.LEDData int"] = ["///< blue value", "///< green value", "///< red value"];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "LEDData",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.AddressableLED.LEDData int", "importModule": "", "selfLabel": "lEDData", "selfType": "wpilib.AddressableLED.LEDData"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.AddressableLED.LEDData", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.AddressableLED.LEDData", "args": [{"name": "r", "type": "int"}, {"name": "g", "type": "int"}, {"name": "b", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "A helper method to set all values of the LED.\n\n:param h: the h value [0-180]\n:param s: the s value [0-255]\n:param v: the v value [0-255]", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "h", "type": "int"}, {"name": "s", "type": "int"}, {"name": "v", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setHSV"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "color", "type": "wpilib._wpilib.Color"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setLED"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setLED"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "A helper method to set all values of the LED.\n\n:param r: the r value [0-255]\n:param g: the g value [0-255]\n:param b: the b value [0-255]", "returnType": "None", "args": [{"name": "lEDData", "type": "wpilib._wpilib.AddressableLED.LEDData"}, {"name": "r", "type": "int"}, {"name": "g", "type": "int"}, {"name": "b", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED.LEDData", "FUNC": "setRGB"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
