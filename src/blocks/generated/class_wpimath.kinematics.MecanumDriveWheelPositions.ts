// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.MecanumDriveWheelPositions

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.MecanumDriveWheelPositions", "wpimath.units.meters", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Distance driven by the front-left wheel.", "Distance driven by the front-right wheel.", "Distance driven by the rear-left wheel.", "Distance driven by the rear-right wheel."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.MecanumDriveWheelPositions", "wpimath.units.meters", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Distance driven by the front-left wheel.", "Distance driven by the front-right wheel.", "Distance driven by the rear-left wheel.", "Distance driven by the rear-right wheel."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.MecanumDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "mecanumDriveWheelPositions", "selfType": "wpimath.kinematics.MecanumDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics.MecanumDriveWheelPositions", "args": [], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics.MecanumDriveWheelPositions", "args": [{"name": "mecanumDriveWheelPositions", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}, {"name": "endValue", "type": "wpimath.kinematics.MecanumDriveWheelPositions"}, {"name": "t", "type": "float"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.MecanumDriveWheelPositions", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMecanumDriveWheelPositions"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MecanumDriveWheelPositions",
    contents: contents,
    className: "wpimath.kinematics.MecanumDriveWheelPositions",
  };

  return category;
}
