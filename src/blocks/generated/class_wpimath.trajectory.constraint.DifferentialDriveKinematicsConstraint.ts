// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.DifferentialDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveKinematics"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics.DifferentialDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveKinematics"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "differentialDriveKinematicsConstraint", "type": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "differentialDriveKinematicsConstraint", "type": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DifferentialDriveKinematicsConstraint",
    contents: contents,
    className: "wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint",
  };

  return category;
}
