// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DoubleSolenoidSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DoubleSolenoidSim", "args": [{"name": "moduleSim", "type": "wpilib.simulation.PneumaticsBaseSim"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DoubleSolenoidSim", "args": [{"name": "module", "type": "int"}, {"name": "type", "type": "wpilib.PneumaticsModuleType"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DoubleSolenoidSim", "args": [{"name": "type", "type": "wpilib.PneumaticsModuleType"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.DoubleSolenoid.Value", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation.DoubleSolenoidSim"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.simulation.PneumaticsBaseSim", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation.DoubleSolenoidSim"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "getModuleSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation.DoubleSolenoidSim"}, {"name": "output", "type": "wpilib.DoubleSolenoid.Value"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DoubleSolenoidSim",
    contents: contents,
    className: "wpilib.simulation.DoubleSolenoidSim",
  };

  return category;
}
