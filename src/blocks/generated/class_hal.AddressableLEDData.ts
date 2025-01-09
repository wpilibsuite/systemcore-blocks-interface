// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class hal.AddressableLEDData

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.AddressableLEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
  pythonVariable.initializeInstanceVariableSetter("hal.AddressableLEDData", "int", ["b", "g", "r"], ["///< blue value", "///< green value", "///< red value"]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "AddressableLEDData",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAddressableLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.AddressableLEDData", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.AddressableLEDData"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
