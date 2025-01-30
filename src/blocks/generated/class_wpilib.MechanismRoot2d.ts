// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.MechanismRoot2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "Append a ligament node", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismRoot2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismRoot2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}, {"name": "x", "type": "float"}, {"name": "y", "type": "float"}], "tooltip": "Set the root's position.\n\n:param x: new x coordinate\n:param y: new y coordinate", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismRoot2d", "FUNC": "setPosition"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MechanismRoot2d",
    contents: contents,
    className: "wpilib.MechanismRoot2d",
  };

  return category;
}
