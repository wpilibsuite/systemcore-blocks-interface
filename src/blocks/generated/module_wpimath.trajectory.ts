// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpimath.trajectory

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    moduleName: "wpimath.trajectory",
    name:  "trajectory",
      contents: contents,
  };
  return category;
}
