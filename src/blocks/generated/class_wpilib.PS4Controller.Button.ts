// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.PS4Controller.Button

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.PS4Controller.Button", "int", ["kCircle", "kCross", "kL1", "kL2", "kL3", "kOptions", "kPS", "kR1", "kR2", "kR3", "kShare", "kSquare", "kTouchpad", "kTriangle"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 15 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kCircle"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kCross"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kL1"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kL2"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kL3"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kOptions"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kPS"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kR1"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kR2"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kR3"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kShare"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kSquare"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kTouchpad"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.PS4Controller.Button", "varType": "int", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button", "VAR": "kTriangle"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myButton"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.PS4Controller.Button", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PS4Controller.Button"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Button",
    contents: contents,
    className: "wpilib.PS4Controller.Button",
  };

  return category;
}
