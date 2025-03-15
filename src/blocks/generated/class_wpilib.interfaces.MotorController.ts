// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.interfaces.MotorController

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorController"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.interfaces.MotorController", "args": [], "tooltip": "", "importModule": "wpilib.interfaces"}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}], "tooltip": "Common interface for disabling a motor.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "disable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}], "tooltip": "Common interface for getting the current set speed of a motor controller.\n\n:returns: The current set speed.  Value is between -1.0 and 1.0.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}], "tooltip": "Common interface for returning the inversion state of a motor controller.\n\n:returns: isInverted The state of inversion, true is inverted.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "getInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}, {"name": "speed", "type": "float"}], "tooltip": "Common interface for setting the speed of a motor controller.\n\n:param speed: The speed to set.  Value should be between -1.0 and 1.0.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}, {"name": "isInverted", "type": "bool"}], "tooltip": "Common interface for inverting direction of a motor controller.\n\n:param isInverted: The state of inversion, true is inverted.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "setInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}, {"name": "output", "type": "wpimath.units.volts"}], "tooltip": "Sets the voltage output of the MotorController.  Compensates for\nthe current bus voltage to ensure that the desired voltage is output even\nif the battery voltage is below 12V - highly useful when the voltage\noutputs are \"meaningful\" (e.g. they come from a feedforward calculation).\n\nNOTE: This function *must* be called regularly in order for voltage\ncompensation to work properly - unlike the ordinary set function, it is not\n\"set it and forget it.\"\n\n:param output: The voltage to output.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "motorController", "type": "wpilib.interfaces.MotorController"}], "tooltip": "Common interface to stop the motor until Set is called again.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.interfaces.MotorController", "FUNC": "stopMotor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorController"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MotorController",
    contents: contents,
    className: "wpilib.interfaces.MotorController",
  };

  return category;
}
