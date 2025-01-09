// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpimath.trajectory.constraint.TrajectoryConstraint.MinMax

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "wpimath.units.meters_per_second_squared", ["maxAcceleration", "minAcceleration"], ["The maximum acceleration.", "The minimum acceleration."]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "wpimath.units.meters_per_second_squared", ["maxAcceleration", "minAcceleration"], ["The maximum acceleration.", "The minimum acceleration."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "MinMax",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.constraint.TrajectoryConstraint.MinMax wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.constraint.TrajectoryConstraint.MinMax wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "maxAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.constraint.TrajectoryConstraint.MinMax wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "minAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.constraint.TrajectoryConstraint.MinMax wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "minMax", "selfType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "VAR": "minAcceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMinMax"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
