// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimLong

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.SimLong", "hal._wpiHal.Type", ["type"], [""]);
  pythonVariable.initializeInstanceVariableGetter("hal.SimLong", "int", ["value"], [""]);
  pythonVariable.initializeInstanceVariableSetter("hal.SimLong", "int", ["value"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimLong",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimLong hal._wpiHal.Type", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"CLASS": "hal.SimLong", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.SimLong int", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"CLASS": "hal.SimLong", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.SimLong int", "importModule": "", "selfLabel": "simLong", "selfType": "hal.SimLong"}, "fields": {"CLASS": "hal.SimLong", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimLong"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueLong().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimLong", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimLong"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "int", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}], "importModule": ""}, "fields": {"CLASS": "hal.SimLong", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the simulated value to 0. Use this instead of Set(0) for resetting\nincremental sensor values like encoder counts or gyro accumulated angle\nto ensure correct behavior in a distributed system (e.g. WebSockets).", "returnType": "None", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}], "importModule": ""}, "fields": {"CLASS": "hal.SimLong", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simLong", "type": "hal._wpiHal.SimLong"}, {"name": "value", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "hal.SimLong", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimLong"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
