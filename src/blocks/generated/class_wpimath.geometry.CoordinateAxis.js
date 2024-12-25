// This file was generated. Do not edit!

// Blocks for class wpimath.geometry.CoordinateAxis

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "CoordinateAxis",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a coordinate system axis within the NWU coordinate system and\nnormalizes it.\n\n:param x: The x component.\n:param y: The y component.\n:param z: The z component.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [{"name": "x", "type": "float"}, {"name": "y", "type": "float"}, {"name": "z", "type": "float"}], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to -Z in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "D"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to -Y in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "E"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to +X in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "N"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to -X in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "S"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to +Z in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "U"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCoordinateAxis"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Returns a coordinate axis corresponding to +Y in the NWU coordinate system.", "returnType": "wpimath.geometry._geometry.CoordinateAxis", "args": [], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.CoordinateAxis", "FUNC": "W"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
