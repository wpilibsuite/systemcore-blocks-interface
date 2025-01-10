// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class hal.simulation.SimValueCB

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimValueCB",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Cancel the callback", "returnType": "None", "args": [{"name": "simValueCB", "type": "hal.simulation._simulation.SimValueCB"}], "importModule": ""}, "fields": {"CLASS": "hal.simulation.SimValueCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValueCB"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
