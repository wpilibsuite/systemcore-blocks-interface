// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.controller.DifferentialDriveWheelVoltages

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.controller.DifferentialDriveWheelVoltages", "wpimath.units.volts", ["left", "right"], ["Left wheel voltage.", "Right wheel voltage."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.controller.DifferentialDriveWheelVoltages", "wpimath.units.volts", ["left", "right"], ["Left wheel voltage.", "Right wheel voltage."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.controller.DifferentialDriveWheelVoltages", "args": [{"name": "left", "type": "wpimath.units.volts"}, {"name": "right", "type": "wpimath.units.volts"}], "tooltip": "", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DifferentialDriveWheelVoltages",
    contents: contents,
    className: "wpimath.controller.DifferentialDriveWheelVoltages",
  };

  return category;
}
