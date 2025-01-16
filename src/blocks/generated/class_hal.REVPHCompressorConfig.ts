// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.REVPHCompressorConfig

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.REVPHCompressorConfig", "int", ["forceDisable", "useDigital"], ["", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.REVPHCompressorConfig", "int", ["forceDisable", "useDigital"], ["", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.REVPHCompressorConfig", "float", ["maxAnalogVoltage", "minAnalogVoltage"], ["", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.REVPHCompressorConfig", "float", ["maxAnalogVoltage", "minAnalogVoltage"], ["", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "REVPHCompressorConfig",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "forceDisable"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "forceDisable"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "useDigital"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "useDigital"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "maxAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "maxAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "minAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.REVPHCompressorConfig", "varType": "float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig", "VAR": "minAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal._wpiHal.REVPHCompressorConfig", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.REVPHCompressorConfig"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
