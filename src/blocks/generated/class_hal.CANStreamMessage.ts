// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.CANStreamMessage

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "memoryview", ["data"], ["The message data"]);
  getPythonVariable.initializeInstanceVariableGetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["The size of the data received (0-8 bytes)", "The message ID", "The packet received timestamp (based off of CLOCK_MONOTONIC)"]);
  setPythonVariable.initializeInstanceVariableSetter("hal.CANStreamMessage", "int", ["dataSize", "messageID", "timeStamp"], ["The size of the data received (0-8 bytes)", "The message ID", "The packet received timestamp (based off of CLOCK_MONOTONIC)"]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "CANStreamMessage",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "memoryview", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "data"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "dataSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "dataSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "messageID"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "messageID"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "timeStamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.CANStreamMessage", "varType": "int", "importModule": "", "selfLabel": "cANStreamMessage", "selfType": "hal.CANStreamMessage"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage", "VAR": "timeStamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStreamMessage"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANStreamMessage"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.CANStreamMessage", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.CANStreamMessage"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
