// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.spline.SplineParameterizer

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SplineParameterizer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Parametrizes the spline. This method breaks up the spline into various\narcs until their dx, dy, and dtheta are within specific tolerances.\n\n:param spline: The spline to parameterize.\n:param t0:     Starting internal spline parameter. It is recommended to leave\n               this as default.\n:param t1:     Ending internal spline parameter. It is recommended to leave this\n               as default.\n\n:returns: A vector of poses and curvatures that represents various points on\n          the spline.", "returnType": "list[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline", "type": "wpimath.spline._spline.Spline3"}, {"name": "t0", "type": "float"}, {"name": "t1", "type": "float"}], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.SplineParameterizer", "FUNC": "parameterize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Parametrizes the spline. This method breaks up the spline into various\narcs until their dx, dy, and dtheta are within specific tolerances.\n\n:param spline: The spline to parameterize.\n:param t0:     Starting internal spline parameter. It is recommended to leave\n               this as default.\n:param t1:     Ending internal spline parameter. It is recommended to leave this\n               as default.\n\n:returns: A vector of poses and curvatures that represents various points on\n          the spline.", "returnType": "list[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline", "type": "wpimath.spline._spline.Spline5"}, {"name": "t0", "type": "float"}, {"name": "t1", "type": "float"}], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.SplineParameterizer", "FUNC": "parameterize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
