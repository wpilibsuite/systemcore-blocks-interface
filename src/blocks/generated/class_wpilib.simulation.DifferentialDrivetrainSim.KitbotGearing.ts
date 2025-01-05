// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing

export function initialize() {
  python.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "float", ["k10p71", "k12p75", "k5p95", "k7p31", "k8p45"], []);
  python.initializeClassVariableSetter("wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "float", ["k10p71", "k12p75", "k5p95", "k7p31", "k8p45"], []);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "KitbotGearing",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k10p71"}},
      {"kind": "block", "type": "set_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k10p71"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k12p75"}},
      {"kind": "block", "type": "set_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k12p75"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k5p95"}},
      {"kind": "block", "type": "set_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k5p95"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k7p31"}},
      {"kind": "block", "type": "set_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k7p31"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k8p45"}},
      {"kind": "block", "type": "set_python_class_variable", "extraState": {"varType": "float", "key": "class wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing float", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing", "VAR": "k8p45"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myKitbotGearing"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.KitbotGearing", "args": [], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
