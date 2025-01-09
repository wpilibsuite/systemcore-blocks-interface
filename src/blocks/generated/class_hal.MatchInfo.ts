// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class hal.MatchInfo

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "memoryview", ["eventName", "gameSpecificMessage"], ["", ""]);
  pythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "int", ["gameSpecificMessageSize", "matchNumber", "replayNumber"], ["", "", ""]);
  pythonVariable.initializeInstanceVariableSetter("hal.MatchInfo", "int", ["gameSpecificMessageSize", "matchNumber", "replayNumber"], ["", "", ""]);
  pythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "hal._wpiHal.MatchType", ["matchType"], [""]);
  pythonVariable.initializeInstanceVariableSetter("hal.MatchInfo", "hal._wpiHal.MatchType", ["matchType"], [""]);
}

export function getToolboxCategory(subcategories: any): Category {
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
