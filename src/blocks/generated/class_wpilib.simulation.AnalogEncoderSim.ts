// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.AnalogEncoderSim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AnalogEncoderSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from an AnalogEncoder object.\n\n:param encoder: AnalogEncoder to simulate", "returnType": "wpilib.simulation._simulation.AnalogEncoderSim", "args": [{"name": "encoder", "type": "wpilib._wpilib.AnalogEncoder"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the simulated position.", "returnType": "float", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the position.\n\n:param value: The position.", "returnType": "None", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}, {"name": "value", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
