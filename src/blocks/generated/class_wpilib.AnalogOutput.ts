// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.AnalogOutput

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogOutput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.AnalogOutput", "args": [{"name": "channel", "type": "int"}], "tooltip": "Construct an analog output on the given channel.\n\nAll analog outputs are located on the MXP port.\n\n:param channel: The channel number on the roboRIO to represent.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogOutput"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}], "tooltip": "Get the channel of this AnalogOutput.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogOutput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}], "tooltip": "Get the voltage of the analog output.\n\n:returns: The value in Volts, from 0.0 to +5.0.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogOutput", "FUNC": "getVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogOutput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}, {"name": "voltage", "type": "float"}], "tooltip": "Set the value of the analog output.\n\n:param voltage: The output value in Volts, from 0.0 to +5.0.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogOutput", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.AnalogOutput",
    name:  "AnalogOutput",
      contents: contents,
  };
  return category;
}
