// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.drive.DifferentialDrive.WheelSpeeds

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "WheelSpeeds",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.DifferentialDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.drive._drive.DifferentialDrive.WheelSpeeds", "args": [], "importModule": "wpilib.drive"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
