// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for module wpimath.units

export function initialize() {
  getPythonVariable.initializeModuleVariableGetter("wpimath.units", "float", ["kInchesPerFoot", "kKilogramsPerLb", "kMetersPerInch"], []);
  getPythonVariable.initializeModuleVariableGetter("wpimath.units", "int", ["kMillisecondsPerSecond", "kSecondsPerMinute"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "units",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "module", "moduleOrClassName": "wpimath.units", "varType": "float", "importModule": "wpimath.units"}, "fields": {"MODULE_OR_CLASS": "wpimath.units", "VAR": "kInchesPerFoot"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "module", "moduleOrClassName": "wpimath.units", "varType": "float", "importModule": "wpimath.units"}, "fields": {"MODULE_OR_CLASS": "wpimath.units", "VAR": "kKilogramsPerLb"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "module", "moduleOrClassName": "wpimath.units", "varType": "float", "importModule": "wpimath.units"}, "fields": {"MODULE_OR_CLASS": "wpimath.units", "VAR": "kMetersPerInch"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "module", "moduleOrClassName": "wpimath.units", "varType": "int", "importModule": "wpimath.units"}, "fields": {"MODULE_OR_CLASS": "wpimath.units", "VAR": "kMillisecondsPerSecond"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "module", "moduleOrClassName": "wpimath.units", "varType": "int", "importModule": "wpimath.units"}, "fields": {"MODULE_OR_CLASS": "wpimath.units", "VAR": "kSecondsPerMinute"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
