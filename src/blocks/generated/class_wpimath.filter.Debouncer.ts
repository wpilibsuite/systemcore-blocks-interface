// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.filter.Debouncer

export function initialize() {
  pythonEnum.initializeEnum("wpimath.filter.Debouncer.DebounceType", ["kBoth", "kFalling", "kRising"], "Type of debouncing to perform.\n\nMembers:\n\n  kRising : Rising edge.\n\n  kFalling : Falling edge.\n\n  kBoth : Both rising and falling edges.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDebouncer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.filter.Debouncer", "args": [{"name": "debounceTime", "type": "wpimath.units.seconds"}, {"name": "type", "type": "wpimath.filter.Debouncer.DebounceType"}], "tooltip": "Creates a new Debouncer.\n\n:param debounceTime: The number of seconds the value must change from\n                     baseline for the filtered value to change.\n:param type:         Which type of state change the debouncing will be\n                     performed on.", "importModule": "wpimath.filter"}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.Debouncer"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDebounceType"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "debouncer", "type": "wpimath.filter.Debouncer"}, {"name": "input", "type": "bool"}], "tooltip": "Applies the debouncer to the input stream.\n\n:param input: The current value of the input stream.\n\n:returns: The debounced value of the input stream.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.Debouncer", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDebouncer"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kBoth"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kFalling"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kRising"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Debouncer",
    contents: contents,
    className: "wpimath.filter.Debouncer",
  };

  return category;
}
