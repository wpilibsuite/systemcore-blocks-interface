// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DoubleSolenoidSim

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "DoubleSolenoidSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DoubleSolenoidSim", "args": [{"name": "moduleSim", "type": "wpilib.simulation._simulation.PneumaticsBaseSim"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DoubleSolenoidSim", "args": [{"name": "module", "type": "int"}, {"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DoubleSolenoidSim", "args": [{"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "fwd", "type": "int"}, {"name": "rev", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.DoubleSolenoid.Value", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation._simulation.DoubleSolenoidSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.PneumaticsBaseSim", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation._simulation.DoubleSolenoidSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "getModuleSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "doubleSolenoidSim", "type": "wpilib.simulation._simulation.DoubleSolenoidSim"}, {"name": "output", "type": "wpilib._wpilib.DoubleSolenoid.Value"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.DoubleSolenoidSim", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDoubleSolenoidSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
