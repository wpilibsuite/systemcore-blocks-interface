// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.JoystickPOVs

python.PythonVariableGetterNames["instance hal.JoystickPOVs int"] = ["count"];
python.PythonVariableGetterTooltips["instance hal.JoystickPOVs int"] = [""];
python.PythonVariableSetterNames["instance hal.JoystickPOVs int"] = ["count"];
python.PythonVariableSetterTooltips["instance hal.JoystickPOVs int"] = [""];
python.PythonVariableGetterNames["instance hal.JoystickPOVs memoryview"] = ["povs"];
python.PythonVariableGetterTooltips["instance hal.JoystickPOVs memoryview"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "JoystickPOVs",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickPOVs int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickPOVs int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickPOVs memoryview", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "povs"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickPOVs"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickPOVs", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickPOVs"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
