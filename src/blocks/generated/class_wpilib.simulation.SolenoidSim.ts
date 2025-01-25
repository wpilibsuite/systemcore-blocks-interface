// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.SolenoidSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "moduleSim", "type": "wpilib.simulation._simulation.PneumaticsBaseSim"}, {"name": "channel", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "module", "type": "int"}, {"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoidSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.SolenoidSim", "args": [{"name": "type", "type": "wpilib._wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPneumaticsBaseSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.simulation._simulation.PneumaticsBaseSim", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "getModuleSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCallbackStore"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.simulation._simulation.CallbackStore", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}, {"name": "callback", "type": "Callable[[str, hal._wpiHal.Value], None]"}, {"name": "initialNotify", "type": "bool"}], "tooltip": "Register a callback to be run when the output of this solenoid has changed.\n\n:param callback:      the callback\n:param initialNotify: whether to run the callback with the initial state\n\n:returns: the :class:`.CallbackStore` object associated with this callback.\n          Save a reference to this object; it being deconstructed cancels the\n          callback.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "registerOutputCallback"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue], None]"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoidSim", "type": "wpilib.simulation._simulation.SolenoidSim"}, {"name": "output", "type": "bool"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.SolenoidSim", "FUNC": "setOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoidSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SolenoidSim",
    contents: contents,
    className: "wpilib.simulation.SolenoidSim",
  };

  return category;
}
