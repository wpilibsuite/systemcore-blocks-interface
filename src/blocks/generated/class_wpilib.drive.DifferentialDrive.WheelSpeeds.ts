// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.drive.DifferentialDrive.WheelSpeeds

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.drive._drive.DifferentialDrive.WheelSpeeds", "args": [], "tooltip": "", "importModule": "wpilib.drive"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "WheelSpeeds",
    contents: contents,
    className: "wpilib.drive.DifferentialDrive.WheelSpeeds",
  };

  return category;
}
