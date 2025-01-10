// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.PowerDistributionVersion

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.PowerDistributionVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
  pythonVariable.initializeInstanceVariableSetter("hal.PowerDistributionVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "PowerDistributionVersion",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "firmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "hardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.PowerDistributionVersion int", "importModule": "", "selfLabel": "powerDistributionVersion", "selfType": "hal.PowerDistributionVersion"}, "fields": {"CLASS": "hal.PowerDistributionVersion", "VAR": "uniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPowerDistributionVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.PowerDistributionVersion", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.PowerDistributionVersion"}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
