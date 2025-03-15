// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.simulation.SimValueCB

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 1 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simValueCB", "type": "hal.simulation.SimValueCB"}], "tooltip": "Cancel the callback", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.simulation.SimValueCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValueCB"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SimValueCB",
    contents: contents,
    className: "hal.simulation.SimValueCB",
  };

  return category;
}
