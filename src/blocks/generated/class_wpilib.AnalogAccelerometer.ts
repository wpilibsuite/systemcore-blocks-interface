// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.AnalogAccelerometer

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "AnalogAccelerometer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create a new instance of an accelerometer.\n\nThe constructor allocates desired analog input.\n\n:param channel: The channel number for the analog input the accelerometer is\n                connected to", "returnType": "wpilib._wpilib.AnalogAccelerometer", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogAccelerometer"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create a new instance of Accelerometer from an existing AnalogInput.\n\nMake a new instance of accelerometer given an AnalogInput. This is\nparticularly useful if the port is going to be read as an analog channel as\nwell as through the Accelerometer class.\n\n:param channel: The existing AnalogInput object for the analog input the\n                accelerometer is connected to", "returnType": "wpilib._wpilib.AnalogAccelerometer", "args": [{"name": "channel", "type": "wpilib._wpilib.AnalogInput"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogAccelerometer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Return the acceleration in Gs.\n\nThe acceleration is returned units of Gs.\n\n:returns: The current acceleration of the sensor in Gs.", "returnType": "float", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogAccelerometer", "FUNC": "getAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogAccelerometer", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the accelerometer sensitivity.\n\nThis sets the sensitivity of the accelerometer used for calculating the\nacceleration. The sensitivity varies by accelerometer model. There are\nconstants defined for various models.\n\n:param sensitivity: The sensitivity of accelerometer in Volts per G.", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "sensitivity", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogAccelerometer", "FUNC": "setSensitivity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the voltage that corresponds to 0 G.\n\nThe zero G voltage varies by accelerometer model. There are constants\ndefined for various models.\n\n:param zero: The zero G voltage.", "returnType": "None", "args": [{"name": "analogAccelerometer", "type": "wpilib._wpilib.AnalogAccelerometer"}, {"name": "zero", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogAccelerometer", "FUNC": "setZero"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogAccelerometer"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
