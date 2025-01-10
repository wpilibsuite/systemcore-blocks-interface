// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.SendableChooserBase

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "SendableChooserBase",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
