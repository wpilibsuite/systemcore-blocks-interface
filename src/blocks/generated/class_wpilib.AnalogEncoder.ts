// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.AnalogEncoder

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "AnalogEncoder",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct a new AnalogEncoder attached to a specific AnalogIn channel.\n\nThis has a fullRange of 1 and an expectedZero of 0.\n\n:param channel: the analog input channel to attach to", "returnType": "wpilib._wpilib.AnalogEncoder", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogEncoder"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct a new AnalogEncoder attached to a specific AnalogInput.\n\nThis has a fullRange of 1 and an expectedZero of 0.\n\n:param analogInput: the analog input to attach to", "returnType": "wpilib._wpilib.AnalogEncoder", "args": [{"name": "analogInput", "type": "wpilib._wpilib.AnalogInput"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogEncoder"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct a new AnalogEncoder attached to a specific AnalogIn channel.\n\n:param channel:      the analog input channel to attach to\n:param fullRange:    the value to report at maximum travel\n:param expectedZero: the reading where you would expect a 0 from get()", "returnType": "wpilib._wpilib.AnalogEncoder", "args": [{"name": "channel", "type": "int"}, {"name": "fullRange", "type": "float"}, {"name": "expectedZero", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogEncoder"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Construct a new AnalogEncoder attached to a specific AnalogInput.\n\n:param analogInput:  the analog input to attach to\n:param fullRange:    the value to report at maximum travel\n:param expectedZero: the reading where you would expect a 0 from get()", "returnType": "wpilib._wpilib.AnalogEncoder", "args": [{"name": "analogInput", "type": "wpilib._wpilib.AnalogInput"}, {"name": "fullRange", "type": "float"}, {"name": "expectedZero", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AnalogEncoder"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the encoder value.\n\n:returns: the encoder value scaled by the full range input", "returnType": "float", "args": [{"name": "analogEncoder", "type": "wpilib._wpilib.AnalogEncoder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogEncoder", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the channel number.\n\n:returns: The channel number.", "returnType": "int", "args": [{"name": "analogEncoder", "type": "wpilib._wpilib.AnalogEncoder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogEncoder", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib._wpilib.AnalogEncoder"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogEncoder", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set if this encoder is inverted.\n\n:param inverted: true to invert the encoder, false otherwise", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib._wpilib.AnalogEncoder"}, {"name": "inverted", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogEncoder", "FUNC": "setInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the encoder voltage percentage range. Analog sensors are not always\nfully stable at the end of their travel ranges. Shrinking this range down\ncan help mitigate issues with that.\n\n:param min: minimum voltage percentage (0-1 range)\n:param max: maximum voltage percentage (0-1 range)", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib._wpilib.AnalogEncoder"}, {"name": "min", "type": "float"}, {"name": "max", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AnalogEncoder", "FUNC": "setVoltagePercentageRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
