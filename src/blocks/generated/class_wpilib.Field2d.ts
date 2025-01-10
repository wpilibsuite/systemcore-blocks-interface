// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.Field2d

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Field2d",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myField2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.Field2d", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Field2d"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myFieldObject2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get or create a field object.\n\n:returns: Field object", "returnType": "wpilib._wpilib.FieldObject2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "name", "type": "str"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "getObject"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myFieldObject2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the robot object.\n\n:returns: Field object for robot", "returnType": "wpilib._wpilib.FieldObject2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "getRobotObject"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the robot pose.\n\n:returns: 2D pose", "returnType": "wpimath.geometry._geometry.Pose2d", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "getRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "builder", "type": "ntcore._ntcore.NTSendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNTSendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the robot pose from a Pose object.\n\n:param pose: 2D pose", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "setRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the robot pose from x, y, and rotation.\n\n:param x:        X location\n:param y:        Y location\n:param rotation: rotation", "returnType": "None", "args": [{"name": "field2d", "type": "wpilib._wpilib.Field2d"}, {"name": "x", "type": "wpimath.units.meters"}, {"name": "y", "type": "wpimath.units.meters"}, {"name": "rotation", "type": "wpimath.geometry._geometry.Rotation2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Field2d", "FUNC": "setRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myField2d"}}}}, "ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
