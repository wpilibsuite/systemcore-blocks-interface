// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfileRadians.Constraints

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfileRadians.Constraints", "wpimath.units.radians_per_second_squared", ["maxAcceleration"], ["Maximum acceleration."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.TrapezoidProfileRadians.Constraints", "wpimath.units.radians_per_second", ["maxVelocity"], ["Maximum velocity."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfileRadians.Constraints", "varType": "wpimath.units.radians_per_second_squared", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians.Constraints", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.TrapezoidProfileRadians.Constraints", "varType": "wpimath.units.radians_per_second", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians.Constraints", "VAR": "maxVelocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.Constraints", "args": [{"name": "maxVelocity", "type": "wpimath.units.radians_per_second"}, {"name": "maxAcceleration", "type": "wpimath.units.radians_per_second_squared"}], "tooltip": "Constructs constraints for a Trapezoid Profile.\n\n:param maxVelocity:     Maximum velocity.\n:param maxAcceleration: Maximum acceleration.", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians.Constraints"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Constraints",
    contents: contents,
    className: "wpimath.trajectory.TrapezoidProfileRadians.Constraints",
  };

  return category;
}
