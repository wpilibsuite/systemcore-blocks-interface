// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.WidgetType

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 2 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWidgetType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.shuffleboard.WidgetType", "args": [{"name": "widgetName", "type": "str"}], "tooltip": "", "importModule": "wpilib.shuffleboard"}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.WidgetType"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "widgetType", "type": "wpilib.shuffleboard.WidgetType"}], "tooltip": "Gets the string type of the widget as defined by that widget in\nShuffleboard.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.WidgetType", "FUNC": "getWidgetName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWidgetType"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "WidgetType",
    contents: contents,
    className: "wpilib.shuffleboard.WidgetType",
  };

  return category;
}
