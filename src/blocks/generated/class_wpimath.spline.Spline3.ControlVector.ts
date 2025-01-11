// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.spline.Spline3.ControlVector

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.spline.Spline3.ControlVector", "Tuple[float, float]", ["x", "y"], ["The x components of the control vector.", "The y components of the control vector."]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.spline.Spline3.ControlVector", "Tuple[float, float]", ["x", "y"], ["The x components of the control vector.", "The y components of the control vector."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ControlVector",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "Tuple[float, float]", "key": "instance wpimath.spline.Spline3.ControlVector Tuple[float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline3.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline3.ControlVector", "VAR": "x"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "Tuple[float, float]", "key": "instance wpimath.spline.Spline3.ControlVector Tuple[float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline3.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline3.ControlVector", "VAR": "x"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "Tuple[float, float]", "key": "instance wpimath.spline.Spline3.ControlVector Tuple[float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline3.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline3.ControlVector", "VAR": "y"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "Tuple[float, float]", "key": "instance wpimath.spline.Spline3.ControlVector Tuple[float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline3.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline3.ControlVector", "VAR": "y"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.spline._spline.Spline3.ControlVector", "args": [{"name": "x", "type": "Tuple[float, float]"}, {"name": "y", "type": "Tuple[float, float]"}], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.Spline3.ControlVector"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
