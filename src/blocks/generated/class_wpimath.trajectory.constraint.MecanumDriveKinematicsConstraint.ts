// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.MecanumDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematics"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.MecanumDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematics"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "mecanumDriveKinematicsConstraint", "type": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "mecanumDriveKinematicsConstraint", "type": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MecanumDriveKinematicsConstraint",
    contents: contents,
    className: "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint",
  };

  return category;
}
