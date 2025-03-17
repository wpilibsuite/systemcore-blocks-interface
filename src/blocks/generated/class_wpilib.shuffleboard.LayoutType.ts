// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.LayoutType

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 2 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLayoutType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.shuffleboard.LayoutType", "args": [{"name": "layoutName", "type": "str"}], "tooltip": "", "importModule": "wpilib.shuffleboard"}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.LayoutType"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "layoutType", "type": "wpilib.shuffleboard.LayoutType"}], "tooltip": "Gets the string type of the layout as defined by that layout in\nShuffleboard.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.LayoutType", "FUNC": "getLayoutName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLayoutType"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "LayoutType",
    contents: contents,
    className: "wpilib.shuffleboard.LayoutType",
  };

  return category;
}
