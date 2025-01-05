// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for module wpilib.counter

export function initialize() {
  python.initializeEnum("wpilib.counter.EdgeConfiguration", ["kBoth", "kFallingEdge", "kNone", "kRisingEdge"], "Edge configuration.\n\nMembers:\n\n  kNone : No edge configuration (neither rising nor falling).\n\n  kRisingEdge : Rising edge configuration.\n\n  kFallingEdge : Falling edge configuration.\n\n  kBoth : Both rising and falling edges configuration.");
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "counter",
    contents: [
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kBoth"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kFallingEdge"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kNone"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kRisingEdge"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
