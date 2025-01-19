// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.Value

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.Value", "hal._wpiHal.Type", ["type"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.Value", "object", ["value"], [""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.Value", "varType": "hal._wpiHal.Type", "importModule": "", "selfLabel": "value", "selfType": "hal.Value"}, "fields": {"MODULE_OR_CLASS": "hal.Value", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.Value", "varType": "object", "importModule": "", "selfLabel": "value", "selfType": "hal.Value"}, "fields": {"MODULE_OR_CLASS": "hal.Value", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "hal.Value",
    name:  "Value",
      contents: contents,
  };
  return category;
}
