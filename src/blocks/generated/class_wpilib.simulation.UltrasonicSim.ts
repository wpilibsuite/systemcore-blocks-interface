// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.UltrasonicSim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUltrasonicSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.UltrasonicSim", "args": [{"name": "ultrasonic", "type": "wpilib._wpilib.Ultrasonic"}], "tooltip": "Constructor.\n\n:param ultrasonic: The real ultrasonic to simulate", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.UltrasonicSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonic"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUltrasonicSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.UltrasonicSim", "args": [{"name": "ping", "type": "int"}, {"name": "echo", "type": "int"}], "tooltip": "Constructor.\n\n:param ping: unused.\n:param echo: the ultrasonic's echo channel.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.UltrasonicSim"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "ultrasonicSim", "type": "wpilib.simulation._simulation.UltrasonicSim"}, {"name": "range", "type": "wpimath.units.inches"}], "tooltip": "Sets the range measurement.\n\n:param range: The range.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.UltrasonicSim", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonicSim"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "ultrasonicSim", "type": "wpilib.simulation._simulation.UltrasonicSim"}, {"name": "valid", "type": "bool"}], "tooltip": "Sets if the range measurement is valid.\n\n:param valid: True if valid", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.UltrasonicSim", "FUNC": "setRangeValid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonicSim"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.simulation.UltrasonicSim",
    name:  "UltrasonicSim",
      contents: contents,
  };
  return category;
}
