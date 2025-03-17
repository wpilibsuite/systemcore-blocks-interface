// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Solenoid

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoid"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Solenoid", "args": [{"name": "module", "type": "int"}, {"name": "moduleType", "type": "wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "tooltip": "Constructs a solenoid for a specified module and type.\n\n:param module:     The module ID to use.\n:param moduleType: The module type to use.\n:param channel:    The channel the solenoid is on.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySolenoid"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Solenoid", "args": [{"name": "moduleType", "type": "wpilib.PneumaticsModuleType"}, {"name": "channel", "type": "int"}], "tooltip": "Constructs a solenoid for a default module and specified type.\n\n:param moduleType: The module type to use.\n:param channel:    The channel the solenoid is on.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPneumaticsModuleType"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}], "tooltip": "Read the current value of the solenoid.\n\n:returns: The current value of the solenoid.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}], "tooltip": "Get the channel this solenoid is connected to.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}], "tooltip": "Check if solenoid is Disabled.\n\nIf a solenoid is shorted, it is added to the DisabledList and\ndisabled until power cycle, or until faults are cleared.\n\n@see ClearAllPCMStickyFaults()\n\n:returns: If solenoid is disabled due to short.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "isDisabled"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}, {"name": "on", "type": "bool"}], "tooltip": "Set the value of a solenoid.\n\n:param on: Turn the solenoid output off or on.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}, {"name": "duration", "type": "wpimath.units.seconds"}], "tooltip": "Set the pulse duration in the pneumatics module. This is used in\nconjunction with the startPulse method to allow the pneumatics module to\ncontrol the timing of a pulse.\n\nOn the PCM, the timing can be controlled in 0.01 second increments, with a\nmaximum of 2.55 seconds. On the PH, the timing can be controlled in 0.001\nsecond increments, with a maximum of 65.534 seconds.\n\n@see startPulse()\n\n:param duration: The duration of the pulse.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "setPulseDuration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}], "tooltip": "%Trigger the pneumatics module to generate a pulse of the duration set in\nsetPulseDuration.\n\n@see setPulseDuration()", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "startPulse"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "solenoid", "type": "wpilib.Solenoid"}], "tooltip": "Toggle the value of the solenoid.\n\nIf the solenoid is set to on, it'll be turned off. If the solenoid is set\nto off, it'll be turned on.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Solenoid", "FUNC": "toggle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySolenoid"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Solenoid",
    contents: contents,
    className: "wpilib.Solenoid",
  };

  return category;
}
