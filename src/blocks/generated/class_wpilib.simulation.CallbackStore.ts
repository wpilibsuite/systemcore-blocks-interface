// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.CallbackStore

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "CallbackStore",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "callbackStore", "type": "wpilib.simulation._simulation.CallbackStore"}, {"name": "uid", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.CallbackStore", "FUNC": "setUid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallbackStore"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
