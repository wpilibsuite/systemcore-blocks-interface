// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.DigitalInput

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "DigitalInput",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDigitalInput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create an instance of a Digital Input class.\n\nCreates a digital input given a channel.\n\n:param channel: The DIO channel 0-9 are on-board, 10-25 are on the MXP port", "returnType": "wpilib._wpilib.DigitalInput", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DigitalInput"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the value from a digital input channel.\n\nRetrieve the value of a single digital input channel from the FPGA.", "returnType": "bool", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The type of analog trigger output to be used. 0 for Digitals", "returnType": "wpilib._wpilib.AnalogTriggerType", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "getAnalogTriggerTypeForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The GPIO channel number that this object represents.", "returnType": "int", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The HAL Handle to the specified source.", "returnType": "int", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "getPortHandleForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Is source an AnalogTrigger", "returnType": "bool", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "isAnalogTrigger"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Indicates this input is used by a simulated device.\n\n:param device: simulated device handle", "returnType": "None", "args": [{"name": "digitalInput", "type": "wpilib._wpilib.DigitalInput"}, {"name": "device", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalInput", "FUNC": "setSimDevice"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalInput"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
