// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.SendableChooserSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooserSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SendableChooserSim", "args": [{"name": "path", "type": "str"}], "tooltip": "Constructs a SendableChooserSim.\n\n:param path: The path where the SendableChooser is published.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SendableChooserSim"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooserSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SendableChooserSim", "args": [{"name": "inst", "type": "ntcore._ntcore.NetworkTableInstance"}, {"name": "path", "type": "str"}], "tooltip": "Constructs a SendableChooserSim.\n\n:param inst: The NetworkTables instance.\n:param path: The path where the SendableChooser is published.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SendableChooserSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTableInstance"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendableChooserSim", "type": "wpilib.simulation._simulation.SendableChooserSim"}, {"name": "option", "type": "str"}], "tooltip": "Set the selected option.\n\n:param option: The option.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SendableChooserSim", "FUNC": "setSelected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooserSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SendableChooserSim",
    contents: contents,
    className: "wpilib.simulation.SendableChooserSim",
  };

  return category;
}
