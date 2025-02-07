// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.AnalogOutputSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 9 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogOutputSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.AnalogOutputSim", "args": [{"name": "analogOutput", "type": "wpilib._wpilib.AnalogOutput"}], "tooltip": "Constructs from an AnalogOutput object.\n\n:param analogOutput: AnalogOutput to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutput"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogOutputSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.AnalogOutputSim", "args": [{"name": "channel", "type": "int"}], "tooltip": "Constructs from an analog output channel number.\n\n:param channel: Channel number", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}], "tooltip": "Check whether this analog output has been initialized.\n\n:returns: true if initialized", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "getInitialized"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}], "tooltip": "Read the analog output voltage.\n\n:returns: the voltage on this analog output", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "getVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCallbackStore"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.simulation._simulation.CallbackStore", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}, {"name": "callback", "type": "Callable[[str, hal._wpiHal.Value], None]"}, {"name": "initialNotify", "type": "bool"}], "tooltip": "Register a callback to be run when this analog output is initialized.\n\n:param callback:      the callback\n:param initialNotify: whether to run the callback with the initial state\n\n:returns: the CallbackStore object associated with this callback", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "registerInitializedCallback"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue], None]"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCallbackStore"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.simulation._simulation.CallbackStore", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}, {"name": "callback", "type": "Callable[[str, hal._wpiHal.Value], None]"}, {"name": "initialNotify", "type": "bool"}], "tooltip": "Register a callback to be run whenever the voltage changes.\n\n:param callback:      the callback\n:param initialNotify: whether to call the callback with the initial state\n\n:returns: the CallbackStore object associated with this callback", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "registerVoltageCallback"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue], None]"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}], "tooltip": "Reset all simulation data on this object.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "resetData"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}, {"name": "initialized", "type": "bool"}], "tooltip": "Define whether this analog output has been initialized.\n\n:param initialized: whether this object is initialized", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "setInitialized"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogOutputSim", "type": "wpilib.simulation._simulation.AnalogOutputSim"}, {"name": "voltage", "type": "float"}], "tooltip": "Set the analog output voltage.\n\n:param voltage: the new voltage on this analog output", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.AnalogOutputSim", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogOutputSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "AnalogOutputSim",
    contents: contents,
    className: "wpilib.simulation.AnalogOutputSim",
  };

  return category;
}
