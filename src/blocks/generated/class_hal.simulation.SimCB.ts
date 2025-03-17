// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.simulation.SimCB

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 1 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simCB", "type": "hal.simulation.SimCB"}], "tooltip": "Cancel the callback", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.simulation.SimCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimCB"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SimCB",
    contents: contents,
    className: "hal.simulation.SimCB",
  };

  return category;
}
