// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SwerveDrive4KinematicsConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive4KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.SwerveDrive4KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.SwerveDrive4Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.meters_per_second"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4Kinematics"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive4KinematicsConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.SwerveDrive4KinematicsConstraint", "args": [{"name": "kinematics", "type": "wpimath.kinematics._kinematics.SwerveDrive4Kinematics"}, {"name": "maxSpeed", "type": "wpimath.units.feet_per_second"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint", "FUNC": "fromFps"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4Kinematics"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "swerveDrive4KinematicsConstraint", "type": "wpimath._controls._controls.constraint.SwerveDrive4KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "swerveDrive4KinematicsConstraint", "type": "wpimath._controls._controls.constraint.SwerveDrive4KinematicsConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4KinematicsConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
