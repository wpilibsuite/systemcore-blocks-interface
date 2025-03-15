// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.XboxController.Axis

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.XboxController.Axis", "int", ["kLeftTrigger", "kLeftX", "kLeftY", "kRightTrigger", "kRightX", "kRightY"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftTrigger"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kLeftY"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kRightTrigger"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kRightX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Axis", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis", "VAR": "kRightY"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.XboxController.Axis", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Axis"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Axis",
    contents: contents,
    className: "wpilib.XboxController.Axis",
  };

  return category;
}
