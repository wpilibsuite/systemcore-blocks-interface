// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.spline.Spline5.ControlVector

python.PythonVariableGetterNames["instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]"] = ["x", "y"];
python.PythonVariableGetterTooltips["instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]"] = ["The x components of the control vector.", "The y components of the control vector."];
python.PythonVariableSetterNames["instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]"] = ["x", "y"];
python.PythonVariableSetterTooltips["instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]"] = ["The x components of the control vector.", "The y components of the control vector."];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "ControlVector",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "Tuple[float, float, float]", "key": "instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "x"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "Tuple[float, float, float]", "key": "instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "x"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "Tuple[float, float, float]", "key": "instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "y"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "Tuple[float, float, float]", "key": "instance wpimath.spline.Spline5.ControlVector Tuple[float, float, float]", "importModule": "", "selfLabel": "controlVector", "selfType": "wpimath.spline.Spline5.ControlVector"}, "fields": {"CLASS": "wpimath.spline.Spline5.ControlVector", "VAR": "y"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlVector"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlVector"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.spline._spline.Spline5.ControlVector", "args": [{"name": "x", "type": "Tuple[float, float, float]"}, {"name": "y", "type": "Tuple[float, float, float]"}], "importModule": "wpimath.spline"}, "fields": {"CLASS": "wpimath.spline.Spline5.ControlVector"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
