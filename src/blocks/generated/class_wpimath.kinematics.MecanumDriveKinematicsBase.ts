// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.MecanumDriveKinematicsBase

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveKinematicsBase"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics.MecanumDriveKinematicsBase", "args": [], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveKinematicsBase"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics.MecanumDriveWheelPositions", "args": [{"name": "mecanumDriveKinematicsBase", "type": "wpimath.kinematics.MecanumDriveKinematicsBase"}, {"name": "start", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}, {"name": "end", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}, {"name": "t", "type": "float"}], "tooltip": "Performs interpolation between two values.\n\n:param start: The value to start at.\n:param end:   The value to end at.\n:param t:     How far between the two values to interpolate. This should be\n              bounded to [0, 1].\n\n:returns: The interpolated value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveKinematicsBase", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myChassisSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics.ChassisSpeeds", "args": [{"name": "mecanumDriveKinematicsBase", "type": "wpimath.kinematics.MecanumDriveKinematicsBase"}, {"name": "wheelSpeeds", "type": "wpimath.kinematics.MecanumDriveWheelSpeeds"}], "tooltip": "Performs forward kinematics to return the resulting chassis speed from the\nwheel speeds. This method is often used for odometry -- determining the\nrobot's position on the field using data from the real-world speed of each\nwheel on the robot.\n\n:param wheelSpeeds: The speeds of the wheels.\n\n:returns: The chassis speed.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveKinematicsBase", "FUNC": "toChassisSpeeds"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelSpeeds"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.geometry.Twist2d", "args": [{"name": "mecanumDriveKinematicsBase", "type": "wpimath.kinematics.MecanumDriveKinematicsBase"}, {"name": "start", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}, {"name": "end", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}], "tooltip": "Performs forward kinematics to return the resulting Twist2d from the given\nchange in wheel positions. This method is often used for odometry --\ndetermining the robot's position on the field using changes in the distance\ndriven by each wheel on the robot.\n\n:param start: The starting distances driven by the wheels.\n:param end:   The ending distances driven by the wheels.\n\n:returns: The resulting Twist2d in the robot's movement.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveKinematicsBase", "FUNC": "toTwist2d"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics.MecanumDriveWheelSpeeds", "args": [{"name": "mecanumDriveKinematicsBase", "type": "wpimath.kinematics.MecanumDriveKinematicsBase"}, {"name": "chassisSpeeds", "type": "wpimath.kinematics.ChassisSpeeds"}], "tooltip": "Performs inverse kinematics to return the wheel speeds from a desired\nchassis velocity. This method is often used to convert joystick values into\nwheel speeds.\n\n:param chassisSpeeds: The desired chassis speed.\n\n:returns: The wheel speeds.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveKinematicsBase", "FUNC": "toWheelSpeeds"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myChassisSpeeds"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MecanumDriveKinematicsBase",
    contents: contents,
    className: "wpimath.kinematics.MecanumDriveKinematicsBase",
  };

  return category;
}
