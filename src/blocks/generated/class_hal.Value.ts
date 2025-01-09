// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class hal.Value

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.Value", "hal._wpiHal.Type", ["type"], [""]);
  pythonVariable.initializeInstanceVariableGetter("hal.Value", "object", ["value"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "Value",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.Type", "key": "instance hal.Value hal._wpiHal.Type", "importModule": "", "selfLabel": "value", "selfType": "hal.Value"}, "fields": {"CLASS": "hal.Value", "VAR": "type"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "object", "key": "instance hal.Value object", "importModule": "", "selfLabel": "value", "selfType": "hal.Value"}, "fields": {"CLASS": "hal.Value", "VAR": "value"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myValue"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
