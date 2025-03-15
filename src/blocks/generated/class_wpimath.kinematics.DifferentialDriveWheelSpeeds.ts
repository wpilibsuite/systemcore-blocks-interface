// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.DifferentialDriveWheelSpeeds

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.DifferentialDriveWheelSpeeds", "wpimath.units.meters_per_second", ["left", "right"], ["Speed of the left side of the robot.", "Speed of the right side of the robot."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.DifferentialDriveWheelSpeeds", "wpimath.units.meters_per_second", ["left", "right"], ["Speed of the left side of the robot.", "Speed of the right side of the robot."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.DifferentialDriveWheelSpeeds", "wpimath.units.feet_per_second", ["left_fps", "right_fps"], ["", ""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.DifferentialDriveWheelSpeeds", "wpimath.units.feet_per_second", ["left_fps", "right_fps"], ["", ""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 11 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "left_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "left_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "right_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "differentialDriveWheelSpeeds", "selfType": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "VAR": "right_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "args": [{"name": "left", "type": "wpimath.units.meters_per_second"}, {"name": "right", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "differentialDriveWheelSpeeds", "type": "wpimath.kinematics.DifferentialDriveWheelSpeeds"}, {"name": "attainableMaxSpeed", "type": "wpimath.units.meters_per_second"}], "tooltip": "Renormalizes the wheel speeds if either side is above the specified\nmaximum.\n\nSometimes, after inverse kinematics, the requested speed from one or more\nwheels may be above the max attainable speed for the driving motor on that\nwheel. To fix this issue, one can reduce all the wheel speeds to make sure\nthat all requested module speeds are at-or-below the absolute threshold,\nwhile maintaining the ratio of speeds between wheels.\n\n:param attainableMaxSpeed: The absolute max speed that a wheel can reach.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "FUNC": "desaturate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "args": [{"name": "left", "type": "wpimath.units.feet_per_second"}, {"name": "right", "type": "wpimath.units.feet_per_second"}], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.DifferentialDriveWheelSpeeds", "FUNC": "fromFeet"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DifferentialDriveWheelSpeeds",
    contents: contents,
    className: "wpimath.kinematics.DifferentialDriveWheelSpeeds",
  };

  return category;
}
