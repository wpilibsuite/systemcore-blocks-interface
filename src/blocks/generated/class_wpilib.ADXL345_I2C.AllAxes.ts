// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.ADXL345_I2C.AllAxes

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.ADXL345_I2C.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.ADXL345_I2C.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_I2C.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.ADXL345_I2C.AllAxes", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_I2C.AllAxes"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "AllAxes",
    contents: contents,
    className: "wpilib.ADXL345_I2C.AllAxes",
  };

  return category;
}
