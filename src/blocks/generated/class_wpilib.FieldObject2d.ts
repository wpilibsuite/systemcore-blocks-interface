// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.FieldObject2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.geometry._geometry.Pose2d", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}], "tooltip": "Get the pose.\n\n:returns: 2D pose, or 0,0,0 if unknown / does not exist", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "getPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "list[wpimath.geometry._geometry.Pose2d]", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}], "tooltip": "Get multiple poses.\n\n:returns: vector of 2D poses", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "getPoses"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}], "tooltip": "Set the pose from a Pose object.\n\n:param pose: 2D pose", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "setPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}, {"name": "x", "type": "wpimath.units.meters"}, {"name": "y", "type": "wpimath.units.meters"}, {"name": "rotation", "type": "wpimath.geometry._geometry.Rotation2d"}], "tooltip": "Set the pose from x, y, and rotation.\n\n:param x:        X location\n:param y:        Y location\n:param rotation: rotation", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "setPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}, "ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}, {"name": "poses", "type": "List[wpimath.geometry._geometry.Pose2d]"}], "tooltip": "Set multiple poses from an array of Pose objects.\nThe total number of poses is limited to 85.\n\n:param poses: array of 2D poses", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "setPoses"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d]"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "fieldObject2d", "type": "wpilib._wpilib.FieldObject2d"}, {"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}], "tooltip": "Sets poses from a trajectory.\n\n:param trajectory: The trajectory from which poses should be added.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.FieldObject2d", "FUNC": "setTrajectory"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myFieldObject2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.FieldObject2d",
    name:  "FieldObject2d",
      contents: contents,
  };
  return category;
}
