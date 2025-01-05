// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module wpilib.event

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "event",
    contents: [
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
