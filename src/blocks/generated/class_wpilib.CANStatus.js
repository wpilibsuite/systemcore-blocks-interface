// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.CANStatus

python.PythonVariableGetterNames["instance wpilib.CANStatus int"] = ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"];
python.PythonVariableGetterTooltips["instance wpilib.CANStatus int"] = ["", "", "", ""];
python.PythonVariableSetterNames["instance wpilib.CANStatus int"] = ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"];
python.PythonVariableSetterTooltips["instance wpilib.CANStatus int"] = ["", "", "", ""];
python.PythonVariableGetterNames["instance wpilib.CANStatus float"] = ["percentBusUtilization"];
python.PythonVariableGetterTooltips["instance wpilib.CANStatus float"] = [""];
python.PythonVariableSetterNames["instance wpilib.CANStatus float"] = ["percentBusUtilization"];
python.PythonVariableSetterTooltips["instance wpilib.CANStatus float"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "CANStatus",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "busOffCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "busOffCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "receiveErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "receiveErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "transmitErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "transmitErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "txFullCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANStatus int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "txFullCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.CANStatus float", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "percentBusUtilization"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.CANStatus float", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"CLASS": "wpilib.CANStatus", "VAR": "percentBusUtilization"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANStatus"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.CANStatus", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.CANStatus"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
