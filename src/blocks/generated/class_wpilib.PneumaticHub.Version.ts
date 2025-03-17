// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.PneumaticHub.Version

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.PneumaticHub.Version", "int", ["FirmwareFix", "FirmwareMajor", "FirmwareMinor", "HardwareMajor", "HardwareMinor", "UniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.PneumaticHub.Version", "int", ["FirmwareFix", "FirmwareMajor", "FirmwareMinor", "HardwareMajor", "HardwareMinor", "UniqueId"], ["The firmware fix version.", "The firmware major version.", "The firmware minor version.", "The hardware major version.", "The hardware minor version.", "The device's unique ID."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 13 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "FirmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "HardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "HardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "HardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "HardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "UniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PneumaticHub.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PneumaticHub.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version", "VAR": "UniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.PneumaticHub.Version", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PneumaticHub.Version"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Version",
    contents: contents,
    className: "wpilib.PneumaticHub.Version",
  };

  return category;
}
