// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "float", ["kEightInch", "kSixInch", "kTenInch"], []);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "KitbotWheelSize",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kEightInch"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kSixInch"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize", "VAR": "kTenInch"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotWheelSize"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.KitbotWheelSize", "args": [], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
