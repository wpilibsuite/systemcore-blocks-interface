// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.drive.MecanumDrive.WheelSpeeds

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.drive.MecanumDrive.WheelSpeeds", "float", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Front-left wheel speed.", "Front-right wheel speed.", "Rear-left wheel speed.", "Rear-right wheel speed."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.drive.MecanumDrive.WheelSpeeds", "float", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Front-left wheel speed.", "Front-right wheel speed.", "Rear-left wheel speed.", "Rear-right wheel speed."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.drive.MecanumDrive.WheelSpeeds", "varType": "float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.drive._drive.MecanumDrive.WheelSpeeds", "args": [], "tooltip": "", "importModule": "wpilib.drive"}, "fields": {"MODULE_OR_CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds"}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.drive.MecanumDrive.WheelSpeeds",
    name:  "WheelSpeeds",
      contents: contents,
  };
  return category;
}
