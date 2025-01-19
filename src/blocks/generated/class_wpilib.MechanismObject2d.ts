// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.MechanismObject2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "Append a ligament node", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismObject2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}], "tooltip": "Retrieve the object's name.\n\n:returns: the object's name relative to its parent.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismObject2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.MechanismObject2d",
    name:  "MechanismObject2d",
      contents: contents,
  };
  return category;
}
