// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.DutyCycle

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycle"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.DutyCycle", "args": [{"name": "source", "type": "wpilib._wpilib.DigitalSource"}], "tooltip": "Constructs a DutyCycle input from a DigitalSource input.\n\nThis class does not own the inputted source.\n\n:param source: The DigitalSource to use.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "tooltip": "Get the FPGA index for the DutyCycle.\n\n:returns: the FPGA index", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle", "FUNC": "getFPGAIndex"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "tooltip": "Get the frequency of the duty cycle signal.\n\n:returns: frequency in Hertz", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle", "FUNC": "getFrequency"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "tooltip": "Get the raw high time of the duty cycle signal.\n\n:returns: high time of last pulse", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle", "FUNC": "getHighTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "tooltip": "Get the output ratio of the duty cycle signal.\n\n0 means always low, 1 means always high.\n\n:returns: output ratio between 0 and 1", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "tooltip": "Get the channel of the source.\n\n:returns: the source channel", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.DutyCycle", "FUNC": "getSourceChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.DutyCycle",
    name:  "DutyCycle",
      contents: contents,
  };
  return category;
}
