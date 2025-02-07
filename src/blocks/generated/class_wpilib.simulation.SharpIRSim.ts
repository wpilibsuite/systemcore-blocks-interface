// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.SharpIRSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIRSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SharpIRSim", "args": [{"name": "sharpIR", "type": "wpilib._wpilib.SharpIR"}], "tooltip": "Constructor.\n\n:param sharpIR: The real sensor to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SharpIRSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIR"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIRSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SharpIRSim", "args": [{"name": "channel", "type": "int"}], "tooltip": "Constructor.\n\n:param channel: Analog channel for this sensor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SharpIRSim"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sharpIRSim", "type": "wpilib.simulation._simulation.SharpIRSim"}, {"name": "rng", "type": "wpimath.units.centimeters"}], "tooltip": "Set the range returned by the distance sensor.\n\n:param rng: range of the target returned by the sensor", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SharpIRSim", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIRSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SharpIRSim",
    contents: contents,
    className: "wpilib.simulation.SharpIRSim",
  };

  return category;
}
