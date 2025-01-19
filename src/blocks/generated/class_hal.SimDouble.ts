// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.SimDouble

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimDouble", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimDouble", "float", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimDouble", "float", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimDouble", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimDouble", "varType": "float", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimDouble", "varType": "float", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimDouble"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.SimDouble", "args": [{"name": "handle", "type": "int"}], "tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueDouble().\n\n:param handle: simulated value handle", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}], "tooltip": "Gets the simulated value.\n\n:returns: The current value", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}], "tooltip": "Resets the simulated value to 0. Use this instead of Set(0) for resetting\nincremental sensor values like encoder counts or gyro accumulated angle\nto ensure correct behavior in a distributed system (e.g. WebSockets).", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}, {"name": "value", "type": "float"}], "tooltip": "Sets the simulated value.\n\n:param value: the value to set", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimDouble", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "hal.SimDouble",
    name:  "SimDouble",
      contents: contents,
  };
  return category;
}
