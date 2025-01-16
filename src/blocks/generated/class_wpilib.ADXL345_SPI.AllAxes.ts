// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.ADXL345_SPI.AllAxes

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.ADXL345_SPI.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.ADXL345_SPI.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AllAxes",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.ADXL345_SPI.AllAxes", "varType": "float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_SPI.AllAxes"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.ADXL345_SPI.AllAxes", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.ADXL345_SPI.AllAxes"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
