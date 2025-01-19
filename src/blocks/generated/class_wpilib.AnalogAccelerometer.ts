// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.AnalogAccelerometer

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.AnalogAccelerometer", "args": [{"name": "channel", "type": "int"}], "tooltip": "Create a new instance of an accelerometer.\n\nThe constructor allocates desired analog input.\n\n:param channel: The channel number for the analog input the accelerometer is\n                connected to", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.AnalogAccelerometer", "args": [{"name": "channel", "type": "wpilib._wpilib.AnalogInput"}], "tooltip": "Create a new instance of Accelerometer from an existing AnalogInput.\n\nMake a new instance of accelerometer given an AnalogInput. This is\nparticularly useful if the port is going to be read as an analog channel as\nwell as through the Accelerometer class.\n\n:param channel: The existing AnalogInput object for the analog input the\n                accelerometer is connected to", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}], "tooltip": "Return the acceleration in Gs.\n\nThe acceleration is returned units of Gs.\n\n:returns: The current acceleration of the sensor in Gs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer", "FUNC": "getAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "sensitivity", "type": "float"}], "tooltip": "Set the accelerometer sensitivity.\n\nThis sets the sensitivity of the accelerometer used for calculating the\nacceleration. The sensitivity varies by accelerometer model. There are\nconstants defined for various models.\n\n:param sensitivity: The sensitivity of accelerometer in Volts per G.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer", "FUNC": "setSensitivity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "zero", "type": "float"}], "tooltip": "Set the voltage that corresponds to 0 G.\n\nThe zero G voltage varies by accelerometer model. There are constants\ndefined for various models.\n\n:param zero: The zero G voltage.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogAccelerometer", "FUNC": "setZero"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.AnalogAccelerometer",
    name:  "AnalogAccelerometer",
      contents: contents,
  };
  return category;
}
