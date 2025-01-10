// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.StadiaController.Axis

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.StadiaController.Axis", "int", ["kLeftX", "kLeftY", "kRightX", "kRightY"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Axis",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Axis", "VAR": "kLeftX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Axis", "VAR": "kLeftY"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Axis", "VAR": "kRightX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.StadiaController.Axis int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Axis", "VAR": "kRightY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.StadiaController.Axis", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.StadiaController.Axis"}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
