// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Tracer

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTracer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Tracer", "args": [], "tooltip": "Constructs a Tracer instance.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}, {"name": "epochName", "type": "str"}], "tooltip": "Adds time since last epoch to the list printed by PrintEpochs().\n\nEpochs are a way to partition the time elapsed so that when overruns occur,\none can determine which parts of an operation consumed the most time.\n\n:param epochName: The name to associate with the epoch.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer", "FUNC": "addEpoch"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "tooltip": "Clears all epochs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer", "FUNC": "clearEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "tooltip": "Retreives list of epochs added so far as a string\n\n.. versionadded:: 2021.1.2\n\n.. note:: This function only exists in RobotPy", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer", "FUNC": "getEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "tooltip": "Prints list of epochs added so far and their times to the DriverStation.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer", "FUNC": "printEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "tooltip": "Restarts the epoch timer.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Tracer", "FUNC": "resetTimer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Tracer",
    contents: contents,
    className: "wpilib.Tracer",
  };

  return category;
}
