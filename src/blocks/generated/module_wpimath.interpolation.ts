// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpimath.interpolation

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 0 blocks.
  const contents: toolboxItems.ContentsType[] = [
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    name:  "interpolation",
    contents: contents,
    moduleName: "wpimath.interpolation",
    packageName: "wpimath.interpolation",
  };

  return category;
}
