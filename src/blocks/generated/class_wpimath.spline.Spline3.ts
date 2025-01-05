// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline3

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "Spline3",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySpline3"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.spline._spline.Spline3", "args": [], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.Spline3"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myfloat64[6, 4]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the coefficients of the spline.\n\n:returns: The coefficients of the spline.", "returnType": "numpy.ndarray[numpy.float64[6, 4]]", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline3", "FUNC": "coefficients"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the final control vector that created this spline.\n\n:returns: The final control vector that created this spline.", "returnType": "wpimath.spline._spline.Spline3.ControlVector", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline3", "FUNC": "getFinalControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the initial control vector that created this spline.\n\n:returns: The initial control vector that created this spline.", "returnType": "wpimath.spline._spline.Spline3.ControlVector", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline3", "FUNC": "getInitialControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTuple"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the pose and curvature at some point t on the spline.\n\n:param t: The point t\n\n:returns: The pose and curvature at that point.", "returnType": "tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}, {"name": "t", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.spline.Spline3", "FUNC": "getPoint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
