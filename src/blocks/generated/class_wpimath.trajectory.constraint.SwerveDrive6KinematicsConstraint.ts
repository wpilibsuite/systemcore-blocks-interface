// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive6KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.SwerveDrive6Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive6Kinematics"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive6KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.SwerveDrive6Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive6Kinematics"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "swerveDrive6KinematicsConstraint", "type": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive6KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "swerveDrive6KinematicsConstraint", "type": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive6KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SwerveDrive6KinematicsConstraint",
    contents: contents,
    className: "wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint",
  };

  return category;
}
