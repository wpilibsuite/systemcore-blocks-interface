// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.kinematics.SwerveModuleState

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModuleState", "wpimath.geometry._geometry.Rotation2d", ["angle"], ["Angle of the module."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModuleState", "wpimath.geometry._geometry.Rotation2d", ["angle"], ["Angle of the module."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModuleState", "wpimath.units.meters_per_second", ["speed"], ["Speed of the wheel of the module."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModuleState", "wpimath.units.meters_per_second", ["speed"], ["Speed of the wheel of the module."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.kinematics.SwerveModuleState", "wpimath.units.feet_per_second", ["speed_fps"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.kinematics.SwerveModuleState", "wpimath.units.feet_per_second", ["speed_fps"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 9 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "angle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "angle"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.kinematics.SwerveModuleState", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModuleState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.kinematics.SwerveModuleState", "args": [{"name": "speed", "type": "wpimath.units.meters_per_second"}, {"name": "angle", "type": "wpimath.geometry.Rotation2d"}], "tooltip": "", "importModule": "wpimath.kinematics"}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "swerveModuleState", "type": "wpimath.kinematics.SwerveModuleState"}, {"name": "currentAngle", "type": "wpimath.geometry.Rotation2d"}], "tooltip": "Scales speed by cosine of angle error. This scales down movement\nperpendicular to the desired direction of travel that can occur when\nmodules change directions. This results in smoother driving.\n\n:param currentAngle: The current module angle.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "FUNC": "cosineScale"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "swerveModuleState", "type": "wpimath.kinematics.SwerveModuleState"}, {"name": "currentAngle", "type": "wpimath.geometry.Rotation2d"}], "tooltip": "Minimize the change in the heading this swerve module state would\nrequire by potentially reversing the direction the wheel spins. If this is\nused with the PIDController class's continuous input functionality, the\nfurthest a wheel will ever rotate is 90 degrees.\n\n:param currentAngle: The current module angle.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.kinematics.SwerveModuleState", "FUNC": "optimize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SwerveModuleState",
    contents: contents,
    className: "wpimath.kinematics.SwerveModuleState",
  };

  return category;
}
