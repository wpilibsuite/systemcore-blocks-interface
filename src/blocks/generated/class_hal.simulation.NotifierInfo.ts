// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.simulation.NotifierInfo

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.simulation.NotifierInfo", "int", ["handle", "timeout", "waitTimeValid"], ["", "", ""]);
  pythonVariable.initializeInstanceVariableSetter("hal.simulation.NotifierInfo", "int", ["handle", "timeout", "waitTimeValid"], ["", "", ""]);
  pythonVariable.initializeInstanceVariableGetter("hal.simulation.NotifierInfo", "memoryview", ["name"], [""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "NotifierInfo",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "handle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "timeout"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.simulation.NotifierInfo int", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "waitTimeValid"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "memoryview", "key": "instance hal.simulation.NotifierInfo memoryview", "importModule": "", "selfLabel": "notifierInfo", "selfType": "hal.simulation.NotifierInfo"}, "fields": {"CLASS": "hal.simulation.NotifierInfo", "VAR": "name"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifierInfo"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myNotifierInfo"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal.simulation._simulation.NotifierInfo", "args": [], "importModule": "hal.simulation"}, "fields": {"CLASS": "hal.simulation.NotifierInfo"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
