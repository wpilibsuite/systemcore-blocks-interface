// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpilib.CANData

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.CANData", "memoryview", ["data"], ["Contents of the CAN packet."]);
  pythonVariable.initializeInstanceVariableGetter("wpilib.CANData", "int", ["length", "timestamp"], ["Length of packet in bytes.", "CAN frame timestamp in milliseconds."]);
  pythonVariable.initializeInstanceVariableSetter("wpilib.CANData", "int", ["length", "timestamp"], ["Length of packet in bytes.", "CAN frame timestamp in milliseconds."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "CANData",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance wpilib.CANData memoryview", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"CLASS": "wpilib.CANData", "VAR": "data"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANData int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"CLASS": "wpilib.CANData", "VAR": "length"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANData int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"CLASS": "wpilib.CANData", "VAR": "length"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANData int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"CLASS": "wpilib.CANData", "VAR": "timestamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.CANData int", "importModule": "", "selfLabel": "cANData", "selfType": "wpilib.CANData"}, "fields": {"CLASS": "wpilib.CANData", "VAR": "timestamp"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.CANData", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.CANData"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
