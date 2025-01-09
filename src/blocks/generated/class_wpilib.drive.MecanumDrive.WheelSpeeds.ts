// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";
import * as pythonVariable from "../python_variable";

// Blocks for class wpilib.drive.MecanumDrive.WheelSpeeds

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.drive.MecanumDrive.WheelSpeeds", "float", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Front-left wheel speed.", "Front-right wheel speed.", "Rear-left wheel speed.", "Rear-right wheel speed."]);
  pythonVariable.initializeInstanceVariableSetter("wpilib.drive.MecanumDrive.WheelSpeeds", "float", ["frontLeft", "frontRight", "rearLeft", "rearRight"], ["Front-left wheel speed.", "Front-right wheel speed.", "Rear-left wheel speed.", "Rear-right wheel speed."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "WheelSpeeds",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "frontRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearLeft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "float", "key": "instance wpilib.drive.MecanumDrive.WheelSpeeds float", "importModule": "", "selfLabel": "wheelSpeeds", "selfType": "wpilib.drive.MecanumDrive.WheelSpeeds"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds", "VAR": "rearRight"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myWheelSpeeds"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWheelSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.drive._drive.MecanumDrive.WheelSpeeds", "args": [], "importModule": "wpilib.drive"}, "fields": {"CLASS": "wpilib.drive.MecanumDrive.WheelSpeeds"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
