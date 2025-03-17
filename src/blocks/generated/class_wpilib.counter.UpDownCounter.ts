// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.counter.UpDownCounter

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUpDownCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.counter.UpDownCounter", "args": [{"name": "upSource", "type": "wpilib.DigitalSource"}, {"name": "downSource", "type": "wpilib.DigitalSource"}], "tooltip": "Constructs a new UpDown Counter.\n\n:param upSource:   The up count source (can be null).\n:param downSource: The down count source (can be null).", "importModule": "wpilib.counter"}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUpDownCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.counter.UpDownCounter", "args": [{"name": "upSource", "type": "wpilib.DigitalSource"}, {"name": "downSource", "type": "wpilib.DigitalSource"}], "tooltip": "Constructs a new UpDown Counter.\n\n:param upSource:   The up count source (can be null).\n:param downSource: The down count source (can be null).", "importModule": "wpilib.counter"}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "int", "args": [{"name": "upDownCounter", "type": "wpilib.counter.UpDownCounter"}], "tooltip": "Gets the current count.\n\n:returns: The current count.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter", "FUNC": "getCount"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil.SendableBuilder"}], "tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter.UpDownCounter"}], "tooltip": "Resets the current count.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter.UpDownCounter"}, {"name": "configuration", "type": "wpilib.counter.EdgeConfiguration"}], "tooltip": "Sets the configuration for the down source.\n\n:param configuration: The down source configuration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setDownEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter.UpDownCounter"}, {"name": "reverseDirection", "type": "bool"}], "tooltip": "Sets to revert the counter direction.\n\n:param reverseDirection: True to reverse counting direction.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setReverseDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter.UpDownCounter"}, {"name": "configuration", "type": "wpilib.counter.EdgeConfiguration"}], "tooltip": "Sets the configuration for the up source.\n\n:param configuration: The up source configuration.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setUpEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "UpDownCounter",
    contents: contents,
    className: "wpilib.counter.UpDownCounter",
  };

  return category;
}
