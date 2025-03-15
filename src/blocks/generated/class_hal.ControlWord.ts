// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class hal.ControlWord

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("hal.ControlWord", "int", ["autonomous", "control_reserved", "dsAttached", "eStop", "enabled", "fmsAttached", "test"], ["", "", "", "", "", "", ""]);
  setPythonVariable.initializeInstanceVariableSetter("hal.ControlWord", "int", ["autonomous", "control_reserved", "dsAttached", "eStop", "enabled", "fmsAttached", "test"], ["", "", "", "", "", "", ""]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 15 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "autonomous"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "autonomous"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "control_reserved"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "control_reserved"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "dsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "dsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "eStop"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "eStop"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "enabled"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "enabled"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "fmsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "fmsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "test"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "hal.ControlWord", "varType": "int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord", "VAR": "test"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlWord"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "hal.ControlWord", "args": [], "tooltip": "", "importModule": "hal"}, "fields": {"MODULE_OR_CLASS": "hal.ControlWord"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ControlWord",
    contents: contents,
    className: "hal.ControlWord",
  };

  return category;
}
