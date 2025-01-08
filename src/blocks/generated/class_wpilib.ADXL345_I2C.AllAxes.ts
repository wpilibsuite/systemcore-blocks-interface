// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.ADXL345_I2C.AllAxes

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.ADXL345_I2C.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
  pythonVariable.initializeInstanceVariableSetter("wpilib.ADXL345_I2C.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "AllAxes",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL345_I2C.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL345_I2C.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.ADXL345_I2C.AllAxes", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.ADXL345_I2C.AllAxes"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
