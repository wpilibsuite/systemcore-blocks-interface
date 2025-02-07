// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.SwerveModulePosition

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModulePosition", "wpimath.geometry._geometry.Rotation2d", ["angle"], ["Angle of the module."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModulePosition", "wpimath.geometry._geometry.Rotation2d", ["angle"], ["Angle of the module."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModulePosition", "wpimath.units.meters", ["distance"], ["Distance the wheel of a module has traveled"]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModulePosition", "wpimath.units.meters", ["distance"], ["Distance the wheel of a module has traveled"]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModulePosition", "wpimath.units.feet", ["distance_ft"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModulePosition", "wpimath.units.feet", ["distance_ft"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "angle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "angle"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance_ft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModulePosition", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance_ft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModulePosition"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics._kinematics.SwerveModulePosition", "args": [{"name": "distance", "type": "wpimath.units.meters"}, {"name": "angle", "type": "wpimath.geometry._geometry.Rotation2d"}], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModulePosition"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.kinematics._kinematics.SwerveModulePosition", "args": [{"name": "swerveModulePosition", "type": "wpimath.kinematics._kinematics.SwerveModulePosition"}, {"name": "endValue", "type": "wpimath.kinematics._kinematics.SwerveModulePosition"}, {"name": "t", "type": "float"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModulePosition", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SwerveModulePosition",
    contents: contents,
    className: "wpimath.kinematics.SwerveModulePosition",
  };

  return category;
}
