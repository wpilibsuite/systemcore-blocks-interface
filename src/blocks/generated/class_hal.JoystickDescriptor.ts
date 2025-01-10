// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickDescriptor

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.JoystickDescriptor", "int", ["axisCount", "buttonCount", "isXbox", "povCount", "type"], ["", "", "", "", ""]);
  pythonVariable.initializeInstanceVariableSetter("hal.JoystickDescriptor", "int", ["axisCount", "buttonCount", "isXbox", "povCount", "type"], ["", "", "", "", ""]);
  pythonVariable.initializeInstanceVariableGetter("hal.JoystickDescriptor", "memoryview", ["axisTypes", "name"], ["", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "JoystickDescriptor",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "axisCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "axisCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "buttonCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "buttonCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "isXbox"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "isXbox"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "povCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "povCount"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickDescriptor int", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickDescriptor memoryview", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "axisTypes"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickDescriptor memoryview", "importModule": "", "selfLabel": "joystickDescriptor", "selfType": "hal.JoystickDescriptor"}, "fields": {"CLASS": "hal.JoystickDescriptor", "VAR": "name"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickDescriptor"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickDescriptor"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickDescriptor", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickDescriptor"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
