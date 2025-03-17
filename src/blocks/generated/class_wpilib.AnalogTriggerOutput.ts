// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.AnalogTriggerOutput

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.AnalogTriggerOutput", "args": [{"name": "trigger", "type": "wpilib.AnalogTrigger"}, {"name": "outputType", "type": "wpilib.AnalogTriggerType"}], "tooltip": "Create an object that represents one of the four outputs from an analog\ntrigger.\n\nBecause this class derives from DigitalSource, it can be passed into\nrouting functions for Counter, Encoder, etc.\n\n:param trigger:    A pointer to the trigger for which this is an output.\n:param outputType: An enum that specifies the output on the trigger to\n                   represent.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTrigger"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerType"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}], "tooltip": "Get the state of the analog trigger output.\n\n:returns: The state of the analog trigger output.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.AnalogTriggerType", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}], "tooltip": ":returns: The type of analog trigger output to be used.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getAnalogTriggerTypeForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}], "tooltip": ":returns: The channel of the source.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}], "tooltip": ":returns: The HAL Handle to the specified source.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getPortHandleForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "analogTriggerOutput", "type": "wpilib.AnalogTriggerOutput"}], "tooltip": "Is source an AnalogTrigger", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "isAnalogTrigger"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "AnalogTriggerOutput",
    contents: contents,
    className: "wpilib.AnalogTriggerOutput",
  };

  return category;
}
