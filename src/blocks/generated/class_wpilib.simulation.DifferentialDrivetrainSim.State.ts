// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.State

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.State", "int", ["kHeading", "kLeftPosition", "kLeftVelocity", "kRightPosition", "kRightVelocity", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kHeading"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftPosition"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftVelocity"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightPosition"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightVelocity"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kX"}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.State", "args": [], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
