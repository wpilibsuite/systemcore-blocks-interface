// This file was generated. Do not edit!

import * as pythonEnum from "../python_enum";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.filter.Debouncer

export function initialize() {
  pythonEnum.initializeEnum("wpimath.filter.Debouncer.DebounceType", ["kBoth", "kFalling", "kRising"], "Type of debouncing to perform.\n\nMembers:\n\n  kRising : Rising edge.\n\n  kFalling : Falling edge.\n\n  kBoth : Both rising and falling edges.");
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Debouncer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDebouncer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Creates a new Debouncer.\n\n:param debounceTime: The number of seconds the value must change from\n                     baseline for the filtered value to change.\n:param type:         Which type of state change the debouncing will be\n                     performed on.", "returnType": "wpimath.filter._filter.Debouncer", "args": [{"name": "debounceTime", "type": "wpimath.units.seconds"}, {"name": "type", "type": "wpimath.filter._filter.Debouncer.DebounceType"}], "importModule": "wpimath.filter"}, "fields": {"CLASS": "wpimath.filter.Debouncer"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDebounceType"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Applies the debouncer to the input stream.\n\n:param input: The current value of the input stream.\n\n:returns: The debounced value of the input stream.", "returnType": "bool", "args": [{"name": "debouncer", "type": "wpimath.filter._filter.Debouncer"}, {"name": "input", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpimath.filter.Debouncer", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDebouncer"}}}}}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kBoth"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kFalling"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpimath.filter.Debouncer.DebounceType", "importModule": "wpimath.filter"}, "fields": {"ENUM_TYPE": "wpimath.filter.Debouncer.DebounceType", "ENUM_VALUE": "kRising"}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
