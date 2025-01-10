// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimBoolean

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.SimBoolean", "hal._wpiHal.Type", ["type"], [""]);
  pythonVariable.initializeInstanceVariableGetter("hal.SimBoolean", "bool", ["value"], [""]);
  pythonVariable.initializeInstanceVariableSetter("hal.SimBoolean", "bool", ["value"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimBoolean",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimBoolean hal._wpiHal.Type", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"CLASS": "hal.SimBoolean", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "bool", "key": "instance hal.SimBoolean bool", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"CLASS": "hal.SimBoolean", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "bool", "key": "instance hal.SimBoolean bool", "importModule": "", "selfLabel": "simBoolean", "selfType": "hal.SimBoolean"}, "fields": {"CLASS": "hal.SimBoolean", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimBoolean"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueBoolean().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimBoolean", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimBoolean"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "bool", "args": [{"name": "simBoolean", "type": "hal._wpiHal.SimBoolean"}], "importModule": ""}, "fields": {"CLASS": "hal.SimBoolean", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simBoolean", "type": "hal._wpiHal.SimBoolean"}, {"name": "value", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "hal.SimBoolean", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimBoolean"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
