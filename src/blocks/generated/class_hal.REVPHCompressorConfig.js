// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.REVPHCompressorConfig

python.PythonVariableGetterNames["instance hal.REVPHCompressorConfig int"] = ["forceDisable", "useDigital"];
python.PythonVariableGetterTooltips["instance hal.REVPHCompressorConfig int"] = ["", ""];
python.PythonVariableSetterNames["instance hal.REVPHCompressorConfig int"] = ["forceDisable", "useDigital"];
python.PythonVariableSetterTooltips["instance hal.REVPHCompressorConfig int"] = ["", ""];
python.PythonVariableGetterNames["instance hal.REVPHCompressorConfig float"] = ["maxAnalogVoltage", "minAnalogVoltage"];
python.PythonVariableGetterTooltips["instance hal.REVPHCompressorConfig float"] = ["", ""];
python.PythonVariableSetterNames["instance hal.REVPHCompressorConfig float"] = ["maxAnalogVoltage", "minAnalogVoltage"];
python.PythonVariableSetterTooltips["instance hal.REVPHCompressorConfig float"] = ["", ""];


export function getToolboxCategory(subcategories) {
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
