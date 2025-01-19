// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.DifferentialDriveWheelPositions

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.DifferentialDriveWheelPositions", "wpimath.units.meters", ["left", "right"], ["Distance driven by the left side.", "Distance driven by the right side."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.DifferentialDriveWheelPositions", "wpimath.units.meters", ["left", "right"], ["Distance driven by the left side.", "Distance driven by the right side."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelPositions", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions", "args": [], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions", "args": [{"name": "differentialDriveWheelPositions", "type": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions"}, {"name": "endValue", "type": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions"}, {"name": "t", "type": "float"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpimath.kinematics.DifferentialDriveWheelPositions",
    name:  "DifferentialDriveWheelPositions",
      contents: contents,
  };
  return category;
}
