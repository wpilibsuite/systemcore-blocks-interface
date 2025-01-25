// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.PowerDistribution.Version

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.PowerDistribution.Version", "int", ["FirmwareFix", "FirmwareMajor", "FirmwareMinor", "HardwareMajor", "HardwareMinor", "UniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
  setPythonVariable.initializeInstanceVariableSetter("wpilib.PowerDistribution.Version", "int", ["FirmwareFix", "FirmwareMajor", "FirmwareMinor", "HardwareMajor", "HardwareMinor", "UniqueId"], ["Firmware fix version number.", "Firmware major version number.", "Firmware minor version number.", "Hardware major version number.", "Hardware minor version number.", "Unique ID."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 13 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareFix"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "FirmwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "HardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "HardwareMajor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "HardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "HardwareMinor"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "UniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.PowerDistribution.Version", "varType": "int", "importModule": "", "selfLabel": "version", "selfType": "wpilib.PowerDistribution.Version"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version", "VAR": "UniqueId"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myVersion"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myVersion"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.PowerDistribution.Version", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.PowerDistribution.Version"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Version",
    contents: contents,
    className: "wpilib.PowerDistribution.Version",
  };

  return category;
}
