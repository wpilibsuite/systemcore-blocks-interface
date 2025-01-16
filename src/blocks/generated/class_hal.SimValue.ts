// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.SimValue

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimValue", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimValue", "object", ["value"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SimValue",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimValue", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"MODULE_OR_CLASS": "hal.SimValue", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimValue", "varType": "object", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"MODULE_OR_CLASS": "hal.SimValue", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValue().\n\n:param handle: simulated value handle", "returnType": "hal._wpiHal.SimValue", "args": [{"name": "handle", "type": "int"}], "importModule": "hal"}, "fields": {"CLASS": "hal.SimValue"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
