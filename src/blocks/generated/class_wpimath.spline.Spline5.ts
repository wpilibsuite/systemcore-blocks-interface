// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline5

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Spline5",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySpline5"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.spline._spline.Spline5", "args": [], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.Spline5"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myfloat64[6, 6]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the coefficients of the spline.\n\n:returns: The coefficients of the spline.", "returnType": "numpy.ndarray[numpy.float64[6, 6]]", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline5", "FUNC": "coefficients"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the final control vector that created this spline.\n\n:returns: The final control vector that created this spline.", "returnType": "wpimath.spline._spline.Spline5.ControlVector", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline5", "FUNC": "getFinalControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the initial control vector that created this spline.\n\n:returns: The initial control vector that created this spline.", "returnType": "wpimath.spline._spline.Spline5.ControlVector", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline5", "FUNC": "getInitialControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myradians_per_meter]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the pose and curvature at some point t on the spline.\n\n:param t: The point t\n\n:returns: The pose and curvature at that point.", "returnType": "Optional[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}, {"name": "t", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline5", "FUNC": "getPoint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
