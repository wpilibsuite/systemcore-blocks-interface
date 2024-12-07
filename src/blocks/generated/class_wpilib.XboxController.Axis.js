// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.XboxController.Axis

python.PythonVariableGetterNames["class wpilib.XboxController.Axis int"] = ["kLeftTrigger", "kLeftX", "kLeftY", "kRightTrigger", "kRightX", "kRightY"];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Axis",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftTrigger"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftY"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kRightTrigger"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kRightX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis", "VAR": "kRightY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.XboxController.Axis", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Axis"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
