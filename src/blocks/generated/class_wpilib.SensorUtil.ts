// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpilib.SensorUtil

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.SensorUtil", "int", ["kAnalogInputs", "kAnalogOutputs", "kDigitalChannels", "kPwmChannels", "kRelayChannels"], []);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SensorUtil",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.SensorUtil int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "VAR": "kAnalogInputs"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.SensorUtil int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "VAR": "kAnalogOutputs"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.SensorUtil int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "VAR": "kDigitalChannels"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.SensorUtil int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "VAR": "kPwmChannels"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.SensorUtil int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "VAR": "kRelayChannels"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the analog input number is value.\n\nVerify that the analog input number is one of the legal channel numbers.\nChannel numbers are 0-based.\n\n:returns: Analog channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkAnalogInputChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the analog output number is valid.\n\nVerify that the analog output number is one of the legal channel numbers.\nChannel numbers are 0-based.\n\n:returns: Analog channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkAnalogOutputChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the digital channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: Digital channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkDigitalChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the digital channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: PWM channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkPWMChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the relay channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: Relay channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkRelayChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the number of the default solenoid module.\n\n:returns: The number of the default solenoid module.", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getDefaultCTREPCMModule"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the number of the default solenoid module.\n\n:returns: The number of the default solenoid module.", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getDefaultREVPHModule"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
