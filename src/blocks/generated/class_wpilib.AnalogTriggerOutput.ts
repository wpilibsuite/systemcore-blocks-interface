// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.AnalogTriggerOutput

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AnalogTriggerOutput",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create an object that represents one of the four outputs from an analog\ntrigger.\n\nBecause this class derives from DigitalSource, it can be passed into\nrouting functions for Counter, Encoder, etc.\n\n:param trigger:    A pointer to the trigger for which this is an output.\n:param outputType: An enum that specifies the output on the trigger to\n                   represent.", "returnType": "wpilib._wpilib.AnalogTriggerOutput", "args": [{"name": "trigger", "type": "wpilib._wpilib.AnalogTrigger"}, {"name": "outputType", "type": "wpilib._wpilib.AnalogTriggerType"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTrigger"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerType"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the state of the analog trigger output.\n\n:returns: The state of the analog trigger output.", "returnType": "bool", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The type of analog trigger output to be used.", "returnType": "wpilib._wpilib.AnalogTriggerType", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getAnalogTriggerTypeForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The channel of the source.", "returnType": "int", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The HAL Handle to the specified source.", "returnType": "int", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "getPortHandleForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Is source an AnalogTrigger", "returnType": "bool", "args": [{"name": "analogTriggerOutput", "type": "wpilib._wpilib.AnalogTriggerOutput"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogTriggerOutput", "FUNC": "isAnalogTrigger"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogTriggerOutput"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
