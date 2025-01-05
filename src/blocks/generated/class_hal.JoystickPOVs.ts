// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickPOVs

export function initialize() {
  python.initializeInstanceVariableGetter("hal.JoystickPOVs", "int", ["count"], [""]);
  python.initializeInstanceVariableSetter("hal.JoystickPOVs", "int", ["count"], [""]);
  python.initializeInstanceVariableGetter("hal.JoystickPOVs", "memoryview", ["povs"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "JoystickPOVs",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickPOVs int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickPOVs int", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickPOVs memoryview", "importModule": "", "selfLabel": "joystickPOVs", "selfType": "hal.JoystickPOVs"}, "fields": {"CLASS": "hal.JoystickPOVs", "VAR": "povs"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickPOVs"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickPOVs"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickPOVs", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickPOVs"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
