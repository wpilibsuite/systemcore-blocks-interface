// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.JoystickAxes

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.JoystickAxes", "memoryview", ["axes", "raw"], ["", ""]);
  pythonVariable.initializeInstanceVariableGetter("hal.JoystickAxes", "int", ["count"], [""]);
  pythonVariable.initializeInstanceVariableSetter("hal.JoystickAxes", "int", ["count"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "JoystickAxes",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickAxes memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "axes"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.JoystickAxes memoryview", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "raw"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickAxes int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.JoystickAxes int", "importModule": "", "selfLabel": "joystickAxes", "selfType": "hal.JoystickAxes"}, "fields": {"CLASS": "hal.JoystickAxes", "VAR": "count"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myJoystickAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myJoystickAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.JoystickAxes", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.JoystickAxes"}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
