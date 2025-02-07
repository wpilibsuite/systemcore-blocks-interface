// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.SimEnum

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimEnum", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimEnum", "int", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimEnum", "int", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimEnum"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.SimEnum", "args": [{"name": "handle", "type": "int"}], "tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueEnum().\n\n:param handle: simulated value handle", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}], "tooltip": "Gets the simulated value.\n\n:returns: The current value", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}, {"name": "value", "type": "int"}], "tooltip": "Sets the simulated value.\n\n:param value: the value to set", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SimEnum",
    contents: contents,
    className: "hal.SimEnum",
  };

  return category;
}
