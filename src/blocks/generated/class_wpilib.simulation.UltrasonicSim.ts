// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.UltrasonicSim

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "UltrasonicSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUltrasonicSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor.\n\n:param ultrasonic: The real ultrasonic to simulate", "returnType": "wpilib.simulation._simulation.UltrasonicSim", "args": [{"name": "ultrasonic", "type": "wpilib._wpilib.Ultrasonic"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.UltrasonicSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonic"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUltrasonicSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor.\n\n:param ping: unused.\n:param echo: the ultrasonic's echo channel.", "returnType": "wpilib.simulation._simulation.UltrasonicSim", "args": [{"name": "ping", "type": "int"}, {"name": "echo", "type": "int"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.UltrasonicSim"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the range measurement.\n\n:param range: The range.", "returnType": "None", "args": [{"name": "ultrasonicSim", "type": "wpilib.simulation._simulation.UltrasonicSim"}, {"name": "range", "type": "wpimath.units.inches"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.UltrasonicSim", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonicSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets if the range measurement is valid.\n\n:param valid: True if valid", "returnType": "None", "args": [{"name": "ultrasonicSim", "type": "wpilib.simulation._simulation.UltrasonicSim"}, {"name": "valid", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.UltrasonicSim", "FUNC": "setRangeValid"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUltrasonicSim"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
