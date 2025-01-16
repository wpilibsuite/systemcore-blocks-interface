// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickButtons

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickButtons", "int", ["buttons", "count"], ["", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.JoystickButtons", "int", ["buttons", "count"], ["", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "JoystickButtons",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickButtons", "varType": "int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickButtons", "VAR": "buttons"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickButtons", "varType": "int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickButtons", "VAR": "buttons"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickButtons", "varType": "int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickButtons", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickButtons", "varType": "int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickButtons", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickButtons"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.JoystickButtons", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickButtons"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
