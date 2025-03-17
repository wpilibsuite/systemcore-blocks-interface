// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.BuiltInAccelerometer

export function initialize() {
  pythonEnum.initializeEnum("wpilib.BuiltInAccelerometer.Range", ["kRange_2G", "kRange_4G", "kRange_8G"], "Accelerometer range.\n\nMembers:\n\n  kRange_2G : 2 Gs max.\n\n  kRange_4G : 4 Gs max.\n\n  kRange_8G : 8 Gs max.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 9 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.BuiltInAccelerometer", "args": [{"name": "range", "type": "wpilib.BuiltInAccelerometer.Range"}], "tooltip": "Constructor.\n\n:param range: The range the accelerometer will measure", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib.BuiltInAccelerometer"}], "tooltip": ":returns: The acceleration of the roboRIO along the X axis in g-forces", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib.BuiltInAccelerometer"}], "tooltip": ":returns: The acceleration of the roboRIO along the Y axis in g-forces", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib.BuiltInAccelerometer"}], "tooltip": ":returns: The acceleration of the roboRIO along the Z axis in g-forces", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "builtInAccelerometer", "type": "wpilib.BuiltInAccelerometer"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "builtInAccelerometer", "type": "wpilib.BuiltInAccelerometer"}, {"name": "range", "type": "wpilib.BuiltInAccelerometer.Range"}], "tooltip": "Set the measuring range of the accelerometer.\n\n:param range: The maximum acceleration, positive or negative, that the\n              accelerometer will measure.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_2G"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_4G"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_8G"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "BuiltInAccelerometer",
    contents: contents,
    className: "wpilib.BuiltInAccelerometer",
  };

  return category;
}
