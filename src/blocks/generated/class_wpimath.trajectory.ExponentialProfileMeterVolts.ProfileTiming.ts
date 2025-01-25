// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "wpimath.units.seconds", ["inflectionTime", "totalTime"], ["Profile inflection time.", "Total profile time."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "varType": "wpimath.units.seconds", "importModule": "", "selfLabel": "profileTiming", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "VAR": "inflectionTime"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "varType": "wpimath.units.seconds", "importModule": "", "selfLabel": "profileTiming", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "VAR": "totalTime"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myProfileTiming"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "args": [], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "profileTiming", "type": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, {"name": "t", "type": "wpimath.units.seconds"}], "tooltip": "Decides if the profile is finished by time t.\n\n:param t: The time since the beginning of the profile.\n\n:returns: if the profile is finished at time t.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "FUNC": "isFinished"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ProfileTiming",
    contents: contents,
    className: "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming",
  };

  return category;
}
