// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.CANStatus

export function initialize() {
  python.initializeInstanceVariableGetter("wpilib.CANStatus", "int", ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"], ["", "", "", ""]);
  python.initializeInstanceVariableSetter("wpilib.CANStatus", "int", ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"], ["", "", "", ""]);
  python.initializeInstanceVariableGetter("wpilib.CANStatus", "float", ["percentBusUtilization"], [""]);
  python.initializeInstanceVariableSetter("wpilib.CANStatus", "float", ["percentBusUtilization"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
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
