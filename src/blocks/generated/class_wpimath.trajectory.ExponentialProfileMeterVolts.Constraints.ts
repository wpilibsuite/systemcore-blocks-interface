// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.Constraints

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.units_per_second", ["A"], ["The State-Space 1x1 system matrix."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.meters_per_second_squared_per_volt", ["B"], ["The State-Space 1x1 input matrix."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.volts", ["maxInput"], ["Maximum unsigned input voltage."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Constraints",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.units_per_second", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "A"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.meters_per_second_squared_per_volt", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "B"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "maxInput"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints", "args": [{"name": "maxInput", "type": "wpimath.units.volts"}, {"name": "kV", "type": "wpimath.units.volt_seconds_per_meter"}, {"name": "kA", "type": "wpimath.units.volt_seconds_squared_per_meter"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "fromCharacteristics"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints", "args": [{"name": "maxInput", "type": "wpimath.units.volts"}, {"name": "a", "type": "wpimath.units.units_per_second"}, {"name": "b", "type": "wpimath.units.meters_per_second_squared_per_volt"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "fromStateSpace"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Computes the max achievable velocity for an Exponential Profile.\n\n:returns: The steady-state velocity achieved by this profile.", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "constraints", "type": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
