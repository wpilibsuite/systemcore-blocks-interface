// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.LinearSystemSim_1_1_1

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 9 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.LinearSystemSim_1_1_1", "args": [{"name": "system", "type": "wpimath.system.LinearSystem_1_1_1"}, {"name": "measurementStdDevs", "type": "Annotated[list[float], FixedSize(1)]"}], "tooltip": "Creates a simulated generic linear system.\n\n:param system:             The system to simulate.\n:param measurementStdDevs: The standard deviations of the measurements.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_1"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[1, 1]]", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}], "tooltip": "Returns the current input of the plant.\n\n:returns: The current input of the plant.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "getInput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "row", "type": "int"}], "tooltip": "Returns an element of the current input of the plant.\n\n:param row: The row to return.\n\n:returns: An element of the current input of the plant.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "getInput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[1, 1]]", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}], "tooltip": "Returns the current output of the plant.\n\n:returns: The current output of the plant.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "row", "type": "int"}], "tooltip": "Returns an element of the current output of the plant.\n\n:param row: The row to return.\n\n:returns: An element of the current output of the plant.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "u", "type": "numpy.ndarray[numpy.float64[1, 1]]"}], "tooltip": "Sets the system inputs (usually voltages).\n\n:param u: The system inputs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "setInput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "row", "type": "int"}, {"name": "value", "type": "float"}], "tooltip": "Sets the system inputs.\n\n:param row:   The row in the input matrix to set.\n:param value: The value to set the row to.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "setInput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "state", "type": "numpy.ndarray[numpy.float64[1, 1]]"}], "tooltip": "Sets the system state.\n\n:param state: The new state.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "setState"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "linearSystemSim_1_1_1", "type": "wpilib.simulation.LinearSystemSim_1_1_1"}, {"name": "dt", "type": "wpimath.units.seconds"}], "tooltip": "Updates the simulation.\n\n:param dt: The time between updates.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.LinearSystemSim_1_1_1", "FUNC": "update"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystemSim_1_1_1"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "LinearSystemSim_1_1_1",
    contents: contents,
    className: "wpilib.simulation.LinearSystemSim_1_1_1",
  };

  return category;
}
