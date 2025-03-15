// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.counter.ExternalDirectionCounter

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.counter.ExternalDirectionCounter", "args": [{"name": "countSource", "type": "wpilib.DigitalSource"}, {"name": "directionSource", "type": "wpilib.DigitalSource"}], "tooltip": "Constructs a new ExternalDirectionCounter.\n\n:param countSource:     The source for counting.\n:param directionSource: The source for selecting count direction.", "importModule": "wpilib.counter"}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.counter.ExternalDirectionCounter", "args": [{"name": "countSource", "type": "wpilib.DigitalSource"}, {"name": "directionSource", "type": "wpilib.DigitalSource"}], "tooltip": "Constructs a new ExternalDirectionCounter.\n\n:param countSource:     The source for counting.\n:param directionSource: The source for selecting count direction.", "importModule": "wpilib.counter"}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter.ExternalDirectionCounter"}], "tooltip": "Gets the current count.\n\n:returns: The current count.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "getCount"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter.ExternalDirectionCounter"}], "tooltip": "Resets the current count.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter.ExternalDirectionCounter"}, {"name": "configuration", "type": "wpilib.counter.EdgeConfiguration"}], "tooltip": "Sets the edge configuration for counting.\n\n:param configuration: The counting edge configuration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "setEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter.ExternalDirectionCounter"}, {"name": "reverseDirection", "type": "bool"}], "tooltip": "Sets to reverse the counter direction.\n\n:param reverseDirection: True to reverse counting direction.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "setReverseDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ExternalDirectionCounter",
    contents: contents,
    className: "wpilib.counter.ExternalDirectionCounter",
  };

  return category;
}
