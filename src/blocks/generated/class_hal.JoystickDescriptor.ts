// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickDescriptor

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickDescriptor", "int", ["axisCount", "buttonCount", "isXbox", "povCount", "type"], ["", "", "", "", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.JoystickDescriptor", "int", ["axisCount", "buttonCount", "isXbox", "povCount", "type"], ["", "", "", "", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.JoystickDescriptor", "memoryview", ["axisTypes", "name"], ["", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "JoystickDescriptor",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "axisCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "axisCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "buttonCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "buttonCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "isXbox"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "isXbox"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "povCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "povCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "memoryview", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "axisTypes"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.JoystickDescriptor", "varType": "memoryview", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"MODULE_OR_CLASS": "hal.JoystickDescriptor", "VAR": "name"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickDescriptor"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickDescriptor", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickDescriptor"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
