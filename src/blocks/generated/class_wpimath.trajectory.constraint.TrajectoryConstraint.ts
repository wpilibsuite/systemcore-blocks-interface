// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.TrajectoryConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "TrajectoryConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint", "args": [], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the max velocity given the current pose and curvature.\n\n:param pose:      The pose at the current point in the trajectory.\n:param curvature: The curvature at the current point in the trajectory.\n:param velocity:  The velocity at the current point in the trajectory before\n                  constraints are applied.\n\n:returns: The absolute maximum velocity.", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "trajectoryConstraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the minimum and maximum allowable acceleration for the trajectory\ngiven pose, curvature, and speed.\n\n:param pose:      The pose at the current point in the trajectory.\n:param curvature: The curvature at the current point in the trajectory.\n:param speed:     The speed at the current point in the trajectory.\n\n:returns: The min and max acceleration bounds.", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "trajectoryConstraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
