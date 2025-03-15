// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Watchdog

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 11 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWatchdog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Watchdog", "args": [{"name": "timeout", "type": "wpimath.units.seconds"}, {"name": "callback", "type": "Callable[[], None]"}], "tooltip": "Watchdog constructor.\n\n:param timeout:  The watchdog's timeout in seconds with microsecond\n                 resolution.\n:param callback: This function is called when the timeout expires.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallable"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}, {"name": "epochName", "type": "str"}], "tooltip": "Adds time since last epoch to the list printed by PrintEpochs().\n\nEpochs are a way to partition the time elapsed so that when overruns occur,\none can determine which parts of an operation consumed the most time.\n\n:param epochName: The name to associate with the epoch.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "addEpoch"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Disables the watchdog timer.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "disable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Enables the watchdog timer.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "enable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Returns the time since the watchdog was last fed.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "getTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Returns the watchdog's timeout.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "getTimeout"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Returns true if the watchdog timer has expired.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "isExpired"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Prints list of epochs added so far and their times.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "printEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}], "tooltip": "Resets the watchdog timer.\n\nThis also enables the timer if it was previously disabled.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}, {"name": "timeout", "type": "wpimath.units.seconds"}], "tooltip": "Sets the watchdog's timeout.\n\n:param timeout: The watchdog's timeout in seconds with microsecond\n                resolution.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "setTimeout"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib.Watchdog"}, {"name": "suppress", "type": "bool"}], "tooltip": "Enable or disable suppression of the generic timeout message.\n\nThis may be desirable if the user-provided callback already prints a more\nspecific message.\n\n:param suppress: Whether to suppress generic timeout message.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Watchdog", "FUNC": "suppressTimeoutMessage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Watchdog",
    contents: contents,
    className: "wpilib.Watchdog",
  };

  return category;
}
