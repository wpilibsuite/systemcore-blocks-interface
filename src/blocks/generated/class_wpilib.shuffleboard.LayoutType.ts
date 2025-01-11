// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.LayoutType

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "LayoutType",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLayoutType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.shuffleboard._shuffleboard.LayoutType", "args": [{"name": "layoutName", "type": "str"}], "importModule": "wpilib.shuffleboard"}, "fields": {"CLASS": "wpilib.shuffleboard.LayoutType"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the string type of the layout as defined by that layout in\nShuffleboard.", "returnType": "str", "args": [{"name": "layoutType", "type": "wpilib.shuffleboard._shuffleboard.LayoutType"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.LayoutType", "FUNC": "getLayoutName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLayoutType"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
