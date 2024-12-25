// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.XboxController.Button

python.PythonVariableGetterNames["class wpilib.XboxController.Button int"] = ["kA", "kB", "kBack", "kLeftBumper", "kLeftStick", "kRightBumper", "kRightStick", "kStart", "kX", "kY"];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Button",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kA"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kB"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kBack"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kLeftBumper"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kLeftStick"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kRightBumper"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kRightStick"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kStart"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.XboxController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button", "VAR": "kY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myButton"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.XboxController.Button", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.XboxController.Button"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
