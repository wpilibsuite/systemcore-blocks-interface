// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickButtons

export function initialize() {
  python.initializeInstanceVariableGetter("hal.JoystickButtons", "int", ["buttons", "count"], ["", ""]);
  python.initializeInstanceVariableSetter("hal.JoystickButtons", "int", ["buttons", "count"], ["", ""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "JoystickButtons",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickButtons int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"CLASS": "hal.JoystickButtons", "VAR": "buttons"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickButtons int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"CLASS": "hal.JoystickButtons", "VAR": "buttons"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickButtons int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"CLASS": "hal.JoystickButtons", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickButtons int", "importModule": "", "selfLabel": "joystickButtons", "selfType": "hal.JoystickButtons"}, "fields": {"CLASS": "hal.JoystickButtons", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickButtons"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickButtons"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickButtons", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickButtons"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
