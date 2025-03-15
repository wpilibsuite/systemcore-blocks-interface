// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "wpimath.system.plant.DCMotor", ["DualCIMPerSide", "DualFalcon500PerSide", "DualMiniCIMPerSide", "DualNEOPerSide", "SingleCIMPerSide", "SingleFalcon500PerSide", "SingleMiniCIMPerSide", "SingleNEOPerSide"], []);
  setPythonVariable.initializeClassVariableSetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "wpimath.system.plant.DCMotor", ["DualCIMPerSide", "DualFalcon500PerSide", "DualMiniCIMPerSide", "DualNEOPerSide", "SingleCIMPerSide", "SingleFalcon500PerSide", "SingleMiniCIMPerSide", "SingleNEOPerSide"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 17 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualCIMPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualCIMPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualFalcon500PerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualFalcon500PerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualMiniCIMPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualMiniCIMPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualNEOPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "DualNEOPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleCIMPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleCIMPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleFalcon500PerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleFalcon500PerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleMiniCIMPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleMiniCIMPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleNEOPerSide"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "varType": "wpimath.system.plant.DCMotor", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "VAR": "SingleNEOPerSide"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDCMotor"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotMotor"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor"}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "KitbotMotor",
    contents: contents,
    className: "wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor",
  };

  return category;
}
