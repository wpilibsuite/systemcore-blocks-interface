// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.SendableChooserSim

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SendableChooserSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooserSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a SendableChooserSim.\n\n:param path: The path where the SendableChooser is published.", "returnType": "wpilib.simulation._simulation.SendableChooserSim", "args": [{"name": "path", "type": "str"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SendableChooserSim"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooserSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a SendableChooserSim.\n\n:param inst: The NetworkTables instance.\n:param path: The path where the SendableChooser is published.", "returnType": "wpilib.simulation._simulation.SendableChooserSim", "args": [{"name": "inst", "type": "ntcore._ntcore.NetworkTableInstance"}, {"name": "path", "type": "str"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SendableChooserSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTableInstance"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the selected option.\n\n:param option: The option.", "returnType": "None", "args": [{"name": "sendableChooserSim", "type": "wpilib.simulation._simulation.SendableChooserSim"}, {"name": "option", "type": "str"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SendableChooserSim", "FUNC": "setSelected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooserSim"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
