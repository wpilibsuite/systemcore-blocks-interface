// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfile.Constraints

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.Constraints", "wpimath.units.units_per_second_squared", ["maxAcceleration"], ["Maximum acceleration."]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.Constraints", "wpimath.units.units_per_second", ["maxVelocity"], ["Maximum velocity."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "Constraints",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.units_per_second_squared", "key": "instance wpimath.trajectory.TrapezoidProfile.Constraints wpimath.units.units_per_second_squared", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfile.Constraints"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.units_per_second", "key": "instance wpimath.trajectory.TrapezoidProfile.Constraints wpimath.units.units_per_second", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfile.Constraints"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints", "VAR": "maxVelocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs constraints for a Trapezoid Profile.\n\n:param maxVelocity:     Maximum velocity.\n:param maxAcceleration: Maximum acceleration.", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfile.Constraints", "args": [{"name": "maxVelocity", "type": "wpimath.units.units_per_second"}, {"name": "maxAcceleration", "type": "wpimath.units.units_per_second_squared"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
