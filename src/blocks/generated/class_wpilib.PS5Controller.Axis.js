// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.PS5Controller.Axis

python.PythonVariableGetterNames["class wpilib.PS5Controller.Axis int"] = ["kL2", "kLeftX", "kLeftY", "kR2", "kRightX", "kRightY"];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Axis",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kL2"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kLeftX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kLeftY"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kR2"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kRightX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.PS5Controller.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis", "VAR": "kRightY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.PS5Controller.Axis", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.PS5Controller.Axis"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
