// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class hal.ControlWord

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("hal.ControlWord", "int", ["autonomous", "control_reserved", "dsAttached", "eStop", "enabled", "fmsAttached", "test"], ["", "", "", "", "", "", ""]);
  pythonVariable.initializeInstanceVariableSetter("hal.ControlWord", "int", ["autonomous", "control_reserved", "dsAttached", "eStop", "enabled", "fmsAttached", "test"], ["", "", "", "", "", "", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ControlWord",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "autonomous"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "autonomous"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "control_reserved"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "control_reserved"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "dsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "dsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "eStop"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "eStop"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "enabled"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "enabled"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "fmsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "fmsAttached"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "test"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.ControlWord int", "importModule": "", "selfLabel": "controlWord", "selfType": "hal.ControlWord"}, "fields": {"CLASS": "hal.ControlWord", "VAR": "test"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myControlWord"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myControlWord"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.ControlWord", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.ControlWord"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
