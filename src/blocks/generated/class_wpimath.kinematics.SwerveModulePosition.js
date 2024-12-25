// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class wpimath.kinematics.SwerveModulePosition

python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d"] = ["angle"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d"] = ["Angle of the module."];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d"] = ["angle"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d"] = ["Angle of the module."];
python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters"] = ["distance"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters"] = ["Distance the wheel of a module has traveled"];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters"] = ["distance"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters"] = ["Distance the wheel of a module has traveled"];
python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet"] = ["distance_ft"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet"] = [""];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet"] = ["distance_ft"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SwerveModulePosition",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Rotation2d", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "angle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Rotation2d", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "angle"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.units.meters", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance_ft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.kinematics.SwerveModulePosition wpimath.units.feet", "importModule": "", "selfLabel": "swerveModulePosition", "selfType": "wpimath.kinematics.SwerveModulePosition"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "VAR": "distance_ft"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModulePosition"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveModulePosition", "args": [{"name": "distance", "type": "wpimath.units.meters"}, {"name": "angle", "type": "wpimath.geometry._geometry.Rotation2d"}], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModulePosition"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveModulePosition", "args": [{"name": "swerveModulePosition", "type": "wpimath.kinematics._kinematics.SwerveModulePosition"}, {"name": "endValue", "type": "wpimath.kinematics._kinematics.SwerveModulePosition"}, {"name": "t", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.SwerveModulePosition", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModulePosition"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
