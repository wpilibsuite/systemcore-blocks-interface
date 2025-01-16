// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.TrajectoryConstraint.MinMax

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "wpimath.units.meters_per_second_squared", ["maxAcceleration", "minAcceleration"], ["The maximum acceleration.", "The minimum acceleration."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "wpimath.units.meters_per_second_squared", ["maxAcceleration", "minAcceleration"], ["The maximum acceleration.", "The minimum acceleration."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MinMax",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "minAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "varType": "wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "minAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "minAcceleration", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxAcceleration", "type": "wpimath.units.meters_per_second_squared"}], "tooltip": "", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
