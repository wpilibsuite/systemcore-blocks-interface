// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.SimValue

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.SimValue", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.SimValue", "object", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimValue", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"MODULE_OR_CLASS": "hal.SimValue", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.SimValue", "varType": "object", "importModule": "", "selfLabel": "simValue", "selfType": "hal.SimValue"}, "fields": {"MODULE_OR_CLASS": "hal.SimValue", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimValue"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimValue"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal.SimValue", "args": [{"name": "handle", "type": "int"}], "tooltip": "Wraps a simulated value handle as returned by HAL_CreateSimValue().\n\n:param handle: simulated value handle", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.SimValue"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SimValue",
    contents: contents,
    className: "hal.SimValue",
  };

  return category;
}
