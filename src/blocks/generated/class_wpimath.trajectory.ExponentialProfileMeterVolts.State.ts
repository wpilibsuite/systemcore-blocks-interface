// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.State

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.State", "wpimath.units.meters", ["position"], ["The position at this state."]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.State", "wpimath.units.meters_per_second", ["velocity"], ["The velocity at this state."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.trajectory.ExponentialProfileMeterVolts.State wpimath.units.meters", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second", "key": "instance wpimath.trajectory.ExponentialProfileMeterVolts.State wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.State", "args": [{"name": "arg0", "type": "wpimath.units.meters"}, {"name": "arg1", "type": "wpimath.units.meters_per_second"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
