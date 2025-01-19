// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline5

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySpline5"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.spline._spline.Spline5", "args": [], "tooltip": "", "importModule": "wpimath.spline"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myfloat64[6, 6]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[6, 6]]", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "tooltip": "Returns the coefficients of the spline.\n\n:returns: The coefficients of the spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5", "FUNC": "coefficients"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.spline._spline.Spline5.ControlVector", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "tooltip": "Returns the final control vector that created this spline.\n\n:returns: The final control vector that created this spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5", "FUNC": "getFinalControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.spline._spline.Spline5.ControlVector", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}], "tooltip": "Returns the initial control vector that created this spline.\n\n:returns: The initial control vector that created this spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5", "FUNC": "getInitialControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myradians_per_meter]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "Optional[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline5", "type": "wpimath.spline._spline.Spline5"}, {"name": "t", "type": "float"}], "tooltip": "Gets the pose and curvature at some point t on the spline.\n\n:param t: The point t\n\n:returns: The pose and curvature at that point.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5", "FUNC": "getPoint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline5"}}}}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpimath.spline.Spline5",
    name:  "Spline5",
      contents: contents,
  };
  return category;
}
