// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.counter.ExternalDirectionCounter

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "ExternalDirectionCounter",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a new ExternalDirectionCounter.\n\n:param countSource:     The source for counting.\n:param directionSource: The source for selecting count direction.", "returnType": "wpilib.counter._counter.ExternalDirectionCounter", "args": [{"name": "countSource", "type": "wpilib._wpilib.DigitalSource"}, {"name": "directionSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": "wpilib.counter"}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a new ExternalDirectionCounter.\n\n:param countSource:     The source for counting.\n:param directionSource: The source for selecting count direction.", "returnType": "wpilib.counter._counter.ExternalDirectionCounter", "args": [{"name": "countSource", "type": "wpilib._wpilib.DigitalSource"}, {"name": "directionSource", "type": "wpilib._wpilib.DigitalSource"}], "importModule": "wpilib.counter"}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Gets the current count.\n\n:returns: The current count.", "returnType": "int", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter._counter.ExternalDirectionCounter"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "getCount"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the current count.", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter._counter.ExternalDirectionCounter"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the edge configuration for counting.\n\n:param configuration: The counting edge configuration.", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter._counter.ExternalDirectionCounter"}, {"name": "configuration", "type": "wpilib.counter._counter.EdgeConfiguration"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "setEdgeConfiguration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEdgeConfiguration"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets to reverse the counter direction.\n\n:param reverseDirection: True to reverse counting direction.", "returnType": "None", "args": [{"name": "externalDirectionCounter", "type": "wpilib.counter._counter.ExternalDirectionCounter"}, {"name": "reverseDirection", "type": "bool"}], "importModule": ""}, "fields": {"CLASS": "wpilib.counter.ExternalDirectionCounter", "FUNC": "setReverseDirection"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myExternalDirectionCounter"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
