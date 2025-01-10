// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.LiveWindow

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "LiveWindow",
    contents: [
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Disable ALL telemetry.", "returnType": "None", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "disableAllTelemetry"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Disable telemetry for a single component.\n\n:param component: sendable", "returnType": "None", "args": [{"name": "component", "type": "wpiutil._wpiutil.Sendable"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "disableTelemetry"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Enable ALL telemetry.", "returnType": "None", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "enableAllTelemetry"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Enable telemetry for a single component.\n\n:param component: sendable", "returnType": "None", "args": [{"name": "component", "type": "wpiutil._wpiutil.Sendable"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "enableTelemetry"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns true if LiveWindow is enabled.\n\n:returns: True if LiveWindow is enabled.", "returnType": "bool", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "isEnabled"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sets function to be called when LiveWindow is disabled.\n\n:param func: function (or nullptr for none)", "returnType": "None", "args": [{"name": "func", "type": "Callable[[], None]"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "setDisabledCallback"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Change the enabled status of LiveWindow.\n\nIf it changes to enabled, start livewindow running otherwise stop it", "returnType": "None", "args": [{"name": "enabled", "type": "bool"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "setEnabled"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Sets function to be called when LiveWindow is enabled.\n\n:param func: function (or nullptr for none)", "returnType": "None", "args": [{"name": "func", "type": "Callable[[], None]"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "setEnabledCallback"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Tell all the sensors to update (send) their values.\n\nActuators are handled through callbacks on their value changing from the\nSmartDashboard widgets.", "returnType": "None", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.LiveWindow", "FUNC": "updateValues"}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
