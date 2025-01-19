// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpilib.counter

export function initialize() {
  pythonEnum.initializeEnum("wpilib.counter.EdgeConfiguration", ["kBoth", "kFallingEdge", "kNone", "kRisingEdge"], "Edge configuration.\n\nMembers:\n\n  kNone : No edge configuration (neither rising nor falling).\n\n  kRisingEdge : Rising edge configuration.\n\n  kFallingEdge : Falling edge configuration.\n\n  kBoth : Both rising and falling edges configuration.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kBoth"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kFallingEdge"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kNone"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.counter.EdgeConfiguration", "importModule": "wpilib.counter"}, "fields": {"ENUM_TYPE": "wpilib.counter.EdgeConfiguration", "ENUM_VALUE": "kRisingEdge"}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    moduleName: "wpilib.counter",
    name:  "counter",
      contents: contents,
  };
  return category;
}
