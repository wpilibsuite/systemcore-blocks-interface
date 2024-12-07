// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.MechanismRoot2d

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "MechanismRoot2d",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Append a ligament node", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismRoot2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "str", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismRoot2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the root's position.\n\n:param x: new x coordinate\n:param y: new y coordinate", "returnType": "None", "args": [{"name": "mechanismRoot2d", "type": "wpilib._wpilib.MechanismRoot2d"}, {"name": "x", "type": "float"}, {"name": "y", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismRoot2d", "FUNC": "setPosition"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismRoot2d"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
