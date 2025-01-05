// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.counter.UpDownCounter

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "UpDownCounter",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUpDownCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a new UpDown Counter.\n\n:param upSource:   The up count source (can be null).\n:param downSource: The down count source (can be null).", "returnType": "wpilib.counter._counter.UpDownCounter", "args": [{"name": "upSource", "type": "wpilib._wpilib.DigitalSource"}, {"name": "downSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": "wpilib.counter"}, "fields": {"CLASS": "wpilib.counter.UpDownCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myUpDownCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a new UpDown Counter.\n\n:param upSource:   The up count source (can be null).\n:param downSource: The down count source (can be null).", "returnType": "wpilib.counter._counter.UpDownCounter", "args": [{"name": "upSource", "type": "wpilib._wpilib.DigitalSource"}, {"name": "downSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": "wpilib.counter"}, "fields": {"CLASS": "wpilib.counter.UpDownCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the current count.\n\n:returns: The current count.", "returnType": "int", "args": [{"name": "upDownCounter", "type": "wpilib.counter._counter.UpDownCounter"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.UpDownCounter", "FUNC": "getCount"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the current count.", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter._counter.UpDownCounter"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.UpDownCounter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the configuration for the down source.\n\n:param configuration: The down source configuration.", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter._counter.UpDownCounter"}, {"name": "configuration", "type": "wpilib.counter._counter.EdgeConfiguration"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setDownEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets to revert the counter direction.\n\n:param reverseDirection: True to reverse counting direction.", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter._counter.UpDownCounter"}, {"name": "reverseDirection", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setReverseDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the configuration for the up source.\n\n:param configuration: The up source configuration.", "returnType": "None", "args": [{"name": "upDownCounter", "type": "wpilib.counter._counter.UpDownCounter"}, {"name": "configuration", "type": "wpilib.counter._counter.EdgeConfiguration"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.UpDownCounter", "FUNC": "setUpEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myUpDownCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
