// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXL345Sim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ADXL345Sim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a ADXL345_I2C object.\n\n:param accel: ADXL345 accel to simulate", "returnType": "wpilib.simulation._simulation.ADXL345Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.ADXL345Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a ADXL345_SPI object.\n\n:param accel: ADXL345 accel to simulate", "returnType": "wpilib.simulation._simulation.ADXL345Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL345_SPI"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.ADXL345Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the X acceleration.\n\n:param accel: The X acceleration.", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Y acceleration.\n\n:param accel: The Y acceleration.", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Z acceleration.\n\n:param accel: The Z acceleration.", "returnType": "None", "args": [{"name": "aDXL345Sim", "type": "wpilib.simulation._simulation.ADXL345Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL345Sim", "FUNC": "setZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345Sim"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
