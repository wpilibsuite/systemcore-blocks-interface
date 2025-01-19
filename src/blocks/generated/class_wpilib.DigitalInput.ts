// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.DigitalInput

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDigitalInput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.DigitalInput", "args": [{"name": "channel", "type": "int"}], "tooltip": "Create an instance of a Digital Input class.\n\nCreates a digital input given a channel.\n\n:param channel: The DIO channel 0-9 are on-board, 10-25 are on the MXP port", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "tooltip": "Get the value from a digital input channel.\n\nRetrieve the value of a single digital input channel from the FPGA.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.AnalogTriggerType", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "tooltip": ":returns: The type of analog trigger output to be used. 0 for Digitals", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "getAnalogTriggerTypeForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "tooltip": ":returns: The GPIO channel number that this object represents.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "tooltip": ":returns: The HAL Handle to the specified source.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "getPortHandleForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "tooltip": "Is source an AnalogTrigger", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "isAnalogTrigger"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}, {"name": "device", "type": "int"}], "tooltip": "Indicates this input is used by a simulated device.\n\n:param device: simulated device handle", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DigitalInput", "FUNC": "setSimDevice"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.DigitalInput",
    name:  "DigitalInput",
      contents: contents,
  };
  return category;
}
