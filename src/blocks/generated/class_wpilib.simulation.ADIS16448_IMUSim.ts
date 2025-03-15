// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADIS16448_IMUSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.ADIS16448_IMUSim", "args": [{"name": "imu", "type": "wpilib.ADIS16448_IMU"}], "tooltip": "Constructs from a ADIS16448_IMU object.\n\n:param imu: ADIS16448_IMU to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMU"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "tooltip": "Sets the X axis acceleration.\n\n:param accel: The acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "tooltip": "Sets the Y axis acceleration.\n\n:param accel: The acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "tooltip": "Sets the Z axis acceleration.\n\n:param accel: The acceleration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "tooltip": "Sets the X axis angle (CCW positive).\n\n:param angle: The angle.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "tooltip": "Sets the Y axis angle (CCW positive).\n\n:param angle: The angle.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "tooltip": "Sets the Z axis angle (CCW positive).\n\n:param angle: The angle.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "tooltip": "Sets the X axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "tooltip": "Sets the Y axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "tooltip": "Sets the Z axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ADIS16448_IMUSim",
    contents: contents,
    className: "wpilib.simulation.ADIS16448_IMUSim",
  };

  return category;
}
