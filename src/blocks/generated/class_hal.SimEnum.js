// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.SimEnum

python.PythonVariableGetterNames["instance hal.SimEnum hal._wpiHal.Type"] = ["type"];
python.PythonVariableGetterTooltips["instance hal.SimEnum hal._wpiHal.Type"] = [""];
python.PythonVariableGetterNames["instance hal.SimEnum int"] = ["value"];
python.PythonVariableGetterTooltips["instance hal.SimEnum int"] = [""];
python.PythonVariableSetterNames["instance hal.SimEnum int"] = ["value"];
python.PythonVariableSetterTooltips["instance hal.SimEnum int"] = [""];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SimEnum",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimEnum hal._wpiHal.Type", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"CLASS": "hal.SimEnum", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.SimEnum int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.SimEnum int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimEnum"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueEnum().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimEnum", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimEnum"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "int", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}], "importModule": ""}, "fields": {"CLASS": "hal.SimEnum", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}, {"name": "value", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "hal.SimEnum", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
