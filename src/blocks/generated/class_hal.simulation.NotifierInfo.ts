// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.simulation.NotifierInfo

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.simulation.NotifierInfo", "int", ["handle", "timeout", "waitTimeValid"], ["", "", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.simulation.NotifierInfo", "int", ["handle", "timeout", "waitTimeValid"], ["", "", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.simulation.NotifierInfo", "memoryview", ["name"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "NotifierInfo",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.simulation.NotifierInfo", "varType": "memoryview", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo", "VAR": "name"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myNotifierInfo"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal.simulation._simulation.NotifierInfo", "args": [], "tooltip": "", "importModule": "hal.simulation"}, "fields": {"MODULE_OR_CLASS": "hal.simulation.NotifierInfo"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
