// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "float", ["kEightInch", "kSixInch", "kTenInch"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "KitbotWheelSize",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kEightInch"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kSixInch"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kTenInch"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotWheelSize"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.KitbotWheelSize", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
