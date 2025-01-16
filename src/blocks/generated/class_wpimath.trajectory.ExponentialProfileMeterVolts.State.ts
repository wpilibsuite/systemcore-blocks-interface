// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.State

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.State", "wpimath.units.meters", ["position"], ["The position at this state."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.State", "wpimath.units.meters_per_second", ["velocity"], ["The velocity at this state."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "varType": "wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.State", "args": [{"name": "arg0", "type": "wpimath.units.meters"}, {"name": "arg1", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.State"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
