// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.DSControlWord

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DSControlWord",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDSControlWord"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "DSControlWord constructor.\n\nUpon construction, the current Driver Station control word is read and\nstored internally.", "returnType": "wpilib._wpilib.DSControlWord", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DSControlWord"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is commanding autonomous mode.\n\n:returns: True if the robot is being commanded to be in autonomous mode", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isAutonomous"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is commanding autonomous mode and if it has enabled the\nrobot.\n\n:returns: True if the robot is being commanded to be in autonomous mode and\n          enabled.", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isAutonomousEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is attached.\n\n:returns: True if the DS is connected to the robot", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isDSAttached"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the robot is disabled.\n\n:returns: True if the robot is explicitly disabled or the DS is not connected", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isDisabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the robot is e-stopped.\n\n:returns: True if the robot is e-stopped", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isEStopped"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS has enabled the robot.\n\n:returns: True if the robot is enabled and the DS is connected", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Is the driver station attached to a Field Management System?\n\n:returns: True if the robot is competing on a field being controlled by a\n          Field Management System", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isFMSAttached"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is commanding teleop mode.\n\n:returns: True if the robot is being commanded to be in teleop mode", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isTeleop"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is commanding teleop mode and if it has enabled the robot.\n\n:returns: True if the robot is being commanded to be in teleop mode and\n          enabled.", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isTeleopEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Check if the DS is commanding test mode.\n\n:returns: True if the robot is being commanded to be in test mode", "returnType": "bool", "args": [{"name": "dSControlWord", "type": "wpilib._wpilib.DSControlWord"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DSControlWord", "FUNC": "isTest"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDSControlWord"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
