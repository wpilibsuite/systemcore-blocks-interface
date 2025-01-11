// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module wpimath.path

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "path",
    contents: [
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
