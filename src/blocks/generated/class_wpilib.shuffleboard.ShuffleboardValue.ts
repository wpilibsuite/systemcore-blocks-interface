// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.shuffleboard.ShuffleboardValue

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "ShuffleboardValue",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Builds the entries for this value.\n\n:param parentTable: The table containing all the data for the parent. Values\n                    that require a complex entry or table structure should\n                    call ``parentTable.getSubtable(getTitle())`` to get\n                    the table to put data into. Values that only use a\n                    single entry should call\n                    ``parentTable.getEntry(getTitle())`` to get that\n                    entry.\n:param metaTable:   The table containing all the metadata for this value and\n                    its sub-values", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard._shuffleboard.ShuffleboardValue"}, {"name": "parentTable", "type": "ntcore._ntcore.NetworkTable"}, {"name": "metaTable", "type": "ntcore._ntcore.NetworkTable"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "buildInto"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTable"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNetworkTable"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Disables user control of this widget in the Shuffleboard application.\n\nThis method is package-private to prevent users from enabling control\nthemselves. Has no effect if the sendable is not marked as an actuator with\nSendableBuilder::SetActuator().", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard._shuffleboard.ShuffleboardValue"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "disableIfActuator"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Enables user control of this widget in the Shuffleboard application.\n\nThis method is package-private to prevent users from enabling control\nthemselves. Has no effect if the sendable is not marked as an actuator with\nSendableBuilder::SetActuator().", "returnType": "None", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard._shuffleboard.ShuffleboardValue"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "enableIfActuator"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the title of this Shuffleboard value.", "returnType": "str", "args": [{"name": "shuffleboardValue", "type": "wpilib.shuffleboard._shuffleboard.ShuffleboardValue"}], "importModule": ""}, "fields": {"CLASS": "wpilib.shuffleboard.ShuffleboardValue", "FUNC": "getTitle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myShuffleboardValue"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
