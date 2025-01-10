// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.MotorControllerGroup

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MotorControllerGroup",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMotorControllerGroup"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.MotorControllerGroup", "args": [{"name": "args", "type": "tuple"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.MotorControllerGroup"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTuple"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "disable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "float", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "bool", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "getInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}, {"name": "speed", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}, {"name": "isInverted", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "setInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}, {"name": "output", "type": "wpimath.units.volts"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "setVoltage"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "motorControllerGroup", "type": "wpilib._wpilib.MotorControllerGroup"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MotorControllerGroup", "FUNC": "stopMotor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMotorControllerGroup"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
