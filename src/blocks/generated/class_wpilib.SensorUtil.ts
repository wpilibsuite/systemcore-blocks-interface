// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.SensorUtil

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SensorUtil",
    contents: [
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the analog input number is value.\n\nVerify that the analog input number is one of the legal channel numbers.\nChannel numbers are 0-based.\n\n:returns: Analog channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkAnalogInputChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the analog output number is valid.\n\nVerify that the analog output number is one of the legal channel numbers.\nChannel numbers are 0-based.\n\n:returns: Analog channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkAnalogOutputChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the digital channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: Digital channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkDigitalChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the digital channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: PWM channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkPWMChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Check that the relay channel number is valid.\n\nVerify that the channel number is one of the legal channel numbers. Channel\nnumbers are 0-based.\n\n:returns: Relay channel is valid", "returnType": "bool", "args": [{"name": "channel", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "checkRelayChannel"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the number of the default solenoid module.\n\n:returns: The number of the default solenoid module.", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getDefaultCTREPCMModule"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the number of the default solenoid module.\n\n:returns: The number of the default solenoid module.", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getDefaultREVPHModule"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getNumAnalogInputs"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getNumAnalogOuputs"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getNumDigitalChannels"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getNumPwmChannels"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "int", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SensorUtil", "FUNC": "getNumRelayChannels"}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
