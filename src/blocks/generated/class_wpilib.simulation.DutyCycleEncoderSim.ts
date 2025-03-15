// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DutyCycleEncoderSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DutyCycleEncoderSim", "args": [{"name": "encoder", "type": "wpilib.DutyCycleEncoder"}], "tooltip": "Constructs from a DutyCycleEncoder object.\n\n:param encoder: DutyCycleEncoder to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoder"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DutyCycleEncoderSim", "args": [{"name": "channel", "type": "int"}], "tooltip": "Constructs from a digital input channel.\n\n:param channel: digital input channel", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation.DutyCycleEncoderSim"}], "tooltip": "Get the position.\n\n:returns: The position.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation.DutyCycleEncoderSim"}], "tooltip": "Get if the encoder is connected.\n\n:returns: true if the encoder is connected.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "isConnected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation.DutyCycleEncoderSim"}, {"name": "value", "type": "float"}], "tooltip": "Set the position.\n\n:param value: The position.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation.DutyCycleEncoderSim"}, {"name": "isConnected", "type": "bool"}], "tooltip": "Set if the encoder is connected.\n\n:param isConnected: Whether or not the sensor is connected.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "setConnected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DutyCycleEncoderSim",
    contents: contents,
    className: "wpilib.simulation.DutyCycleEncoderSim",
  };

  return category;
}
