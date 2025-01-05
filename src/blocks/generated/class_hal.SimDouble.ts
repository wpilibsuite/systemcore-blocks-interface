// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimDouble

export function initialize() {
  python.initializeInstanceVariableGetter("hal.SimDouble", "hal._wpiHal.Type", ["type"], [""]);
  python.initializeInstanceVariableGetter("hal.SimDouble", "float", ["value"], [""]);
  python.initializeInstanceVariableSetter("hal.SimDouble", "float", ["value"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SimDouble",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimDouble hal._wpiHal.Type", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"CLASS": "hal.SimDouble", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.SimDouble float", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"CLASS": "hal.SimDouble", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.SimDouble float", "importModule": "", "selfLabel": "simDouble", "selfType": "hal.SimDouble"}, "fields": {"CLASS": "hal.SimDouble", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimDouble"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValueDouble().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimDouble", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimDouble"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the simulated value.\n\n:returns: The current value", "returnType": "float", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}], "importModule": ""}, "fields": {"CLASS": "hal.SimDouble", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the simulated value to 0. Use this instead of Set(0) for resetting\nincremental sensor values like encoder counts or gyro accumulated angle\nto ensure correct behavior in a distributed system (e.g. WebSockets).", "returnType": "None", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}], "importModule": ""}, "fields": {"CLASS": "hal.SimDouble", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the simulated value.\n\n:param value: the value to set", "returnType": "None", "args": [{"name": "simDouble", "type": "hal._wpiHal.SimDouble"}, {"name": "value", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "hal.SimDouble", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimDouble"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
