// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline5.ControlVector

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.spline.Spline5.ControlVector", "Tuple[float, float, float]", ["x", "y"], ["The x components of the control vector.", "The y components of the control vector."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.spline.Spline5.ControlVector", "Tuple[float, float, float]", ["x", "y"], ["The x components of the control vector.", "The y components of the control vector."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.spline.Spline5.ControlVector", "varType": "Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "x"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.spline.Spline5.ControlVector", "varType": "Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "x"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTuple"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.spline.Spline5.ControlVector", "varType": "Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "y"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.spline.Spline5.ControlVector", "varType": "Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "y"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTuple"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.spline.Spline5.ControlVector", "args": [{"name": "x", "type": "Tuple[float, float, float]"}, {"name": "y", "type": "Tuple[float, float, float]"}], "tooltip": "", "importModule": "wpimath.spline"}, "fields": {"MODULE_OR_CLASS": "wpimath.spline.Spline5.ControlVector"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTuple"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTuple"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ControlVector",
    contents: contents,
    className: "wpimath.spline.Spline5.ControlVector",
  };

  return category;
}
