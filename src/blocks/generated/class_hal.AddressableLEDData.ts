// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.AddressableLEDData

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.AddressableLEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
  setPythonVariable.initializeInstanceVariableSetter("hal.AddressableLEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AddressableLEDData",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.AddressableLEDData", "varType": "int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAddressableLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.AddressableLEDData", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.AddressableLEDData"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
