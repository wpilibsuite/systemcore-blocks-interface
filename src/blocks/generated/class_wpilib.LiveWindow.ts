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
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [], "tooltip": "Disable ALL telemetry.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "disableAllTelemetry"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "component", "type": "wpiutil._wpiutil.Sendable"}], "tooltip": "Disable telemetry for a single component.\n\n:param component: sendable", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "disableTelemetry"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [], "tooltip": "Enable ALL telemetry.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "enableAllTelemetry"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "component", "type": "wpiutil._wpiutil.Sendable"}], "tooltip": "Enable telemetry for a single component.\n\n:param component: sendable", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "enableTelemetry"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [], "tooltip": "Returns true if LiveWindow is enabled.\n\n:returns: True if LiveWindow is enabled.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "isEnabled"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "func", "type": "Callable[[], None]"}], "tooltip": "Sets function to be called when LiveWindow is disabled.\n\n:param func: function (or nullptr for none)", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "setDisabledCallback"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "enabled", "type": "bool"}], "tooltip": "Change the enabled status of LiveWindow.\n\nIf it changes to enabled, start livewindow running otherwise stop it", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "setEnabled"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "func", "type": "Callable[[], None]"}], "tooltip": "Sets function to be called when LiveWindow is enabled.\n\n:param func: function (or nullptr for none)", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "setEnabledCallback"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [], "tooltip": "Tell all the sensors to update (send) their values.\n\nActuators are handled through callbacks on their value changing from the\nSmartDashboard widgets.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.LiveWindow", "FUNC": "updateValues"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
