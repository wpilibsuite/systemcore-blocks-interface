// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.AnalogEncoderSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.AnalogEncoderSim", "args": [{"name": "encoder", "type": "wpilib.AnalogEncoder"}], "tooltip": "Constructs from an AnalogEncoder object.\n\n:param encoder: AnalogEncoder to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogEncoderSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation.AnalogEncoderSim"}], "tooltip": "Get the simulated position.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation.AnalogEncoderSim"}, {"name": "value", "type": "float"}], "tooltip": "Set the position.\n\n:param value: The position.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "AnalogEncoderSim",
    contents: contents,
    className: "wpilib.simulation.AnalogEncoderSim",
  };

  return category;
}
