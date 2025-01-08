// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.CANStreamMessage

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "memoryview", ["data"], [""]);
  pythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["", "", ""]);
  pythonVariable.initializeInstanceVariableSetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["", "", ""]);
}

export function getToolboxCategory(subcategories: any): Category {
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
