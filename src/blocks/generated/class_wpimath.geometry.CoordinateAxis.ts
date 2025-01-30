// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.geometry.CoordinateAxis

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 7 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [{"name": "x", "type": "float"}, {"name": "y", "type": "float"}, {"name": "z", "type": "float"}], "tooltip": "Constructs a coordinate system axis within the NWU coordinate system and\nnormalizes it.\n\n:param x: The x component.\n:param y: The y component.\n:param z: The z component.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to -Z in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "D"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to -Y in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "E"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to +X in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "N"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to -X in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "S"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to +Z in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "U"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "tooltip": "Returns a coordinate axis corresponding to +Y in the NWU coordinate system.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "W"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "CoordinateAxis",
    contents: contents,
    className: "wpimath.geometry.CoordinateAxis",
  };

  return category;
}
