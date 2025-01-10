// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.ADXL362.AllAxes

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.ADXL362.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
  pythonVariable.initializeInstanceVariableSetter("wpilib.ADXL362.AllAxes", "float", ["XAxis", "YAxis", "ZAxis"], ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AllAxes",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "XAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "YAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.ADXL362.AllAxes float", "importModule": "", "selfLabel": "allAxes", "selfType": "wpilib.ADXL362.AllAxes"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes", "VAR": "ZAxis"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAllAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.ADXL362.AllAxes", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.ADXL362.AllAxes"}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
