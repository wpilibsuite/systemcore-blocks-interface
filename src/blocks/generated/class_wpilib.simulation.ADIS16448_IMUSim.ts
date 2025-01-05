// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.ADIS16448_IMUSim

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "ADIS16448_IMUSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from a ADIS16448_IMU object.\n\n:param imu: ADIS16448_IMU to simulate", "returnType": "wpilib.simulation._simulation.ADIS16448_IMUSim", "args": [{"name": "imu", "type": "wpilib._wpilib.ADIS16448_IMU"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMU"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the X axis acceleration.\n\n:param accel: The acceleration.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Y axis acceleration.\n\n:param accel: The acceleration.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Z axis acceleration.\n\n:param accel: The acceleration.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "accel", "type": "wpimath.units.meters_per_second_squared"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setAccelZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the X axis angle (CCW positive).\n\n:param angle: The angle.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Y axis angle (CCW positive).\n\n:param angle: The angle.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Z axis angle (CCW positive).\n\n:param angle: The angle.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angle", "type": "wpimath.units.degrees"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroAngleZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the X axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Y axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the Z axis angular rate (CCW positive).\n\n:param angularRate: The angular rate.", "returnType": "None", "args": [{"name": "aDIS16448_IMUSim", "type": "wpilib.simulation._simulation.ADIS16448_IMUSim"}, {"name": "angularRate", "type": "wpimath.units.degrees_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.ADIS16448_IMUSim", "FUNC": "setGyroRateZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADIS16448_IMUSim"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
