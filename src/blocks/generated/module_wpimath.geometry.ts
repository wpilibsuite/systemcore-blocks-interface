// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module wpimath.geometry

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "geometry",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myfloat64[3, 3]]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Applies the hat operator to a rotation vector.\n\nIt takes a rotation vector and returns the corresponding matrix\nrepresentation of the Lie algebra element (a 3x3 rotation matrix).\n\n:param rotation: The rotation vector.\n\n:returns: The rotation vector as a 3x3 rotation matrix.", "returnType": "numpy.ndarray[numpy.float64[3, 3]]", "args": [{"name": "rotation", "type": "numpy.ndarray[numpy.float64[3, 1]]"}], "importModule": "wpimath.geometry"}, "fields": {"MODULE": "wpimath.geometry", "FUNC": "rotationVectorToMatrix"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myfloat64[3, 1]]"}}}}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
