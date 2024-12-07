// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SwerveDrive2KinematicsConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive2KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.SwerveDrive2KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.SwerveDrive2Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive2Kinematics"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive2KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.SwerveDrive2KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.SwerveDrive2Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive2Kinematics"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "swerveDrive2KinematicsConstraint", "type": "wpimath._controls._controls.constraint.SwerveDrive2KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive2KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "swerveDrive2KinematicsConstraint", "type": "wpimath._controls._controls.constraint.SwerveDrive2KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive2KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
