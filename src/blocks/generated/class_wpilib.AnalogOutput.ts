// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.AnalogOutput

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AnalogOutput",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogOutput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct an analog output on the given channel.\n\nAll analog outputs are located on the MXP port.\n\n:param channel: The channel number on the roboRIO to represent.", "returnType": "wpilib._wpilib.AnalogOutput", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogOutput"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the channel of this AnalogOutput.", "returnType": "int", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogOutput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the voltage of the analog output.\n\n:returns: The value in Volts, from 0.0 to +5.0.", "returnType": "float", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogOutput", "FUNC": "getVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogOutput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the value of the analog output.\n\n:param voltage: The output value in Volts, from 0.0 to +5.0.", "returnType": "None", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}, {"name": "voltage", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogOutput", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
