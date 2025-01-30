// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module hal.exceptions

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 0 blocks.
  const contents: toolboxItems.ContentsType[] = [
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    name:  "exceptions",
    contents: contents,
    moduleName: "hal.exceptions",
    packageName: "hal",
  };

  return category;
}
