// This file was generated. Do not edit!

import * as pythonEnum from "../python_enum";
import {Category} from "../../toolbox/items";

// Blocks for module wpilib.counter

export function initialize() {
  pythonEnum.initializeEnum("wpilib.counter.EdgeConfiguration", ["kBoth", "kFallingEdge", "kNone", "kRisingEdge"], "Edge configuration.\n\nMembers:\n\n  kNone : No edge configuration (neither rising nor falling).\n\n  kRisingEdge : Rising edge configuration.\n\n  kFallingEdge : Falling edge configuration.\n\n  kBoth : Both rising and falling edges configuration.");
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "counter",
    contents: [
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kBoth"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kFallingEdge"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kNone"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kRisingEdge"}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
