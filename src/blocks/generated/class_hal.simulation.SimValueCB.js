// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.simulation.SimValueCB

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SimValueCB",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Cancel the callback", "returnType": "None", "args": [{"name": "simValueCB", "type": "hal.simulation._simulation.SimValueCB"}], "importModule": ""}, "fields": {"CLASS": "hal.simulation.SimValueCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValueCB"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
