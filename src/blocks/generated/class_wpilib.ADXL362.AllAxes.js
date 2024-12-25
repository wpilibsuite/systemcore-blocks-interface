// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class wpilib.ADXL362.AllAxes

python.PythonVariableGetterNames["instance wpilib.ADXL362.AllAxes float"] = ["XAxis", "YAxis", "ZAxis"];
python.PythonVariableGetterTooltips["instance wpilib.ADXL362.AllAxes float"] = ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."];
python.PythonVariableSetterNames["instance wpilib.ADXL362.AllAxes float"] = ["XAxis", "YAxis", "ZAxis"];
python.PythonVariableSetterTooltips["instance wpilib.ADXL362.AllAxes float"] = ["Acceleration along the X axis in g-forces.", "Acceleration along the Y axis in g-forces.", "Acceleration along the Z axis in g-forces."];


export function getToolboxCategory(subcategories) {
  const category = {
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
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
