// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.simulation.DifferentialDrivetrainSim.State

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.simulation.DifferentialDrivetrainSim.State", "int", ["kHeading", "kLeftPosition", "kLeftVelocity", "kRightPosition", "kRightVelocity", "kX", "kY"], []);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kHeading"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftPosition"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kLeftVelocity"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightPosition"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kRightVelocity"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kX"}},
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.simulation.DifferentialDrivetrainSim.State int", "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State", "VAR": "kY"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.simulation._simulation.DifferentialDrivetrainSim.State", "args": [], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.DifferentialDrivetrainSim.State"}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
