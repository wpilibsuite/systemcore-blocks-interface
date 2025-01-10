// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.DigitalSource

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DigitalSource",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDigitalSource"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.DigitalSource", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DigitalSource"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogTriggerType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.AnalogTriggerType", "args": [{"name": "digitalSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalSource", "FUNC": "getAnalogTriggerTypeForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "int", "args": [{"name": "digitalSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalSource", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "int", "args": [{"name": "digitalSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalSource", "FUNC": "getPortHandleForRouting"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "bool", "args": [{"name": "digitalSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DigitalSource", "FUNC": "isAnalogTrigger"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
