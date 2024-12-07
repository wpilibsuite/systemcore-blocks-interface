// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.Watchdog

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Watchdog",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWatchdog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Watchdog constructor.\n\n:param timeout:  The watchdog's timeout in seconds with microsecond\n                 resolution.\n:param callback: This function is called when the timeout expires.", "returnType": "wpilib._wpilib.Watchdog", "args": [{"name": "timeout", "type": "wpimath.units.seconds"}, {"name": "callback", "type": "Callable[[], None]"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Watchdog"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Adds time since last epoch to the list printed by PrintEpochs().\n\nEpochs are a way to partition the time elapsed so that when overruns occur,\none can determine which parts of an operation consumed the most time.\n\n:param epochName: The name to associate with the epoch.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}, {"name": "epochName", "type": "str"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "addEpoch"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Disables the watchdog timer.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "disable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Enables the watchdog timer.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "enable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the time since the watchdog was last fed.", "returnType": "wpimath.units.seconds", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "getTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the watchdog's timeout.", "returnType": "wpimath.units.seconds", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "getTimeout"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns true if the watchdog timer has expired.", "returnType": "bool", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "isExpired"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Prints list of epochs added so far and their times.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "printEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the watchdog timer.\n\nThis also enables the timer if it was previously disabled.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the watchdog's timeout.\n\n:param timeout: The watchdog's timeout in seconds with microsecond\n                resolution.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}, {"name": "timeout", "type": "wpimath.units.seconds"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "setTimeout"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Enable or disable suppression of the generic timeout message.\n\nThis may be desirable if the user-provided callback already prints a more\nspecific message.\n\n:param suppress: Whether to suppress generic timeout message.", "returnType": "None", "args": [{"name": "watchdog", "type": "wpilib._wpilib.Watchdog"}, {"name": "suppress", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Watchdog", "FUNC": "suppressTimeoutMessage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWatchdog"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
