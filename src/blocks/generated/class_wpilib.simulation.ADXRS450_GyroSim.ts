// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXRS450_GyroSim

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ADXRS450_GyroSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a ADXRS450_Gyro object.\n\n:param gyro: ADXRS450_Gyro to simulate", "returnType": "wpilib.simulation._simulation.ADXRS450_GyroSim", "args": [{"name": "gyro", "type": "wpilib._wpilib.ADXRS450_Gyro"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.ADXRS450_GyroSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the angle.\n\n:param angle: The angle (clockwise positive).", "returnType": "None", "args": [{"name": "aDXRS450_GyroSim", "type": "wpilib.simulation._simulation.ADXRS450_GyroSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXRS450_GyroSim", "FUNC": "setAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the angular rate (clockwise positive).\n\n:param rate: The angular rate.", "returnType": "None", "args": [{"name": "aDXRS450_GyroSim", "type": "wpilib.simulation._simulation.ADXRS450_GyroSim"}, {"name": "rate", "type": "wpimath.units.degrees_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADXRS450_GyroSim", "FUNC": "setRate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
