// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class hal.SimValue

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.SimValue", "hal._wpiHal.Type", ["type"], [""]);
  pythonVariable.initializeInstanceVariableGetter("hal.SimValue", "object", ["value"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SimValue",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.SimValue hal._wpiHal.Type", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"CLASS": "hal.SimValue", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "object", "key": "instance hal.SimValue object", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"CLASS": "hal.SimValue", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValue().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimValue", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimValue"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
