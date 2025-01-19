// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.TrajectoryConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint", "args": [], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "trajectoryConstraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "Returns the max velocity given the current pose and curvature.\n\n:param pose:      The pose at the current point in the trajectory.\n:param curvature: The curvature at the current point in the trajectory.\n:param velocity:  The velocity at the current point in the trajectory before\n                  constraints are applied.\n\n:returns: The absolute maximum velocity.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "trajectoryConstraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "Returns the minimum and maximum allowable acceleration for the trajectory\ngiven pose, curvature, and speed.\n\n:param pose:      The pose at the current point in the trajectory.\n:param curvature: The curvature at the current point in the trajectory.\n:param speed:     The speed at the current point in the trajectory.\n\n:returns: The min and max acceleration bounds.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpimath.trajectory.constraint.TrajectoryConstraint",
    name:  "TrajectoryConstraint",
      contents: contents,
  };
  return category;
}
