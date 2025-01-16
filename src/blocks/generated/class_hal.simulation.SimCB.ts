// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class hal.simulation.SimCB

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimCB",
    contents: [
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simCB", "type": "hal.simulation._simulation.SimCB"}], "tooltip": "Cancel the callback", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.simulation.SimCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimCB"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
