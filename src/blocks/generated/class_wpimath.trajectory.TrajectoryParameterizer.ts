// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrajectoryParameterizer

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "TrajectoryParameterizer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectoryParameterizer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.TrajectoryParameterizer", "args": [], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryParameterizer"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Parameterize the trajectory by time. This is where the velocity profile is\ngenerated.\n\nThe derivation of the algorithm used can be found here:\n<http://www2.informatik.uni-freiburg.de/~lau/students/Sprunk2008.pdf>\n\n:param points:          Reference to the spline points.\n:param constraints:     A vector of various velocity and acceleration\n                        constraints.\n:param startVelocity:   The start velocity for the trajectory.\n:param endVelocity:     The end velocity for the trajectory.\n:param maxVelocity:     The max velocity for the trajectory.\n:param maxAcceleration: The max acceleration for the trajectory.\n:param reversed:        Whether the robot should move backwards. Note that the\n                        robot will still move from a -> b -> ... -> z as defined in the waypoints.\n\n:returns: The trajectory.", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "points", "type": "list[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]"}, {"name": "constraints", "type": "list[wpimath._controls._controls.constraint.TrajectoryConstraint]"}, {"name": "startVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "endVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "maxVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "maxAcceleration", "type": "wpimath.units.meters_per_second_squared"}, {"name": "reversed", "type": "bool"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryParameterizer", "FUNC": "timeParameterizeTrajectory"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
