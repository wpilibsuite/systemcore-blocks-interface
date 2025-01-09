// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpimath.trajectory.TrapezoidProfile.State

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.State", "float", ["position"], ["The position at this state."]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.State", "wpimath.units.units_per_second", ["velocity"], ["The velocity at this state."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpimath.trajectory.TrapezoidProfile.State float", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfile.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.units_per_second", "key": "instance wpimath.trajectory.TrapezoidProfile.State wpimath.units.units_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfile.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfile.State", "args": [{"name": "position", "type": "float"}, {"name": "velocity", "type": "wpimath.units.units_per_second"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.State"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
