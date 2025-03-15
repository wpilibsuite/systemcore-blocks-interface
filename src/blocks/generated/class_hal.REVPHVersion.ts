// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.REVPHVersion

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
  setPythonVariable.initializeInstanceVariableSetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 13 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHVersion", "varType": "int", "importModule": "", "selfLabel": "rEVPHVersion", "selfType": "hal.REVPHVersion"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHVersion"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myREVPHVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal.REVPHVersion", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHVersion"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "REVPHVersion",
    contents: contents,
    className: "hal.REVPHVersion",
  };

  return category;
}
