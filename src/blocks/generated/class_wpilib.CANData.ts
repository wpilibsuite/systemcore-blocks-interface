// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.CANData

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.CANData", "memoryview", ["data"], ["Contents of the CAN packet."]);
  getPythonVariable.initializeInstanceVariableGetter("wpilib.CANData", "int", ["length", "timestamp"], ["Length of packet in bytes.", "CAN frame timestamp in milliseconds."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.CANData", "int", ["length", "timestamp"], ["Length of packet in bytes.", "CAN frame timestamp in milliseconds."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "CANData",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANData", "varType": "memoryview", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData", "VAR": "data"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANData", "varType": "int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData", "VAR": "length"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANData", "varType": "int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData", "VAR": "length"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANData", "varType": "int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData", "VAR": "timestamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANData", "varType": "int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData", "VAR": "timestamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.CANData", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANData"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
