// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class hal.REVPHCompressorConfig

export function initialize() {
  python.initializeInstanceVariableGetter("hal.REVPHCompressorConfig", "int", ["forceDisable", "useDigital"], ["", ""]);
  python.initializeInstanceVariableSetter("hal.REVPHCompressorConfig", "int", ["forceDisable", "useDigital"], ["", ""]);
  python.initializeInstanceVariableGetter("hal.REVPHCompressorConfig", "float", ["maxAnalogVoltage", "minAnalogVoltage"], ["", ""]);
  python.initializeInstanceVariableSetter("hal.REVPHCompressorConfig", "float", ["maxAnalogVoltage", "minAnalogVoltage"], ["", ""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "REVPHCompressorConfig",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHCompressorConfig int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "forceDisable"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHCompressorConfig int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "forceDisable"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHCompressorConfig int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "useDigital"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.REVPHCompressorConfig int", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "useDigital"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.REVPHCompressorConfig float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "maxAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.REVPHCompressorConfig float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "maxAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.REVPHCompressorConfig float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "minAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance hal.REVPHCompressorConfig float", "importModule": "", "selfLabel": "rEVPHCompressorConfig", "selfType": "hal.REVPHCompressorConfig"}, "fields": {"CLASS": "hal.REVPHCompressorConfig", "VAR": "minAnalogVoltage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myREVPHCompressorConfig"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.REVPHCompressorConfig", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.REVPHCompressorConfig"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
