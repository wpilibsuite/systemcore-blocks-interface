// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Timer

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 12 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTimer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Timer", "args": [], "tooltip": "Create a new timer object.\n\nCreate a new timer object and reset the time to zero. The timer is\ninitially not running and must be started.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "timer", "type": "wpilib.Timer"}, {"name": "period", "type": "wpimath.units.seconds"}], "tooltip": "Check if the period specified has passed and if it has, advance the start\ntime by that period. This is useful to decide if it's time to do periodic\nwork without drifting later by the time it took to get around to checking.\n\n:param period: The period to check for.\n\n:returns: True if the period has passed.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "advanceIfElapsed"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Get the current time from the timer. If the clock is running it is derived\nfrom the current system clock the start time stored in the timer class. If\nthe clock is not running, then return the time when it was last stopped.\n\n:returns: Current time value for this timer in seconds", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.units.seconds", "args": [], "tooltip": "Return the FPGA system clock time in seconds.\n\nReturn the time from the FPGA hardware clock in seconds since the FPGA\nstarted. Rolls over after 71 minutes.\n\n:returns: Robot running time in seconds.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "getFPGATimestamp"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.units.seconds", "args": [], "tooltip": "Return the approximate match time.\n\nThe FMS does not send an official match time to the robots, but does send\nan approximate match time. The value will count down the time remaining in\nthe current period (auto or teleop).\n\nWarning: This is not an official time (so it cannot be used to dispute ref\ncalls or guarantee that a function will trigger before the match ends).\n\nThe Practice Match function of the DS approximates the behavior seen on the\nfield.\n\n:returns: Time remaining in current match period (auto or teleop)", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "getMatchTime"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.units.seconds", "args": [], "tooltip": "Return the clock time in seconds. By default, the time is based on the FPGA\nhardware clock in seconds since the FPGA started. However, the return value\nof this method may be modified to use any time base, including\nnon-monotonic time bases.\n\n:returns: Robot running time in seconds.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "getTimestamp"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "timer", "type": "wpilib.Timer"}, {"name": "period", "type": "wpimath.units.seconds"}], "tooltip": "Check if the period specified has passed.\n\n:param period: The period to check.\n\n:returns: True if the period has passed.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "hasElapsed"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Whether the timer is currently running.\n\n:returns: true if running.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "isRunning"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Reset the timer by setting the time to 0.\n\nMake the timer startTime the current time so new requests will be relative\nto now.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Restart the timer by stopping the timer, if it is not already stopped,\nresetting the accumulated time, then starting the timer again. If you\nwant an event to periodically reoccur at some time interval from the\nstart time, consider using AdvanceIfElapsed() instead.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "restart"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Start the timer running.\n\nJust set the running flag to true indicating that all time requests should\nbe relative to the system clock. Note that this method is a no-op if the\ntimer is already running.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "start"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timer", "type": "wpilib.Timer"}], "tooltip": "Stop the timer.\n\nThis computes the time as of now and clears the running flag, causing all\nsubsequent time requests to be read from the accumulated time rather than\nlooking at the system clock.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Timer", "FUNC": "stop"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimer"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Timer",
    contents: contents,
    className: "wpilib.Timer",
  };

  return category;
}
