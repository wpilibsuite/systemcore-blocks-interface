// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.drive.DifferentialDrive.WheelSpeeds

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
  pythonVariable.initializeInstanceVariableSetter("wpilib.drive.DifferentialDrive.WheelSpeeds", "float", ["left", "right"], ["Left wheel speed.", "Right wheel speed."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "WheelSpeeds",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.DifferentialDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.DifferentialDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.DifferentialDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.DifferentialDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.DifferentialDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.drive._drive.DifferentialDrive.WheelSpeeds", "args": [], "importModule": "wpilib.drive"}, "fields": {"CLASS": "wpilib.drive.DifferentialDrive.WheelSpeeds"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
