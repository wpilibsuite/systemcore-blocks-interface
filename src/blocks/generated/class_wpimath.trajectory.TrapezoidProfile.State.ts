// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfile.State

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.State", "float", ["position"], ["The position at this state."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.State", "wpimath.units.units_per_second", ["velocity"], ["The velocity at this state."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfile.State", "varType": "float", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfile.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfile.State", "varType": "wpimath.units.units_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfile.State"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfile.State", "args": [{"name": "position", "type": "float"}, {"name": "velocity", "type": "wpimath.units.units_per_second"}], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.State"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
