// This file was generated. Do not edit!

// Blocks for class wpilib.RobotState

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "RobotState",
    contents: [
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is in autonomous mode.\n\n:returns: True if the robot is in autonomous mode.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isAutonomous"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is disabled.\n\n:returns: True if the robot is disabled.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isDisabled"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is E-stopped.\n\n:returns: True if the robot is E-stopped.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isEStopped"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is enabled.\n\n:returns: True if the robot is enabled.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isEnabled"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is in teleop mode.\n\n:returns: True if the robot is in teleop mode.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isTeleop"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if the robot is in test mode.\n\n:returns: True if the robot is in test mode.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.RobotState", "FUNC": "isTest"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
