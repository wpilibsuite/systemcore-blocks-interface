// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfileRadians.State

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfileRadians.State", "wpimath.units.radians", ["position"], ["The position at this state."]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfileRadians.State", "wpimath.units.radians_per_second", ["velocity"], ["The velocity at this state."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians", "key": "instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians_per_second", "key": "instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.State", "args": [{"name": "position", "type": "wpimath.units.radians"}, {"name": "velocity", "type": "wpimath.units.radians_per_second"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
