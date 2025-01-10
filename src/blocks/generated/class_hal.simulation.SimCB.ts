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
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Cancel the callback", "returnType": "None", "args": [{"name": "simCB", "type": "hal.simulation._simulation.SimCB"}], "importModule": ""}, "fields": {"CLASS": "hal.simulation.SimCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimCB"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
