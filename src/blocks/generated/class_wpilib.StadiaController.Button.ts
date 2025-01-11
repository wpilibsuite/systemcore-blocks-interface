// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.StadiaController.Button

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.StadiaController.Button", "int", ["kA", "kB", "kEllipses", "kFrame", "kGoogle", "kHamburger", "kLeftBumper", "kLeftStick", "kLeftTrigger", "kRightBumper", "kRightStick", "kRightTrigger", "kStadia", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Button",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kA"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kB"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kEllipses"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kFrame"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kGoogle"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kHamburger"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftBumper"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftStick"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftTrigger"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kRightBumper"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kRightStick"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kRightTrigger"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kStadia"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Button int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button", "VAR": "kY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myButton"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.StadiaController.Button", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Button"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
