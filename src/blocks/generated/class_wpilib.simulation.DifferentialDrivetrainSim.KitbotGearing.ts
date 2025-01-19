// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing

export function initialize() {
  getPythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "float", ["k10p71", "k12p75", "k5p95", "k7p31", "k8p45"], []);
  setPythonVariable.initializeClassVariableSetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "float", ["k10p71", "k12p75", "k5p95", "k7p31", "k8p45"], []);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k10p71"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k10p71"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k12p75"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k12p75"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k5p95"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k5p95"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k7p31"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k7p31"}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k8p45"}},
    {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "class", "moduleOrClassName": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "varType": "float", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k8p45"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotGearing"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.KitbotGearing", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing"}}}}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    className: "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing",
    name:  "KitbotGearing",
      contents: contents,
  };
  return category;
}
