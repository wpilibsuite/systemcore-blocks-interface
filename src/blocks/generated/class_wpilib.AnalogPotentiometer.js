// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.AnalogPotentiometer

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "AnalogPotentiometer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogPotentiometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct an Analog Potentiometer object from a channel number.\n\nUse the fullRange and offset values so that the output produces meaningful\nvalues. I.E: you have a 270 degree potentiometer and you want the output to\nbe degrees with the halfway point as 0 degrees. The fullRange value is\n270.0 degrees and the offset is -135.0 since the halfway point after\nscaling is 135 degrees.\n\nThis will calculate the result from the fullRange times the fraction of the\nsupply voltage, plus the offset.\n\n:param channel:   The Analog Input channel number on the roboRIO the\n                  potentiometer is plugged into. 0-3 are on-board and 4-7\n                  are on the MXP port.\n:param fullRange: The value (in desired units) representing the full\n                  0-5V range of the input.\n:param offset:    The value (in desired units) representing the\n                  angular output at 0V.", "returnType": "wpilib._wpilib.AnalogPotentiometer", "args": [{"name": "channel", "type": "int"}, {"name": "fullRange", "type": "float"}, {"name": "offset", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogPotentiometer"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogPotentiometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct an Analog Potentiometer object from an existing Analog Input\npointer.\n\nUse the fullRange and offset values so that the output produces meaningful\nvalues. I.E: you have a 270 degree potentiometer and you want the output to\nbe degrees with the halfway point as 0 degrees. The fullRange value is\n270.0 degrees and the offset is -135.0 since the halfway point after\nscaling is 135 degrees.\n\nThis will calculate the result from the fullRange times the fraction of the\nsupply voltage, plus the offset.\n\n:param input:     The existing Analog Input pointer\n:param fullRange: The value (in desired units) representing the full\n                  0-5V range of the input.\n:param offset:    The value (in desired units) representing the\n                  angular output at 0V.", "returnType": "wpilib._wpilib.AnalogPotentiometer", "args": [{"name": "input", "type": "wpilib._wpilib.AnalogInput"}, {"name": "fullRange", "type": "float"}, {"name": "offset", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogPotentiometer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the current reading of the potentiometer.\n\n:returns: The current position of the potentiometer (in the units used for\n          fullRange and offset).", "returnType": "float", "args": [{"name": "analogPotentiometer", "type": "wpilib._wpilib.AnalogPotentiometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogPotentiometer", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogPotentiometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "analogPotentiometer", "type": "wpilib._wpilib.AnalogPotentiometer"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogPotentiometer", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogPotentiometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
