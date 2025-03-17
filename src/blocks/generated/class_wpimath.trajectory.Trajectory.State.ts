// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.Trajectory.State

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.meters_per_second_squared", ["acceleration"], ["The acceleration at that point of the trajectory."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.Trajectory.State", "wpimath.units.meters_per_second_squared", ["acceleration"], ["The acceleration at that point of the trajectory."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.feet_per_second_squared", ["acceleration_fps"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.radians_per_meter", ["curvature"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.Trajectory.State", "wpimath.units.radians_per_meter", ["curvature"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.geometry._geometry.Pose2d", ["pose"], ["The pose at that point of the trajectory."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.Trajectory.State", "wpimath.geometry._geometry.Pose2d", ["pose"], ["The pose at that point of the trajectory."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.seconds", ["t"], ["The time elapsed since the beginning of the trajectory."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.Trajectory.State", "wpimath.units.seconds", ["t"], ["The time elapsed since the beginning of the trajectory."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.meters_per_second", ["velocity"], ["The speed at that point of the trajectory."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.Trajectory.State", "wpimath.units.meters_per_second", ["velocity"], ["The speed at that point of the trajectory."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.Trajectory.State", "wpimath.units.feet_per_second", ["velocity_fps"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 14 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.feet_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.radians_per_meter", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "curvature"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.radians_per_meter", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "curvature"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.geometry._geometry.Pose2d", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "pose"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.geometry._geometry.Pose2d", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "pose"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.seconds", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "t"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.seconds", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "t"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.Trajectory.State", "varType": "wpimath.units.feet_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.Trajectory.State", "args": [{"name": "t", "type": "wpimath.units.seconds"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}, {"name": "acceleration", "type": "wpimath.units.meters_per_second_squared"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State"}, "inputs": {"ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.Trajectory.State", "args": [{"name": "state", "type": "wpimath.trajectory.Trajectory.State"}, {"name": "endValue", "type": "wpimath.trajectory.Trajectory.State"}, {"name": "i", "type": "float"}], "tooltip": "Interpolates between two States.\n\n:param endValue: The end value for the interpolation.\n:param i:        The interpolant (fraction).\n\n:returns: The interpolated state.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory.State", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "State",
    contents: contents,
    className: "wpimath.trajectory.Trajectory.State",
  };

  return category;
}
