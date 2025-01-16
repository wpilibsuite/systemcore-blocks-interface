// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.controller.DifferentialDriveWheelVoltages

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.controller.DifferentialDriveWheelVoltages", "wpimath.units.volts", ["left", "right"], ["Left wheel voltage.", "Right wheel voltage."]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.controller.DifferentialDriveWheelVoltages", "wpimath.units.volts", ["left", "right"], ["Left wheel voltage.", "Right wheel voltage."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DifferentialDriveWheelVoltages",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.controller.DifferentialDriveWheelVoltages", "varType": "wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.controller.DifferentialDriveWheelVoltages", "args": [{"name": "left", "type": "wpimath.units.volts"}, {"name": "right", "type": "wpimath.units.volts"}], "importModule": "wpimath.controller"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
