// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.BuiltInAccelerometer

export function initialize() {
  pythonEnum.initializeEnum("wpilib.BuiltInAccelerometer.Range", ["kRange_2G", "kRange_4G", "kRange_8G"], "Accelerometer range.\n\nMembers:\n\n  kRange_2G : 2 Gs max.\n\n  kRange_4G : 4 Gs max.\n\n  kRange_8G : 8 Gs max.");
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "BuiltInAccelerometer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor.\n\n:param range: The range the accelerometer will measure", "returnType": "wpilib._wpilib.BuiltInAccelerometer", "args": [{"name": "range", "type": "wpilib._wpilib.BuiltInAccelerometer.Range"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The acceleration of the roboRIO along the X axis in g-forces", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib._wpilib.BuiltInAccelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The acceleration of the roboRIO along the Y axis in g-forces", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib._wpilib.BuiltInAccelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": ":returns: The acceleration of the roboRIO along the Z axis in g-forces", "returnType": "float", "args": [{"name": "builtInAccelerometer", "type": "wpilib._wpilib.BuiltInAccelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "getZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "builtInAccelerometer", "type": "wpilib._wpilib.BuiltInAccelerometer"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the measuring range of the accelerometer.\n\n:param range: The maximum acceleration, positive or negative, that the\n              accelerometer will measure.", "returnType": "None", "args": [{"name": "builtInAccelerometer", "type": "wpilib._wpilib.BuiltInAccelerometer"}, {"name": "range", "type": "wpilib._wpilib.BuiltInAccelerometer.Range"}], "importModule": ""}, "fields": {"CLASS": "wpilib.BuiltInAccelerometer", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBuiltInAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}},
      {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_2G"}},
      {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_4G"}},
      {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.BuiltInAccelerometer.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.BuiltInAccelerometer.Range", "ENUM_VALUE": "kRange_8G"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
