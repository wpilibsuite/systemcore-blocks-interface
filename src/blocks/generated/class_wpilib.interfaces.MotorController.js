// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.interfaces.MotorController

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "MotorController",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorController"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.interfaces._interfaces.MotorController", "args": [], "importModule": "wpilib.interfaces"}, "fields": {"CLASS": "wpilib.interfaces.MotorController"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for disabling a motor.", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "disable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for getting the current set speed of a motor controller.\n\n:returns: The current set speed.  Value is between -1.0 and 1.0.", "returnType": "float", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for returning the inversion state of a motor controller.\n\n:returns: isInverted The state of inversion, true is inverted.", "returnType": "bool", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "getInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for setting the speed of a motor controller.\n\n:param speed: The speed to set.  Value should be between -1.0 and 1.0.", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}, {"name": "speed", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for inverting direction of a motor controller.\n\n:param isInverted: The state of inversion, true is inverted.", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}, {"name": "isInverted", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "setInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the voltage output of the MotorController.  Compensates for\nthe current bus voltage to ensure that the desired voltage is output even\nif the battery voltage is below 12V - highly useful when the voltage\noutputs are \"meaningful\" (e.g. they come from a feedforward calculation).\n\nNOTE: This function *must* be called regularly in order for voltage\ncompensation to work properly - unlike the ordinary set function, it is not\n\"set it and forget it.\"\n\n:param output: The voltage to output.", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}, {"name": "output", "type": "wpimath.units.volts"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface to stop the motor until Set is called again.", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces._interfaces.MotorController"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.MotorController", "FUNC": "stopMotor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
