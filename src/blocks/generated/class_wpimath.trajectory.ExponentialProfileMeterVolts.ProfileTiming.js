// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming

python.PythonVariableGetterNames["instance wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming wpimath.units.seconds"] = ["inflectionTime", "totalTime"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming wpimath.units.seconds"] = ["Profile inflection time.", "Total profile time."];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "ProfileTiming",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.seconds", "key": "instance wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming wpimath.units.seconds", "importModule": "", "selfLabel": "profileTiming", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "VAR": "inflectionTime"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.seconds", "key": "instance wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming wpimath.units.seconds", "importModule": "", "selfLabel": "profileTiming", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "VAR": "totalTime"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myProfileTiming"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "args": [], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Decides if the profile is finished by time t.\n\n:param t: The time since the beginning of the profile.\n\n:returns: if the profile is finished at time t.", "returnType": "bool", "args": [{"name": "profileTiming", "type": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.ProfileTiming"}, {"name": "t", "type": "wpimath.units.seconds"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming", "FUNC": "isFinished"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myProfileTiming"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
