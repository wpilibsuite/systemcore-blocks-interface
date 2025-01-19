// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Field2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myField2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Field2d", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myFieldObject2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.FieldObject2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "name", "type": "str"}], "tooltip": "Get or create a field object.\n\n:returns: Field object", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "getObject"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myFieldObject2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.FieldObject2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}], "tooltip": "Get the robot object.\n\n:returns: Field object for robot", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "getRobotObject"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.geometry._geometry.Pose2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}], "tooltip": "Get the robot pose.\n\n:returns: 2D pose", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "getRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "builder", "type": "ntcore._ntcore.NTSendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNTSendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}], "tooltip": "Set the robot pose from a Pose object.\n\n:param pose: 2D pose", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "setRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "x", "type": "wpimath.units.meters"}, {"name": "y", "type": "wpimath.units.meters"}, {"name": "rotation", "type": "wpimath.geometry._geometry.Rotation2d"}], "tooltip": "Set the robot pose from x, y, and rotation.\n\n:param x:        X location\n:param y:        Y location\n:param rotation: rotation", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Field2d", "FUNC": "setRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.Field2d",
    name:  "Field2d",
      contents: contents,
  };
  return category;
}
