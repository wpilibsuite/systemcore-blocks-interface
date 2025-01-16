// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimEnum

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimEnum", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimEnum", "int", ["value"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.SimEnum", "int", ["value"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimEnum",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimEnum", "varType": "int", "importModule": "", "selfLabel": "simEnum", "selfType": "hal.SimEnum"}, "fields": {"MODULE_OR_CLASS": "hal.SimEnum", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimEnum"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueEnum().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimEnum", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimEnum"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "int", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}], "importModule": ""}, "fields": {"CLASS": "hal.SimEnum", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simEnum", "type": "hal._wpiHal.SimEnum"}, {"name": "value", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "hal.SimEnum", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimEnum"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
