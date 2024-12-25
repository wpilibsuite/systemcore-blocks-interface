// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.kinematics.SwerveModuleState

python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d"] = ["angle"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d"] = ["Angle of the module."];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d"] = ["angle"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d"] = ["Angle of the module."];
python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second"] = ["speed"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second"] = ["Speed of the wheel of the module."];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second"] = ["speed"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second"] = ["Speed of the wheel of the module."];
python.PythonVariableGetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second"] = ["speed_fps"];
python.PythonVariableGetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second"] = [""];
python.PythonVariableSetterNames["instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second"] = ["speed_fps"];
python.PythonVariableSetterTooltips["instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SwerveModuleState",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Rotation2d", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "angle"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Rotation2d", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.geometry._geometry.Rotation2d", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "angle"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.units.meters_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet_per_second", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.feet_per_second", "key": "instance wpimath.kinematics.SwerveModuleState wpimath.units.feet_per_second", "importModule": "", "selfLabel": "swerveModuleState", "selfType": "wpimath.kinematics.SwerveModuleState"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "VAR": "speed_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModuleState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveModuleState", "args": [{"name": "speed", "type": "wpimath.units.meters_per_second"}, {"name": "angle", "type": "wpimath.geometry._geometry.Rotation2d"}], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModuleState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Minimize the change in heading the desired swerve module state would\nrequire by potentially reversing the direction the wheel spins. If this is\nused with the PIDController class's continuous input functionality, the\nfurthest a wheel will ever rotate is 90 degrees.\n\n:param desiredState: The desired state.\n:param currentAngle: The current module angle.", "returnType": "wpimath.kinematics._kinematics.SwerveModuleState", "args": [{"name": "desiredState", "type": "wpimath.kinematics._kinematics.SwerveModuleState"}, {"name": "currentAngle", "type": "wpimath.geometry._geometry.Rotation2d"}], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.SwerveModuleState", "FUNC": "optimize"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
