// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.CANStreamMessage

python.PythonVariableGetterNames["instance hal.CANStreamMessage memoryview"] = ["data"];
python.PythonVariableGetterTooltips["instance hal.CANStreamMessage memoryview"] = [""];
python.PythonVariableGetterNames["instance hal.CANStreamMessage int"] = ["dataSize", "messageID", "timeStamp"];
python.PythonVariableGetterTooltips["instance hal.CANStreamMessage int"] = ["", "", ""];
python.PythonVariableSetterNames["instance hal.CANStreamMessage int"] = ["dataSize", "messageID", "timeStamp"];
python.PythonVariableSetterTooltips["instance hal.CANStreamMessage int"] = ["", "", ""];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "CANStreamMessage",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.CANStreamMessage memoryview", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "data"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "dataSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "dataSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "messageID"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "messageID"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "timeStamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.CANStreamMessage int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"CLASS": "hal.CANStreamMessage", "VAR": "timeStamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANStreamMessage"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.CANStreamMessage", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.CANStreamMessage"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
