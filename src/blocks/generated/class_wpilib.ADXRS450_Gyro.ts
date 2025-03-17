// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.ADXRS450_Gyro

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.ADXRS450_Gyro", "args": [], "tooltip": "%Gyro constructor on onboard CS0.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.ADXRS450_Gyro", "args": [{"name": "port", "type": "wpilib.SPI.Port"}], "tooltip": "%Gyro constructor on the specified SPI port.\n\n:param port: The SPI port the gyro is attached to.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPort"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Calibrate the gyro by running for a number of samples and computing the\ncenter value. Then use the center value as the Accumulator center value for\nsubsequent measurements.\n\nIt's important to make sure that the robot is not moving while the\ncentering calculations are in progress, this is typically done when the\nrobot is first turned on while it's sitting at rest before the competition\nstarts.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "calibrate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Return the actual angle in degrees that the robot is currently facing.\n\nThe angle is based on integration of the returned rate from the gyro.\nThe angle is continuous, that is it will continue from 360->361 degrees.\nThis allows algorithms that wouldn't want to see a discontinuity in the\ngyro output as it sweeps from 360 to 0 on the second time around.\n\n:returns: the current heading of the robot in degrees.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "getAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Get the SPI port number.\n\n:returns: The SPI port number.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "getPort"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Return the rate of rotation of the gyro\n\nThe rate is based on the most recent reading of the gyro.\n\n:returns: the current rate in degrees per second", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "getRate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myRotation2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.geometry.Rotation2d", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Return the heading of the robot as a Rotation2d.\n\nThe angle is continuous, that is it will continue from 360 to 361 degrees.\nThis allows algorithms that wouldn't want to see a discontinuity in the\ngyro output as it sweeps past from 360 to 0 on the second time around.\n\nThe angle is expected to increase as the gyro turns counterclockwise when\nlooked at from the top. It needs to follow the NWU axis convention.\n\n:returns: the current heading of the robot as a Rotation2d. This heading is\n          based on integration of the returned rate from the gyro.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "getRotation2d"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "isConnected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXRS450_Gyro", "type": "wpilib.ADXRS450_Gyro"}], "tooltip": "Reset the gyro.\n\nResets the gyro to a heading of zero. This can be used if there is\nsignificant drift in the gyro and it needs to be recalibrated after it has\nbeen running.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXRS450_Gyro", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXRS450_Gyro"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ADXRS450_Gyro",
    contents: contents,
    className: "wpilib.ADXRS450_Gyro",
  };

  return category;
}
