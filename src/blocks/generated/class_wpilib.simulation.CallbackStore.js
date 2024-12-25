// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.simulation.CallbackStore

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "CallbackStore",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "callbackStore", "type": "wpilib.simulation._simulation.CallbackStore"}, {"name": "uid", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.CallbackStore", "FUNC": "setUid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallbackStore"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
