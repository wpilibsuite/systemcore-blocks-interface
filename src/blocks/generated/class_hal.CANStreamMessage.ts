// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.CANStreamMessage

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "memoryview", ["data"], ["The message data"]);
  pythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["The size of the data received (0-8 bytes)", "The message ID", "The packet received timestamp (based off of CLOCK_MONOTONIC)"]);
  pythonVariable.initializeInstanceVariableSetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["The size of the data received (0-8 bytes)", "The message ID", "The packet received timestamp (based off of CLOCK_MONOTONIC)"]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
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
  category.contents.push(...subcategories);
  return category;
}
