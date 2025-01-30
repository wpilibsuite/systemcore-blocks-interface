// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.CallbackStore

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 1 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "callbackStore", "type": "wpilib.simulation._simulation.CallbackStore"}, {"name": "uid", "type": "int"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.CallbackStore", "FUNC": "setUid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallbackStore"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "CallbackStore",
    contents: contents,
    className: "wpilib.simulation.CallbackStore",
  };

  return category;
}
