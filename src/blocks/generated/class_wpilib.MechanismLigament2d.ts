// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.MechanismLigament2d

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMechanismLigament2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.MechanismLigament2d", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}, {"name": "name", "type": "str"}, {"name": "length", "type": "float"}, {"name": "angle", "type": "wpimath.units.degrees"}, {"name": "lineWidth", "type": "float"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "Append a ligament node", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismObject2d", "FUNC": "appendLigament"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}, "ARG5": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "tooltip": "Get the ligament's angle relative to its parent.\n\n:returns: the angle", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "getAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "tooltip": "Get the ligament color.\n\n:returns: the color of the line", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "getColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "tooltip": "Get the ligament length.\n\n:returns: the line length", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "getLength"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}], "tooltip": "Get the line thickness.\n\n:returns: the line thickness", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "getLineWeight"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "mechanismObject2d", "type": "wpilib._wpilib.MechanismObject2d"}], "tooltip": "Retrieve the object's name.\n\n:returns: the object's name relative to its parent.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismObject2d", "FUNC": "getName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismObject2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "angle", "type": "wpimath.units.degrees"}], "tooltip": "Set the ligament's angle relative to its parent.\n\n:param angle: the angle", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "setAngle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "color", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "Set the ligament color.\n\n:param color: the color of the line", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "setColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "length", "type": "float"}], "tooltip": "Set the ligament's length.\n\n:param length: the line length", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "setLength"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "mechanismLigament2d", "type": "wpilib._wpilib.MechanismLigament2d"}, {"name": "lineWidth", "type": "float"}], "tooltip": "Set the line thickness.\n\n:param lineWidth: the line thickness", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.MechanismLigament2d", "FUNC": "setLineWeight"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMechanismLigament2d"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MechanismLigament2d",
    contents: contents,
    className: "wpilib.MechanismLigament2d",
  };

  return category;
}
