// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXL362Sim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ADXL362Sim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL362Sim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a ADXL362 object.\n\n:param accel: ADXL362 accel to simulate", "returnType": "wpilib.simulation._simulation.ADXL362Sim", "args": [{"name": "accel", "type": "wpilib._wpilib.ADXL362"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.ADXL362Sim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the X acceleration.\n\n:param accel: The X acceleration.", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Y acceleration.\n\n:param accel: The Y acceleration.", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Z acceleration.\n\n:param accel: The Z acceleration.", "returnType": "None", "args": [{"name": "aDXL362Sim", "type": "wpilib.simulation._simulation.ADXL362Sim"}, {"name": "accel", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXL362Sim", "FUNC": "setZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL362Sim"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
