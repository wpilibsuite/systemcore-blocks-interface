// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.State

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.State", "int", ["kHeading", "kLeftPosition", "kLeftVelocity", "kRightPosition", "kRightVelocity", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kHeading"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftPosition"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftVelocity"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightPosition"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightVelocity"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kX"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.State", "varType": "int", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kY"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DifferentialDrivetrainSim.State", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "State",
    contents: contents,
    className: "wpilib.simulation.DifferentialDrivetrainSim.State",
  };

  return category;
}
