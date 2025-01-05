// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.Value

export function initialize() {
  python.initializeInstanceVariableGetter("hal.Value", "hal._wpiHal.Type", ["type"], [""]);
  python.initializeInstanceVariableGetter("hal.Value", "object", ["value"], [""]);
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
