// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.PowerDistributionVersion

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.PowerDistributionVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
  setPythonVariable.initializeInstanceVariableSetter("hal.PowerDistributionVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 13 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.PowerDistributionVersion", "varType": "int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.PowerDistributionVersion", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.PowerDistributionVersion"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "PowerDistributionVersion",
    contents: contents,
    className: "hal.PowerDistributionVersion",
  };

  return category;
}
