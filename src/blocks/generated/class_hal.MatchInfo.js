// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class hal.MatchInfo

python.PythonVariableGetterNames["instance hal.MatchInfo memoryview"] = ["eventName", "gameSpecificMessage"];
python.PythonVariableGetterTooltips["instance hal.MatchInfo memoryview"] = ["", ""];
python.PythonVariableGetterNames["instance hal.MatchInfo int"] = ["gameSpecificMessageSize", "matchNumber", "replayNumber"];
python.PythonVariableGetterTooltips["instance hal.MatchInfo int"] = ["", "", ""];
python.PythonVariableSetterNames["instance hal.MatchInfo int"] = ["gameSpecificMessageSize", "matchNumber", "replayNumber"];
python.PythonVariableSetterTooltips["instance hal.MatchInfo int"] = ["", "", ""];
python.PythonVariableGetterNames["instance hal.MatchInfo hal._wpiHal.MatchType"] = ["matchType"];
python.PythonVariableGetterTooltips["instance hal.MatchInfo hal._wpiHal.MatchType"] = [""];
python.PythonVariableSetterNames["instance hal.MatchInfo hal._wpiHal.MatchType"] = ["matchType"];
python.PythonVariableSetterTooltips["instance hal.MatchInfo hal._wpiHal.MatchType"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "MatchInfo",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.MatchInfo memoryview", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "eventName"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.MatchInfo memoryview", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessageSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessageSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "matchNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "matchNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "replayNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.MatchInfo int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "replayNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "hal._wpiHal.MatchType", "key": "instance hal.MatchInfo hal._wpiHal.MatchType", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "matchType"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "hal._wpiHal.MatchType", "key": "instance hal.MatchInfo hal._wpiHal.MatchType", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"CLASS": "hal.MatchInfo", "VAR": "matchType"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchType"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMatchInfo"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.MatchInfo", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.MatchInfo"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
