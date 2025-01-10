// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.MechanismObject2d

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MechanismObject2d",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Append a ligament node", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismObject2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Retrieve the object's name.\n\n:returns: the object's name relative to its parent.", "returnType": "str", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismObject2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
