// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.CANStatus

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.CANStatus", "int", ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"], ["", "", "", ""]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.CANStatus", "int", ["busOffCount", "receiveErrorCount", "transmitErrorCount", "txFullCount"], ["", "", "", ""]);
  getPythonVariable.initializeInstanceVariableGetter("wpilib.CANStatus", "float", ["percentBusUtilization"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.CANStatus", "float", ["percentBusUtilization"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "busOffCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "busOffCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "receiveErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "receiveErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "transmitErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "transmitErrorCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "txFullCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "int", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "txFullCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "float", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "percentBusUtilization"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.CANStatus", "varType": "float", "importModule": "", "selfLabel": "cANStatus", "selfType": "wpilib.CANStatus"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus", "VAR": "percentBusUtilization"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCANStatus"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCANStatus"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.CANStatus", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.CANStatus"}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.CANStatus",
    name:  "CANStatus",
      contents: contents,
  };
  return category;
}
