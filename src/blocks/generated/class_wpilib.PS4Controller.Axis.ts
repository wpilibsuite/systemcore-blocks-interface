// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.PS4Controller.Axis

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.PS4Controller.Axis", "int", ["kL2", "kLeftX", "kLeftY", "kR2", "kRightX", "kRightY"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Axis",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kL2"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kLeftX"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kLeftY"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kR2"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kRightX"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis", "VAR": "kRightY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.PS4Controller.Axis", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Axis"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
