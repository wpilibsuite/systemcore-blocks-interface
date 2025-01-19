// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.SimBoolean

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimBoolean", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimBoolean", "bool", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimBoolean", "bool", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimBoolean", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimBoolean", "varType": "bool", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimBoolean", "varType": "bool", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimBoolean"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.SimBoolean", "args": [{"name": "handle", "type": "int"}], "tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueBoolean().\n\n:param handle: simulated value handle", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "simBoolean", "type": "hal._wpiHal.SimBoolean"}], "tooltip": "Gets the simulated value.\n\n:returns: The current value", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simBoolean", "type": "hal._wpiHal.SimBoolean"}, {"name": "value", "type": "bool"}], "tooltip": "Sets the simulated value.\n\n:param value: the value to set", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimBoolean", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "hal.SimBoolean",
    name:  "SimBoolean",
      contents: contents,
  };
  return category;
}
