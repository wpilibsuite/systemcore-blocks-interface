// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.REVPHVersion

export function initialize() {
  python.initializeInstanceVariableGetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["", "", "", "", "", ""]);
  python.initializeInstanceVariableSetter("hal.REVPHVersion", "int", ["firmwareFix", "firmwareMajor", "firmwareMinor", "hardwareMajor", "hardwareMinor", "uniqueId"], ["", "", "", "", "", ""]);
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
