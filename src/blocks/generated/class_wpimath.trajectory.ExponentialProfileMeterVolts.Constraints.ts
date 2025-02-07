// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.ExponentialProfileMeterVolts.Constraints

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.units_per_second", ["A"], ["The State-Space 1x1 system matrix."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.meters_per_second_squared_per_volt", ["B"], ["The State-Space 1x1 input matrix."]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "wpimath.units.volts", ["maxInput"], ["Maximum unsigned input voltage."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.units_per_second", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "A"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.meters_per_second_squared_per_volt", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "B"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "constraints", "selfType": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "VAR": "maxInput"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints", "args": [{"name": "maxInput", "type": "wpimath.units.volts"}, {"name": "kV", "type": "wpimath.units.volt_seconds_per_meter"}, {"name": "kA", "type": "wpimath.units.volt_seconds_squared_per_meter"}], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "fromCharacteristics"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myConstraints"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints", "args": [{"name": "maxInput", "type": "wpimath.units.volts"}, {"name": "a", "type": "wpimath.units.units_per_second"}, {"name": "b", "type": "wpimath.units.meters_per_second_squared_per_volt"}], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "fromStateSpace"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "constraints", "type": "wpimath._controls._controls.trajectory.ExponentialProfileMeterVolts.Constraints"}], "tooltip": "Computes the max achievable velocity for an Exponential Profile.\n\n:returns: The steady-state velocity achieved by this profile.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Constraints",
    contents: contents,
    className: "wpimath.trajectory.ExponentialProfileMeterVolts.Constraints",
  };

  return category;
}
