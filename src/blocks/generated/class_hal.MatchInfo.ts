// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.MatchInfo

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "memoryview", ["eventName", "gameSpecificMessage"], ["", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "int", ["gameSpecificMessageSize", "matchNumber", "replayNumber"], ["", "", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.MatchInfo", "int", ["gameSpecificMessageSize", "matchNumber", "replayNumber"], ["", "", ""]);
  getPythonVariable.initializeInstanceVariableGetter("hal.MatchInfo", "hal._wpiHal.MatchType", ["matchType"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.MatchInfo", "hal._wpiHal.MatchType", ["matchType"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MatchInfo",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "memoryview", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "eventName"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "memoryview", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessage"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessageSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "gameSpecificMessageSize"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "matchNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "matchNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "replayNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "int", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "replayNumber"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "hal._wpiHal.MatchType", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "matchType"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.MatchInfo", "varType": "hal._wpiHal.MatchType", "importModule": "", "selfLabel": "matchInfo", "selfType": "hal.MatchInfo"}, "fields": {"MODULE_OR_CLASS": "hal.MatchInfo", "VAR": "matchType"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchType"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMatchInfo"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMatchInfo"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.MatchInfo", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.MatchInfo"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
