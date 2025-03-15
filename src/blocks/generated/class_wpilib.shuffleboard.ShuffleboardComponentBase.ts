// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.ShuffleboardComponentBase

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard.ShuffleboardValue"}, {"name": "parentTable", "type": "ntcore.NetworkTable"}, {"name": "metaTable", "type": "ntcore.NetworkTable"}], "tooltip": "Builds the entries for this value.\n\n:param parentTable: The table containing all the data for the parent. Values\n                    that require a complex entry or table structure should\n                    call ``parentTable.getSubtable(getTitle())`` to get\n                    the table to put data into. Values that only use a\n                    single entry should call\n                    ``parentTable.getEntry(getTitle())`` to get that\n                    entry.\n:param metaTable:   The table containing all the metadata for this value and\n                    its sub-values", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "buildInto"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTable"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTable"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "shuffleboardComponentBase", "type": "wpilib.shuffleboard.ShuffleboardComponentBase"}, {"name": "metaTable", "type": "ntcore.NetworkTable"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardComponentBase", "FUNC": "buildMetadata"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardComponentBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTable"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard.ShuffleboardValue"}], "tooltip": "Disables user control of this widget in the Shuffleboard application.\n\nThis method is package-private to prevent users from enabling control\nthemselves. Has no effect if the sendable is not marked as an actuator with\nSendableBuilder::SetActuator().", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "disableIfActuator"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard.ShuffleboardValue"}], "tooltip": "Enables user control of this widget in the Shuffleboard application.\n\nThis method is package-private to prevent users from enabling control\nthemselves. Has no effect if the sendable is not marked as an actuator with\nSendableBuilder::SetActuator().", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "enableIfActuator"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myShuffleboardContainer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.shuffleboard.ShuffleboardContainer", "args": [{"name": "shuffleboardComponentBase", "type": "wpilib.shuffleboard.ShuffleboardComponentBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardComponentBase", "FUNC": "getParent"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardComponentBase"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard.ShuffleboardValue"}], "tooltip": "Gets the title of this Shuffleboard value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "getTitle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "shuffleboardComponentBase", "type": "wpilib.shuffleboard.ShuffleboardComponentBase"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardComponentBase", "FUNC": "getType"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardComponentBase"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "shuffleboardComponentBase", "type": "wpilib.shuffleboard.ShuffleboardComponentBase"}, {"name": "type", "type": "str"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.shuffleboard.ShuffleboardComponentBase", "FUNC": "setType"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardComponentBase"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ShuffleboardComponentBase",
    contents: contents,
    className: "wpilib.shuffleboard.ShuffleboardComponentBase",
  };

  return category;
}
