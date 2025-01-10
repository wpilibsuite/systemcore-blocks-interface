// This file was generated. Do not edit!

import * as pythonEnum from "../python_enum";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.interfaces.CounterBase

export function initialize() {
  pythonEnum.initializeEnum("wpilib.interfaces.CounterBase.EncodingType", ["k1X", "k2X", "k4X"], "Members:\n\n  k1X\n\n  k2X\n\n  k4X");
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "CounterBase",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCounterBase"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.interfaces._interfaces.CounterBase", "args": [], "importModule": "wpilib.interfaces"}, "fields": {"CLASS": "wpilib.interfaces.CounterBase"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "int", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "bool", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.units.seconds", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getPeriod"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "bool", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "getStopped"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "counterBase", "type": "wpilib.interfaces._interfaces.CounterBase"}, {"name": "maxPeriod", "type": "wpimath.units.seconds"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.CounterBase", "FUNC": "setMaxPeriod"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCounterBase"}}}}}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k1X"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k2X"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.CounterBase.EncodingType", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.CounterBase.EncodingType", "ENUM_VALUE": "k4X"}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
