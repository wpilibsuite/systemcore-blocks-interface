// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.MechanismLigament2d

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "MechanismLigament2d",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Append a ligament node", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismObject2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the ligament's angle relative to its parent.\n\n:returns: the angle", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "getAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the ligament color.\n\n:returns: the color of the line", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "getColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the ligament length.\n\n:returns: the line length", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "getLength"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the line thickness.\n\n:returns: the line thickness", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "getLineWeight"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Retrieve the object's name.\n\n:returns: the object's name relative to its parent.", "returnType": "str", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismObject2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the ligament's angle relative to its parent.\n\n:param angle: the angle", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "angle", "type": "wpimath.units.degrees"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "setAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the ligament color.\n\n:param color: the color of the line", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "setColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the ligament's length.\n\n:param length: the line length", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "length", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "setLength"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the line thickness.\n\n:param lineWidth: the line thickness", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "lineWidth", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpilib.MechanismLigament2d", "FUNC": "setLineWeight"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
