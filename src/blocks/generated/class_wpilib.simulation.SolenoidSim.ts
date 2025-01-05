// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.SolenoidSim

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SolenoidSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "moduleSim", "type": "wpilib.simulation._simulation.PneumaticsBaseSim"}, {"name": "channel", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "module", "type": "int"}, {"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.PneumaticsBaseSim", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "getModuleSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "bool", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCallbackStore"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Register a callback to be run when the output of this solenoid has changed.\n\n:param callback:      the callback\n:param initialNotify: whether to run the callback with the initial state\n\n:returns: the :class:`.CallbackStore` object associated with this callback.\n          Save a reference to this object; it being deconstructed cancels the\n          callback.", "returnType": "wpilib.simulation._simulation.CallbackStore", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}, {"name": "callback", "type": "Callable[[str, hal._wpiHal.Value], None]"}, {"name": "initialNotify", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "registerOutputCallback"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue], None]"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}, {"name": "output", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "setOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
