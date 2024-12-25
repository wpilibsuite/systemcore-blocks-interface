// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for module wpimath.units

python.PythonVariableGetterNames["module wpimath.units float"] = ["kInchesPerFoot", "kKilogramsPerLb", "kMetersPerInch"];
python.PythonVariableGetterNames["module wpimath.units int"] = ["kMillisecondsPerSecond", "kSecondsPerMinute"];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "units",
    contents: [
      {"kind": "block", "type": "get_python_module_variable", "extraState": {"varType": "float", "key": "module wpimath.units float", "importModule": "wpimath.units"}, "fields": {"MODULE": "wpimath.units", "VAR": "kInchesPerFoot"}},
      {"kind": "block", "type": "get_python_module_variable", "extraState": {"varType": "float", "key": "module wpimath.units float", "importModule": "wpimath.units"}, "fields": {"MODULE": "wpimath.units", "VAR": "kKilogramsPerLb"}},
      {"kind": "block", "type": "get_python_module_variable", "extraState": {"varType": "float", "key": "module wpimath.units float", "importModule": "wpimath.units"}, "fields": {"MODULE": "wpimath.units", "VAR": "kMetersPerInch"}},
      {"kind": "block", "type": "get_python_module_variable", "extraState": {"varType": "int", "key": "module wpimath.units int", "importModule": "wpimath.units"}, "fields": {"MODULE": "wpimath.units", "VAR": "kMillisecondsPerSecond"}},
      {"kind": "block", "type": "get_python_module_variable", "extraState": {"varType": "int", "key": "module wpimath.units int", "importModule": "wpimath.units"}, "fields": {"MODULE": "wpimath.units", "VAR": "kSecondsPerMinute"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
