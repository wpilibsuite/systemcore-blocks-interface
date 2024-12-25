// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.SimValue

python.PythonVariableGetterNames["instance hal.SimValue hal._wpiHal.Type"] = ["type"];
python.PythonVariableGetterTooltips["instance hal.SimValue hal._wpiHal.Type"] = [""];
python.PythonVariableGetterNames["instance hal.SimValue object"] = ["value"];
python.PythonVariableGetterTooltips["instance hal.SimValue object"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SimValue",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimValue hal._wpiHal.Type", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"CLASS": "hal.SimValue", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "object", "key": "instance hal.SimValue object", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"CLASS": "hal.SimValue", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValue().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimValue", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimValue"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
