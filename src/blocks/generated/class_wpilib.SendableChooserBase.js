// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.SendableChooserBase

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SendableChooserBase",
    contents: [
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
