// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.Tracer

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Tracer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTracer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a Tracer instance.", "returnType": "wpilib._wpilib.Tracer", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Tracer"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Adds time since last epoch to the list printed by PrintEpochs().\n\nEpochs are a way to partition the time elapsed so that when overruns occur,\none can determine which parts of an operation consumed the most time.\n\n:param epochName: The name to associate with the epoch.", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}, {"name": "epochName", "type": "str"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Tracer", "FUNC": "addEpoch"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Clears all epochs.", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Tracer", "FUNC": "clearEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Retreives list of epochs added so far as a string\n\n.. versionadded:: 2021.1.2\n\n.. note:: This function only exists in RobotPy", "returnType": "str", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Tracer", "FUNC": "getEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Prints list of epochs added so far and their times to the DriverStation.", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Tracer", "FUNC": "printEpochs"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Restarts the epoch timer.", "returnType": "None", "args": [{"name": "tracer", "type": "wpilib._wpilib.Tracer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Tracer", "FUNC": "resetTimer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTracer"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
