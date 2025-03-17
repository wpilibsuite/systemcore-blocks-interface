// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.spline.SplineParameterizer

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 2 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "list[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline", "type": "wpimath.spline.Spline3"}, {"name": "t0", "type": "float"}, {"name": "t1", "type": "float"}], "tooltip": "Parametrizes the spline. This method breaks up the spline into various\narcs until their dx, dy, and dtheta are within specific tolerances.\n\n:param spline: The spline to parameterize.\n:param t0:     Starting internal spline parameter. It is recommended to leave\n               this as default.\n:param t1:     Ending internal spline parameter. It is recommended to leave this\n               as default.\n\n:returns: A vector of poses and curvatures that represents various points on\n          the spline.", "importModule": "wpimath.spline"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.SplineParameterizer", "FUNC": "parameterize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "list[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline", "type": "wpimath.spline.Spline5"}, {"name": "t0", "type": "float"}, {"name": "t1", "type": "float"}], "tooltip": "Parametrizes the spline. This method breaks up the spline into various\narcs until their dx, dy, and dtheta are within specific tolerances.\n\n:param spline: The spline to parameterize.\n:param t0:     Starting internal spline parameter. It is recommended to leave\n               this as default.\n:param t1:     Ending internal spline parameter. It is recommended to leave this\n               as default.\n\n:returns: A vector of poses and curvatures that represents various points on\n          the spline.", "importModule": "wpimath.spline"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.SplineParameterizer", "FUNC": "parameterize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SplineParameterizer",
    contents: contents,
    className: "wpimath.spline.SplineParameterizer",
  };

  return category;
}
