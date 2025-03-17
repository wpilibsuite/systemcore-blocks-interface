// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.SendableChooserBase

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 1 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SendableChooserBase",
    contents: contents,
    className: "wpilib.SendableChooserBase",
  };

  return category;
}
