// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXL345Sim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.ADXL345Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL345_I2C"}], "tooltip": "Constructs from a ADXL345_I2C object.\n\n:param accel: ADXL345 accel to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL345Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.ADXL345Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL345_SPI"}], "tooltip": "Constructs from a ADXL345_SPI object.\n\n:param accel: ADXL345 accel to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL345Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the X acceleration.\n\n:param accel: The X acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the Y acceleration.\n\n:param accel: The Y acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "tooltip": "Sets the Z acceleration.\n\n:param accel: The Z acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.simulation.ADXL345Sim",
    name:  "ADXL345Sim",
      contents: contents,
  };
  return category;
}
