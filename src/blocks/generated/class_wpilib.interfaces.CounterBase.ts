// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.interfaces.CounterBase

export function initialize() {
  pythonEnum.initializeEnum("wpilib.interfaces.CounterBase.EncodingType", ["k1X", "k2X", "k4X"], "Members:\n\n  k1X\n\n  k2X\n\n  k4X");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCounterBase"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.interfaces._interfaces.CounterBase", "args": [], "tooltip": "", "importModule": "wpilib.interfaces"}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getPeriod"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getStopped"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}, {"name": "maxPeriod", "type": "wpimath.units.seconds"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.CounterBase", "FUNC": "setMaxPeriod"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k1X"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k2X"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k4X"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "CounterBase",
    contents: contents,
    className: "wpilib.interfaces.CounterBase",
  };

  return category;
}
