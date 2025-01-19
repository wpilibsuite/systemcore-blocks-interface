// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline3

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySpline3"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.spline._spline.Spline3", "args": [], "tooltip": "", "importModule": "wpimath.spline"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline3"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myfloat64[6, 4]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[6, 4]]", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "tooltip": "Returns the coefficients of the spline.\n\n:returns: The coefficients of the spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline3", "FUNC": "coefficients"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.spline._spline.Spline3.ControlVector", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "tooltip": "Returns the final control vector that created this spline.\n\n:returns: The final control vector that created this spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline3", "FUNC": "getFinalControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.spline._spline.Spline3.ControlVector", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}], "tooltip": "Returns the initial control vector that created this spline.\n\n:returns: The initial control vector that created this spline.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline3", "FUNC": "getInitialControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myradians_per_meter]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "Optional[tuple[wpimath.geometry._geometry.Pose2d, wpimath.units.radians_per_meter]]", "args": [{"name": "spline3", "type": "wpimath.spline._spline.Spline3"}, {"name": "t", "type": "float"}], "tooltip": "Gets the pose and curvature at some point t on the spline.\n\n:param t: The point t\n\n:returns: The pose and curvature at that point.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline3", "FUNC": "getPoint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySpline3"}}}}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpimath.spline.Spline3",
    name:  "Spline3",
      contents: contents,
  };
  return category;
}
