// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpimath.geometry

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 1 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "numpy.ndarray[numpy.float64[3, 3]]", "args": [{"name": "rotation", "type": "numpy.ndarray[numpy.float64[3, 1]]"}], "tooltip": "Applies the hat operator to a rotation vector.\n\nIt takes a rotation vector and returns the corresponding matrix\nrepresentation of the Lie algebra element (a 3x3 rotation matrix).\n\n:param rotation: The rotation vector.\n\n:returns: The rotation vector as a 3x3 rotation matrix.", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry", "FUNC": "rotationVectorToMatrix"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    name:  "geometry",
    contents: contents,
    moduleName: "wpimath.geometry",
    packageName: "wpimath.geometry",
  };

  return category;
}
