// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "float", ["kEightInch", "kSixInch", "kTenInch"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kEightInch"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kSixInch"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kTenInch"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotWheelSize"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "KitbotWheelSize",
    contents: contents,
    className: "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize",
  };

  return category;
}
