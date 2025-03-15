// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.AnalogEncoder

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 9 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.AnalogEncoder", "args": [{"name": "channel", "type": "int"}], "tooltip": "Construct a new AnalogEncoder attached to a specific AnalogIn channel.\n\nThis has a fullRange of 1 and an expectedZero of 0.\n\n:param channel: the analog input channel to attach to", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.AnalogEncoder", "args": [{"name": "analogInput", "type": "wpilib.AnalogInput"}], "tooltip": "Construct a new AnalogEncoder attached to a specific AnalogInput.\n\nThis has a fullRange of 1 and an expectedZero of 0.\n\n:param analogInput: the analog input to attach to", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.AnalogEncoder", "args": [{"name": "channel", "type": "int"}, {"name": "fullRange", "type": "float"}, {"name": "expectedZero", "type": "float"}], "tooltip": "Construct a new AnalogEncoder attached to a specific AnalogIn channel.\n\n:param channel:      the analog input channel to attach to\n:param fullRange:    the value to report at maximum travel\n:param expectedZero: the reading where you would expect a 0 from get()", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoder"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.AnalogEncoder", "args": [{"name": "analogInput", "type": "wpilib.AnalogInput"}, {"name": "fullRange", "type": "float"}, {"name": "expectedZero", "type": "float"}], "tooltip": "Construct a new AnalogEncoder attached to a specific AnalogInput.\n\n:param analogInput:  the analog input to attach to\n:param fullRange:    the value to report at maximum travel\n:param expectedZero: the reading where you would expect a 0 from get()", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogInput"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "analogEncoder", "type": "wpilib.AnalogEncoder"}], "tooltip": "Get the encoder value.\n\n:returns: the encoder value scaled by the full range input", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "analogEncoder", "type": "wpilib.AnalogEncoder"}], "tooltip": "Get the channel number.\n\n:returns: The channel number.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder", "FUNC": "getChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib.AnalogEncoder"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib.AnalogEncoder"}, {"name": "inverted", "type": "bool"}], "tooltip": "Set if this encoder is inverted.\n\n:param inverted: true to invert the encoder, false otherwise", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder", "FUNC": "setInverted"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "analogEncoder", "type": "wpilib.AnalogEncoder"}, {"name": "min", "type": "float"}, {"name": "max", "type": "float"}], "tooltip": "Set the encoder voltage percentage range. Analog sensors are not always\nfully stable at the end of their travel ranges. Shrinking this range down\ncan help mitigate issues with that.\n\n:param min: minimum voltage percentage (0-1 range)\n:param max: maximum voltage percentage (0-1 range)", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.AnalogEncoder", "FUNC": "setVoltagePercentageRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "AnalogEncoder",
    contents: contents,
    className: "wpilib.AnalogEncoder",
  };

  return category;
}
