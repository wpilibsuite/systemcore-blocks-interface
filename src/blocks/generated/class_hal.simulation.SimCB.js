// This file was generated. Do not edit!

// Blocks for class hal.simulation.SimCB

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SimCB",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Cancel the callback", "returnType": "None", "args": [{"name": "simCB", "type": "hal.simulation._simulation.SimCB"}], "importModule": ""}, "fields": {"CLASS": "hal.simulation.SimCB", "FUNC": "cancel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimCB"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
