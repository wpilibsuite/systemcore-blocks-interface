// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfile.Constraints

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.Constraints", "wpimath.units.units_per_second_squared", ["maxAcceleration"], ["Maximum acceleration."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfile.Constraints", "wpimath.units.units_per_second", ["maxVelocity"], ["Maximum velocity."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfile.Constraints", "varType": "wpimath.units.units_per_second_squared", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfile.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfile.Constraints", "varType": "wpimath.units.units_per_second", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfile.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints", "VAR": "maxVelocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.TrapezoidProfile.Constraints", "args": [{"name": "maxVelocity", "type": "wpimath.units.units_per_second"}, {"name": "maxAcceleration", "type": "wpimath.units.units_per_second_squared"}], "tooltip": "Constructs constraints for a Trapezoid Profile.\n\n:param maxVelocity:     Maximum velocity.\n:param maxAcceleration: Maximum acceleration.", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfile.Constraints"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Constraints",
    contents: contents,
    className: "wpimath.trajectory.TrapezoidProfile.Constraints",
  };

  return category;
}
