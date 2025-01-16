// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.RobotState

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "RobotState",
    contents: [
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is in autonomous mode.\n\n:returns: True if the robot is in autonomous mode.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isAutonomous"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is disabled.\n\n:returns: True if the robot is disabled.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isDisabled"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is E-stopped.\n\n:returns: True if the robot is E-stopped.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isEStopped"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is enabled.\n\n:returns: True if the robot is enabled.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isEnabled"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is in teleop mode.\n\n:returns: True if the robot is in teleop mode.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isTeleop"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if the robot is in test mode.\n\n:returns: True if the robot is in test mode.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.RobotState", "FUNC": "isTest"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
