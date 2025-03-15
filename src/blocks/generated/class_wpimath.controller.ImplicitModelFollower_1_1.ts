// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.controller.ImplicitModelFollower_1_1

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.ImplicitModelFollower_1_1", "args": [{"name": "A", "type": "numpy.ndarray[numpy.float64[1, 1]]"}, {"name": "B", "type": "numpy.ndarray[numpy.float64[1, 1]]"}, {"name": "Aref", "type": "numpy.ndarray[numpy.float64[1, 1]]"}, {"name": "Bref", "type": "numpy.ndarray[numpy.float64[1, 1]]"}], "tooltip": "Constructs a controller with the given coefficients and plant.\n\n:param A:    Continuous system matrix of the plant being controlled.\n:param B:    Continuous input matrix of the plant being controlled.\n:param Aref: Continuous system matrix whose dynamics should be followed.\n:param Bref: Continuous input matrix whose dynamics should be followed.", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.ImplicitModelFollower_1_1", "args": [{"name": "plant", "type": "wpimath.system.LinearSystem_1_1_1"}, {"name": "plantRef", "type": "wpimath.system.LinearSystem_1_1_1"}], "tooltip": "", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_1"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_1"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.ImplicitModelFollower_1_1", "args": [{"name": "plant", "type": "wpimath.system.LinearSystem_1_1_2"}, {"name": "plantRef", "type": "wpimath.system.LinearSystem_1_1_2"}], "tooltip": "", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_2"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_2"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.ImplicitModelFollower_1_1", "args": [{"name": "plant", "type": "wpimath.system.LinearSystem_1_1_3"}, {"name": "plantRef", "type": "wpimath.system.LinearSystem_1_1_3"}], "tooltip": "", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_3"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_1_1_3"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[1, 1]]", "args": [{"name": "implicitModelFollower_1_1", "type": "wpimath.controller.ImplicitModelFollower_1_1"}], "tooltip": "Returns the control input vector u.\n\n:returns: The control input.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1", "FUNC": "U"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "implicitModelFollower_1_1", "type": "wpimath.controller.ImplicitModelFollower_1_1"}, {"name": "i", "type": "int"}], "tooltip": "Returns an element of the control input vector u.\n\n:param i: Row of u.\n\n:returns: The row of the control input vector.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1", "FUNC": "U"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "numpy.ndarray[numpy.float64[1, 1]]", "args": [{"name": "implicitModelFollower_1_1", "type": "wpimath.controller.ImplicitModelFollower_1_1"}, {"name": "x", "type": "numpy.ndarray[numpy.float64[1, 1]]"}, {"name": "u", "type": "numpy.ndarray[numpy.float64[1, 1]]"}], "tooltip": "Returns the next output of the controller.\n\n:param x: The current state x.\n:param u: The current input for the original model.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "implicitModelFollower_1_1", "type": "wpimath.controller.ImplicitModelFollower_1_1"}], "tooltip": "Resets the controller.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.ImplicitModelFollower_1_1", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myImplicitModelFollower_1_1"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ImplicitModelFollower_1_1",
    contents: contents,
    className: "wpimath.controller.ImplicitModelFollower_1_1",
  };

  return category;
}
