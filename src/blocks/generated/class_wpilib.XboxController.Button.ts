// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.XboxController.Button

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.XboxController.Button", "int", ["kA", "kB", "kBack", "kLeftBumper", "kLeftStick", "kRightBumper", "kRightStick", "kStart", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 11 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kA"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kB"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kBack"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kLeftBumper"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kLeftStick"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kRightBumper"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kRightStick"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kStart"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.XboxController.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button", "VAR": "kY"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myButton"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.XboxController.Button", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.XboxController.Button"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Button",
    contents: contents,
    className: "wpilib.XboxController.Button",
  };

  return category;
}
