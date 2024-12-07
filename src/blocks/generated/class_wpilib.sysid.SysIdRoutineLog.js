// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.sysid.SysIdRoutineLog

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SysIdRoutineLog",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create a new logging utility for a SysId test routine.\n\n:param logName: The name for the test routine in the log. Should be unique\n                between complete test routines (quasistatic and dynamic, forward and\n                reverse). The current state of this test (e.g. \"quasistatic-forward\")\n                will appear in WPILog under the \"sysid-test-state-logName\" entry.", "returnType": "wpilib._wpilib.sysid.SysIdRoutineLog", "args": [{"name": "logName", "type": "str"}], "importModule": "wpilib.sysid"}, "fields": {"CLASS": "wpilib.sysid.SysIdRoutineLog"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorLog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Log data from a motor during a SysId routine.\n\n:param motorName: The name of the motor.\n\n:returns: Handle with chainable callbacks to log individual data fields.", "returnType": "wpilib._wpilib.sysid.SysIdRoutineLog.MotorLog", "args": [{"name": "sysIdRoutineLog", "type": "wpilib._wpilib.sysid.SysIdRoutineLog"}, {"name": "motorName", "type": "str"}], "importModule": ""}, "fields": {"CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "motor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Records the current state of the SysId test routine. Should be called once\nper iteration during tests with the type of the current test, and once upon\ntest end with state `none`.\n\n:param state: The current state of the SysId test routine.", "returnType": "None", "args": [{"name": "sysIdRoutineLog", "type": "wpilib._wpilib.sysid.SysIdRoutineLog"}, {"name": "state", "type": "wpilib._wpilib.sysid.State"}], "importModule": ""}, "fields": {"CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "recordState"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "str", "args": [{"name": "state", "type": "wpilib._wpilib.sysid.State"}], "importModule": "wpilib.sysid"}, "fields": {"CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "stateEnumToString"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
