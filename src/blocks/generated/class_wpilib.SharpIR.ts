// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.SharpIR

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SharpIR",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIR"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Manually construct a SharpIR object. The distance is computed using this\nformula: A*v ^ B. Prefer to use one of the static factories to create this\ndevice instead.\n\n:param channel: Analog input channel the sensor is connected to\n:param a:       Constant A\n:param b:       Constant B\n:param minCM:   Minimum distance to report in centimeters\n:param maxCM:   Maximum distance to report in centimeters", "returnType": "wpilib._wpilib.SharpIR", "args": [{"name": "channel", "type": "int"}, {"name": "a", "type": "float"}, {"name": "b", "type": "float"}, {"name": "minCM", "type": "float"}, {"name": "maxCM", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SharpIR"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIR"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sharp GP2Y0A02YK0F is an analog IR sensor capable of measuring\ndistances from 20cm to 150cm.\n\n:param channel: Analog input channel the sensor is connected to\n\n:returns: sensor object", "returnType": "wpilib._wpilib.SharpIR", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "GP2Y0A02YK0F"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIR"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sharp GP2Y0A21YK0F is an analog IR sensor capable of measuring\ndistances from 10cm to 80cm.\n\n:param channel: Analog input channel the sensor is connected to\n\n:returns: sensor object", "returnType": "wpilib._wpilib.SharpIR", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "GP2Y0A21YK0F"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIR"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sharp GP2Y0A41SK0F is an analog IR sensor capable of measuring\ndistances from 4cm to 30cm.\n\n:param channel: Analog input channel the sensor is connected to\n\n:returns: sensor object", "returnType": "wpilib._wpilib.SharpIR", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "GP2Y0A41SK0F"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySharpIR"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sharp GP2Y0A51SK0F is an analog IR sensor capable of measuring\ndistances from 2cm to 15cm.\n\n:param channel: Analog input channel the sensor is connected to\n\n:returns: sensor object", "returnType": "wpilib._wpilib.SharpIR", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "GP2Y0A51SK0F"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the analog input channel number.\n\n:returns: analog input channel", "returnType": "int", "args": [{"name": "sharpIR", "type": "wpilib._wpilib.SharpIR"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIR"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the range from the distance sensor.\n\n:returns: range of the target returned by the sensor", "returnType": "wpimath.units.centimeters", "args": [{"name": "sharpIR", "type": "wpilib._wpilib.SharpIR"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "getRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIR"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "sharpIR", "type": "wpilib._wpilib.SharpIR"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SharpIR", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySharpIR"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
