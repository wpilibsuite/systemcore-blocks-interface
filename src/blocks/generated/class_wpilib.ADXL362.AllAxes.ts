// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.ADXL362.AllAxes

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.ADXL362.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.ADXL362.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AllAxes",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL362.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.ADXL362.AllAxes", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL362.AllAxes"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
