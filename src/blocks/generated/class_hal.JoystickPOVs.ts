// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.JoystickPOVs

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickPOVs", "int", ["count"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.JoystickPOVs", "int", ["count"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickPOVs", "memoryview", ["povs"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickPOVs", "varType": "int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickPOVs", "varType": "int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickPOVs", "varType": "memoryview", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickPOVs", "VAR": "povs"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickPOVs"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.JoystickPOVs", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickPOVs"}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "hal.JoystickPOVs",
    name:  "JoystickPOVs",
      contents: contents,
  };
  return category;
}
