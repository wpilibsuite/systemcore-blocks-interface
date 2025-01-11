// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module hal.exceptions

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "exceptions",
    contents: [
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
