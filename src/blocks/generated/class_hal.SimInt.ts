// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimInt

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimInt", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimInt", "int", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimInt", "int", ["value"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimInt",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimInt", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simInt", "selfType": "hal.SimInt"}, "fields": {"MODULE_OR_CLASS": "hal.SimInt", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimInt", "varType": "int", "importModule": "", "selfLabel": "simInt", "selfType": "hal.SimInt"}, "fields": {"MODULE_OR_CLASS": "hal.SimInt", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimInt", "varType": "int", "importModule": "", "selfLabel": "simInt", "selfType": "hal.SimInt"}, "fields": {"MODULE_OR_CLASS": "hal.SimInt", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimInt"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueInt().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimInt", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimInt"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "int", "args": [{"name": "simInt", "type": "hal._wpiHal.SimInt"}], "importModule": ""}, "fields": {"CLASS": "hal.SimInt", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the simulated value to 0. Use this instead of Set(0) for resetting\nincremental sensor values like encoder counts or gyro accumulated angle\nto ensure correct behavior in a distributed system (e.g. WebSockets).", "returnType": "None", "args": [{"name": "simInt", "type": "hal._wpiHal.SimInt"}], "importModule": ""}, "fields": {"CLASS": "hal.SimInt", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simInt", "type": "hal._wpiHal.SimInt"}, {"name": "value", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "hal.SimInt", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimInt"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
