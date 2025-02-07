// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXL362Sim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL362Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.ADXL362Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL362"}], "tooltip": "Constructs from a ADXL362 object.\n\n:param accel: ADXL362 accel to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL362Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the X acceleration.\n\n:param accel: The X acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the Y acceleration.\n\n:param accel: The Y acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the Z acceleration.\n\n:param accel: The Z acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ADXL362Sim",
    contents: contents,
    className: "wpilib.simulation.ADXL362Sim",
  };

  return category;
}
