// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.simulation.NotifierInfo

python.PythonVariableGetterNames["instance hal.simulation.NotifierInfo int"] = ["handle", "timeout", "waitTimeValid"];
python.PythonVariableGetterTooltips["instance hal.simulation.NotifierInfo int"] = ["", "", ""];
python.PythonVariableSetterNames["instance hal.simulation.NotifierInfo int"] = ["handle", "timeout", "waitTimeValid"];
python.PythonVariableSetterTooltips["instance hal.simulation.NotifierInfo int"] = ["", "", ""];
python.PythonVariableGetterNames["instance hal.simulation.NotifierInfo memoryview"] = ["name"];
python.PythonVariableGetterTooltips["instance hal.simulation.NotifierInfo memoryview"] = [""];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "NotifierInfo",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.simulation.NotifierInfo memoryview", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "name"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myNotifierInfo"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal.simulation._simulation.NotifierInfo", "args": [], "importModule": "hal.simulation"}, "fields": {"CLASS": "hal.simulation.NotifierInfo"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
