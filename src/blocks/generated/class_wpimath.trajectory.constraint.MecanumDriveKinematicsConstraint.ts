// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MecanumDriveKinematicsConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.MecanumDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.MecanumDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematics"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath._controls._controls.constraint.MecanumDriveKinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.MecanumDriveKinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematics"}}}}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "mecanumDriveKinematicsConstraint", "type": "wpimath._controls._controls.constraint.MecanumDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "mecanumDriveKinematicsConstraint", "type": "wpimath._controls._controls.constraint.MecanumDriveKinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveKinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
