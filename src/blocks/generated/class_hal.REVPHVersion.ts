// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class hal.REVPHVersion

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
  pythonVariable.initializeInstanceVariableSetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "REVPHVersion",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHVersion int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"CLASS": "hal.REVPHVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myREVPHVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.REVPHVersion", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.REVPHVersion"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
