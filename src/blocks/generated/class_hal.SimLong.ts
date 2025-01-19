// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.SimLong

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimLong", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimLong", "int", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimLong", "int", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimLong", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimLong", "varType": "int", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimLong", "varType": "int", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimLong"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.SimLong", "args": [{"name": "handle", "type": "int"}], "tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueLong().\n\n:param handle: simulated value handle", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.SimLong"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}], "tooltip": "Gets the simulated value.\n\n:returns: The current value", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}], "tooltip": "Resets the simulated value to 0. Use this instead of Set(0) for resetting\nincremental sensor values like encoder counts or gyro accumulated angle\nto ensure correct behavior in a distributed system (e.g. WebSockets).", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}, {"name": "value", "type": "int"}], "tooltip": "Sets the simulated value.\n\n:param value: the value to set", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimLong", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "hal.SimLong",
    name:  "SimLong",
      contents: contents,
  };
  return category;
}
