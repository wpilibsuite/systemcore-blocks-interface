// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADXRS450_GyroSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.ADXRS450_GyroSim", "args": [{"name": "gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Constructs from a ADXRS450_Gyro object.\n\n:param gyro: ADXRS450_Gyro to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXRS450_GyroSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXRS450_GyroSim", "type": "wpilib.simulation.ADXRS450_GyroSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "tooltip": "Sets the angle.\n\n:param angle: The angle (clockwise positive).", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXRS450_GyroSim", "FUNC": "setAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXRS450_GyroSim", "type": "wpilib.simulation.ADXRS450_GyroSim"}, {"name": "rate", "type": "wpimath.units.degrees_per_second"}], "tooltip": "Sets the angular rate (clockwise positive).\n\n:param rate: The angular rate.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADXRS450_GyroSim", "FUNC": "setRate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_GyroSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ADXRS450_GyroSim",
    contents: contents,
    className: "wpilib.simulation.ADXRS450_GyroSim",
  };

  return category;
}
