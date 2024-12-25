// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.kinematics.DifferentialDriveWheelPositions

python.PythonVariableGetterNames["instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters"] = ["left", "right"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters"] = ["Distance driven by the left side.", "Distance driven by the right side."];
python.PythonVariableSetterNames["instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters"] = ["left", "right"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters"] = ["Distance driven by the left side.", "Distance driven by the right side."];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "DifferentialDriveWheelPositions",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.DifferentialDriveWheelPositions wpimath.units.meters", "importModule": "", "selfLabel": "differentialDriveWheelPositions", "selfType": "wpimath.kinematics.DifferentialDriveWheelPositions"}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions", "args": [], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions", "args": [{"name": "differentialDriveWheelPositions", "type": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions"}, {"name": "endValue", "type": "wpimath.kinematics._kinematics.DifferentialDriveWheelPositions"}, {"name": "t", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.DifferentialDriveWheelPositions", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelPositions"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
