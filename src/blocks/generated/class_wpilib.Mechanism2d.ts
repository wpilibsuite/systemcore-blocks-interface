// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Mechanism2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanism2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.Mechanism2d", "args": [{"name": "width", "type": "float"}, {"name": "height", "type": "float"}, {"name": "backgroundColor", "type": "wpilib.Color8Bit"}], "tooltip": "Create a new Mechanism2d with the given dimensions and background color.\n\nThe dimensions represent the canvas that all the nodes are drawn on. The\ndefault color is dark blue.\n\n:param width:           the width\n:param height:          the height\n:param backgroundColor: the background color", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Mechanism2d"}, "inputs": {"ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismRoot2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.MechanismRoot2d", "args": [{"name": "mechanism2d", "type": "wpilib.Mechanism2d"}, {"name": "name", "type": "str"}, {"name": "x", "type": "float"}, {"name": "y", "type": "float"}], "tooltip": "Get or create a root in this Mechanism2d with the given name and\nposition.\n\nIf a root with the given name already exists, the given x and y\ncoordinates are not used.\n\n:param name: the root name\n:param x:    the root x coordinate\n:param y:    the root y coordinate\n\n:returns: a new root object, or the existing one with the given name.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Mechanism2d", "FUNC": "getRoot"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanism2d"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanism2d", "type": "wpilib.Mechanism2d"}, {"name": "builder", "type": "ntcore.NTSendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Mechanism2d", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanism2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNTSendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanism2d", "type": "wpilib.Mechanism2d"}, {"name": "color", "type": "wpilib.Color8Bit"}], "tooltip": "Set the Mechanism2d background color.\n\n:param color: the new background color", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Mechanism2d", "FUNC": "setBackgroundColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanism2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Mechanism2d",
    contents: contents,
    className: "wpilib.Mechanism2d",
  };

  return category;
}
