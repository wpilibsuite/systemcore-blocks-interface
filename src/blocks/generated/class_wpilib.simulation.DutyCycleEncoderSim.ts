// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DutyCycleEncoderSim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DutyCycleEncoderSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a DutyCycleEncoder object.\n\n:param encoder: DutyCycleEncoder to simulate", "returnType": "wpilib.simulation._simulation.DutyCycleEncoderSim", "args": [{"name": "encoder", "type": "wpilib._wpilib.DutyCycleEncoder"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoder"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a digital input channel.\n\n:param channel: digital input channel", "returnType": "wpilib.simulation._simulation.DutyCycleEncoderSim", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the position.\n\n:returns: The position.", "returnType": "float", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation._simulation.DutyCycleEncoderSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get if the encoder is connected.\n\n:returns: true if the encoder is connected.", "returnType": "bool", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation._simulation.DutyCycleEncoderSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "isConnected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the position.\n\n:param value: The position.", "returnType": "None", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation._simulation.DutyCycleEncoderSim"}, {"name": "value", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set if the encoder is connected.\n\n:param isConnected: Whether or not the sensor is connected.", "returnType": "None", "args": [{"name": "dutyCycleEncoderSim", "type": "wpilib.simulation._simulation.DutyCycleEncoderSim"}, {"name": "isConnected", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DutyCycleEncoderSim", "FUNC": "setConnected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycleEncoderSim"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
