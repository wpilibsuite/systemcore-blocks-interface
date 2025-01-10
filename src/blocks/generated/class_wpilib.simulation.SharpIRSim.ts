// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.SharpIRSim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SharpIRSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIRSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor.\n\n:param sharpIR: The real sensor to simulate", "returnType": "wpilib.simulation._simulation.SharpIRSim", "args": [{"name": "sharpIR", "type": "wpilib._wpilib.SharpIR"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SharpIRSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIR"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIRSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor.\n\n:param channel: Analog channel for this sensor", "returnType": "wpilib.simulation._simulation.SharpIRSim", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SharpIRSim"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the range returned by the distance sensor.\n\n:param rng: range of the target returned by the sensor", "returnType": "None", "args": [{"name": "sharpIRSim", "type": "wpilib.simulation._simulation.SharpIRSim"}, {"name": "rng", "type": "wpimath.units.centimeters"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SharpIRSim", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIRSim"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
