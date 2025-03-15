// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.JoystickAxes

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickAxes", "memoryview", ["axes", "raw"], ["", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickAxes", "int", ["count"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.JoystickAxes", "int", ["count"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickAxes", "varType": "memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickAxes", "VAR": "axes"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickAxes", "varType": "memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickAxes", "VAR": "raw"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickAxes", "varType": "int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickAxes", "varType": "int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal.JoystickAxes", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickAxes"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "JoystickAxes",
    contents: contents,
    className: "hal.JoystickAxes",
  };

  return category;
}
