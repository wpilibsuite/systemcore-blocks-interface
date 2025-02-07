// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpimath.controller

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 0 blocks.
  const contents: toolboxItems.ContentsType[] = [
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    name:  "controller",
    contents: contents,
    moduleName: "wpimath.controller",
    packageName: "wpimath.controller",
  };

  return category;
}
