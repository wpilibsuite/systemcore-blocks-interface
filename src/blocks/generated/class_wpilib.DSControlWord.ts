// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.DSControlWord

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 11 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDSControlWord"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.DSControlWord", "args": [], "tooltip": "DSControlWord constructor.\n\nUpon construction, the current Driver Station control word is read and\nstored internally.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is commanding autonomous mode.\n\n:returns: True if the robot is being commanded to be in autonomous mode", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isAutonomous"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is commanding autonomous mode and if it has enabled the\nrobot.\n\n:returns: True if the robot is being commanded to be in autonomous mode and\n          enabled.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isAutonomousEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is attached.\n\n:returns: True if the DS is connected to the robot", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isDSAttached"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the robot is disabled.\n\n:returns: True if the robot is explicitly disabled or the DS is not connected", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isDisabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the robot is e-stopped.\n\n:returns: True if the robot is e-stopped", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isEStopped"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS has enabled the robot.\n\n:returns: True if the robot is enabled and the DS is connected", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Is the driver station attached to a Field Management System?\n\n:returns: True if the robot is competing on a field being controlled by a\n          Field Management System", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isFMSAttached"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is commanding teleop mode.\n\n:returns: True if the robot is being commanded to be in teleop mode", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isTeleop"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is commanding teleop mode and if it has enabled the robot.\n\n:returns: True if the robot is being commanded to be in teleop mode and\n          enabled.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isTeleopEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib.DSControlWord"}], "tooltip": "Check if the DS is commanding test mode.\n\n:returns: True if the robot is being commanded to be in test mode", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DSControlWord", "FUNC": "isTest"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DSControlWord",
    contents: contents,
    className: "wpilib.DSControlWord",
  };

  return category;
}
