// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.StadiaController.Axis

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.StadiaController.Axis", "int", ["kLeftX", "kLeftY", "kRightX", "kRightY"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Axis", "VAR": "kLeftX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Axis", "VAR": "kLeftY"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Axis", "VAR": "kRightX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Axis", "VAR": "kRightY"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.StadiaController.Axis", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Axis"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Axis",
    contents: contents,
    className: "wpilib.StadiaController.Axis",
  };

  return category;
}
