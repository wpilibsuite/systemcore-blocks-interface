// This file was generated. Do not edit!

import * as python from "../python";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.kinematics.SwerveDrive4WheelPositions

export function initialize() {
  python.initializeInstanceVariableGetter("wpimath.kinematics.SwerveDrive4WheelPositions", "Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", ["positions"], ["The distances driven by the wheels."]);
  python.initializeInstanceVariableSetter("wpimath.kinematics.SwerveDrive4WheelPositions", "Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", ["positions"], ["The distances driven by the wheels."]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SwerveDrive4WheelPositions",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", "key": "instance wpimath.kinematics.SwerveDrive4WheelPositions Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", "importModule": "", "selfLabel": "swerveDrive4WheelPositions", "selfType": "wpimath.kinematics.SwerveDrive4WheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive4WheelPositions", "VAR": "positions"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", "key": "instance wpimath.kinematics.SwerveDrive4WheelPositions Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]", "importModule": "", "selfLabel": "swerveDrive4WheelPositions", "selfType": "wpimath.kinematics.SwerveDrive4WheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive4WheelPositions", "VAR": "positions"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition]"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveDrive4WheelPositions", "args": [{"name": "positions", "type": "Tuple[wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition, wpimath.kinematics._kinematics.SwerveModulePosition]"}], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive4WheelPositions"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition]"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveDrive4WheelPositions", "args": [{"name": "swerveDrive4WheelPositions", "type": "wpimath.kinematics._kinematics.SwerveDrive4WheelPositions"}, {"name": "endValue", "type": "wpimath.kinematics._kinematics.SwerveDrive4WheelPositions"}, {"name": "t", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive4WheelPositions", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive4WheelPositions"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
