// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.WidgetType

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "WidgetType",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWidgetType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.shuffleboard._shuffleboard.WidgetType", "args": [{"name": "widgetName", "type": "str"}], "importModule": "wpilib.shuffleboard"}, "fields": {"CLASS": "wpilib.shuffleboard.WidgetType"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the string type of the widget as defined by that widget in\nShuffleboard.", "returnType": "str", "args": [{"name": "widgetType", "type": "wpilib.shuffleboard._shuffleboard.WidgetType"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.WidgetType", "FUNC": "getWidgetName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWidgetType"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
