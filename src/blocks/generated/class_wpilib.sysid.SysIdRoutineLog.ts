// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.sysid.SysIdRoutineLog

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SysIdRoutineLog",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.sysid.SysIdRoutineLog", "args": [{"name": "logName", "type": "str"}], "tooltip": "Create a new logging utility for a SysId test routine.\n\n:param logName: The name for the test routine in the log. Should be unique\n                between complete test routines (quasistatic and dynamic, forward and\n                reverse). The current state of this test (e.g. \"quasistatic-forward\")\n                will appear in WPILog under the \"sysid-test-state-logName\" entry.", "importModule": "wpilib.sysid"}, "fields": {"MODULE_OR_CLASS": "wpilib.sysid.SysIdRoutineLog"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorLog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.sysid.SysIdRoutineLog.MotorLog", "args": [{"name": "sysIdRoutineLog", "type": "wpilib._wpilib.sysid.SysIdRoutineLog"}, {"name": "motorName", "type": "str"}], "tooltip": "Log data from a motor during a SysId routine.\n\n:param motorName: The name of the motor.\n\n:returns: Handle with chainable callbacks to log individual data fields.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "motor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}}}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sysIdRoutineLog", "type": "wpilib._wpilib.sysid.SysIdRoutineLog"}, {"name": "state", "type": "wpilib._wpilib.sysid.State"}], "tooltip": "Records the current state of the SysId test routine. Should be called once\nper iteration during tests with the type of the current test, and once upon\ntest end with state `none`.\n\n:param state: The current state of the SysId test routine.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "recordState"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySysIdRoutineLog"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "str", "args": [{"name": "state", "type": "wpilib._wpilib.sysid.State"}], "tooltip": "", "importModule": "wpilib.sysid"}, "fields": {"MODULE_OR_CLASS": "wpilib.sysid.SysIdRoutineLog", "FUNC": "stateEnumToString"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
