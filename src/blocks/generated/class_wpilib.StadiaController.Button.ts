// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.StadiaController.Button

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.StadiaController.Button", "int", ["kA", "kB", "kEllipses", "kFrame", "kGoogle", "kHamburger", "kLeftBumper", "kLeftStick", "kLeftTrigger", "kRightBumper", "kRightStick", "kRightTrigger", "kStadia", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 16 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kA"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kB"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kEllipses"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kFrame"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kGoogle"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kHamburger"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftBumper"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftStick"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kLeftTrigger"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kRightBumper"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kRightStick"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kRightTrigger"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kStadia"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.StadiaController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button", "VAR": "kY"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myButton"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.StadiaController.Button", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.StadiaController.Button"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Button",
    contents: contents,
    className: "wpilib.StadiaController.Button",
  };

  return category;
}
