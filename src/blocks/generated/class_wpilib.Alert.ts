// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Alert

export function initialize() {
  pythonEnum.initializeEnum("wpilib.Alert.AlertType", ["kError", "kInfo", "kWarning"], "Represents an alert's level of urgency.\n\nMembers:\n\n  kError : High priority alert - displayed first on the dashboard with a red \"X\"\nsymbol. Use this type for problems which will seriously affect the\nrobot's functionality and thus require immediate attention.\n\n  kWarning : Medium priority alert - displayed second on the dashboard with a yellow\n\"!\" symbol. Use this type for problems which could affect the robot's\nfunctionality but do not necessarily require immediate attention.\n\n  kInfo : Low priority alert - displayed last on the dashboard with a green \"i\"\nsymbol. Use this type for problems which are unlikely to affect the\nrobot's functionality, or any other alerts which do not fall under the\nother categories.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAlert"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Alert", "args": [{"name": "text", "type": "str"}, {"name": "type", "type": "wpilib.Alert.AlertType"}], "tooltip": "Creates a new alert in the default group - \"Alerts\". If this is the first\nto be instantiated, the appropriate entries will be added to NetworkTables.\n\n:param text: Text to be displayed when the alert is active.\n:param type: Alert urgency level.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlertType"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAlert"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Alert", "args": [{"name": "group", "type": "str"}, {"name": "text", "type": "str"}, {"name": "type", "type": "wpilib.Alert.AlertType"}], "tooltip": "Creates a new alert. If this is the first to be instantiated in its group,\nthe appropriate entries will be added to NetworkTables.\n\n:param group: Group identifier, used as the entry name in NetworkTables.\n:param text:  Text to be displayed when the alert is active.\n:param type:  Alert urgency level.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert"}, "inputs": {"ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlertType"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "alert", "type": "wpilib.Alert"}], "tooltip": "Gets whether the alert is active.\n\n:returns: whether the alert is active.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert", "FUNC": "get"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlert"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "alert", "type": "wpilib.Alert"}], "tooltip": "Gets the current alert text.\n\n:returns: the current text.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert", "FUNC": "getText"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlert"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAlertType"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.Alert.AlertType", "args": [{"name": "alert", "type": "wpilib.Alert"}], "tooltip": "Get the type of this alert.\n\n:returns: the type", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert", "FUNC": "getType"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlert"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "alert", "type": "wpilib.Alert"}, {"name": "active", "type": "bool"}], "tooltip": "Sets whether the alert should currently be displayed. This method can be\nsafely called periodically.\n\n:param active: Whether to display the alert.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert", "FUNC": "set"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlert"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "alert", "type": "wpilib.Alert"}, {"name": "text", "type": "str"}], "tooltip": "Updates current alert text. Use this method to dynamically change the\ndisplayed alert, such as including more details about the detected problem.\n\n:param text: Text to be displayed when the alert is active.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Alert", "FUNC": "setText"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAlert"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.Alert.AlertType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.Alert.AlertType", "ENUM_VALUE": "kError"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.Alert.AlertType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.Alert.AlertType", "ENUM_VALUE": "kInfo"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.Alert.AlertType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.Alert.AlertType", "ENUM_VALUE": "kWarning"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Alert",
    contents: contents,
    className: "wpilib.Alert",
  };

  return category;
}
