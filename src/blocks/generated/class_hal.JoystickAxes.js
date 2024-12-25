// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class hal.JoystickAxes

python.PythonVariableGetterNames["instance hal.JoystickAxes memoryview"] = ["axes", "raw"];
python.PythonVariableGetterTooltips["instance hal.JoystickAxes memoryview"] = ["", ""];
python.PythonVariableGetterNames["instance hal.JoystickAxes int"] = ["count"];
python.PythonVariableGetterTooltips["instance hal.JoystickAxes int"] = [""];
python.PythonVariableSetterNames["instance hal.JoystickAxes int"] = ["count"];
python.PythonVariableSetterTooltips["instance hal.JoystickAxes int"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "JoystickAxes",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickAxes memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "axes"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickAxes memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "raw"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickAxes int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickAxes int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickAxes", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickAxes"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
