// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.MotorSafety

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 11 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorSafety"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.MotorSafety", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Check if this motor has exceeded its timeout.\n\nThis method is called periodically to determine if this motor has exceeded\nits timeout value. If it has, the stop method is called, and the motor is\nshut down until its value is updated again.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "check"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [], "tooltip": "Check the motors to see if any have timed out.\n\nThis static method is called periodically to poll all the motors and stop\nany that have timed out.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "checkMotors"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Feed the motor safety object.\n\nResets the timer on this object that is used to do the timeouts.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "feed"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Returns a description to print when an error occurs.\n\n:returns: Description to print when an error occurs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "getDescription"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Retrieve the timeout value for the corresponding motor safety object.\n\n:returns: the timeout value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "getExpiration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Determine if the motor is still operating or has timed out.\n\n:returns: true if the motor is still operating normally and hasn't timed out.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "isAlive"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Return the state of the motor safety enabled flag.\n\nReturn if the motor safety is currently enabled for this device.\n\n:returns: True if motor safety is enforced for this device.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "isSafetyEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}, {"name": "expirationTime", "type": "wpimath.units.seconds"}], "tooltip": "Set the expiration time for the corresponding motor safety object.\n\n:param expirationTime: The timeout value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "setExpiration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}, {"name": "enabled", "type": "bool"}], "tooltip": "Enable/disable motor safety for this device.\n\nTurn on and off the motor safety option for this PWM object.\n\n:param enabled: True if motor safety is enforced for this object.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "setSafetyEnabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorSafety", "type": "wpilib.MotorSafety"}], "tooltip": "Called to stop the motor when the timeout expires.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MotorSafety", "FUNC": "stopMotor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorSafety"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MotorSafety",
    contents: contents,
    className: "wpilib.MotorSafety",
  };

  return category;
}
