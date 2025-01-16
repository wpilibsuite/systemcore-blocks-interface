// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.RectangularRegionConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "RectangularRegionConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myRectangularRegionConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.RectangularRegionConstraint", "args": [{"name": "bottomLeftPoint", "type": "wpimath.geometry._geometry.Translation2d"}, {"name": "topRightPoint", "type": "wpimath.geometry._geometry.Translation2d"}, {"name": "constraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}], "tooltip": "Constructs a new RectangularRegionConstraint.\n\n:deprecated: Use constructor taking Rectangle2d instead.\n\n:param bottomLeftPoint: The bottom left point of the rectangular region in\n                        which to enforce the constraint.\n:param topRightPoint:   The top right point of the rectangular region in which\n                        to enforce the constraint.\n:param constraint:      The constraint to enforce when the robot is within the\n                        region.", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.RectangularRegionConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTranslation2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTranslation2d"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myRectangularRegionConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.RectangularRegionConstraint", "args": [{"name": "rectangle", "type": "wpimath.geometry._geometry.Rectangle2d"}, {"name": "constraint", "type": "wpimath._controls._controls.constraint.TrajectoryConstraint"}], "tooltip": "Constructs a new RectangularRegionConstraint.\n\n:param rectangle:  The rectangular region in which to enforce the constraint.\n:param constraint: The constraint to enforce when the robot is within the\n                   region.", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.RectangularRegionConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRectangle2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectoryConstraint"}}}}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "rectangularRegionConstraint", "type": "wpimath._controls._controls.constraint.RectangularRegionConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.RectangularRegionConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRectangularRegionConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "rectangularRegionConstraint", "type": "wpimath._controls._controls.constraint.RectangularRegionConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.RectangularRegionConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRectangularRegionConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
