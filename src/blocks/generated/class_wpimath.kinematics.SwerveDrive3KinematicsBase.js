// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.kinematics.SwerveDrive3KinematicsBase

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "SwerveDrive3KinematicsBase",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveDrive3KinematicsBase"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.kinematics._kinematics.SwerveDrive3KinematicsBase", "args": [], "importModule": "wpimath.kinematics"}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive3KinematicsBase"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myChassisSpeeds"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Performs forward kinematics to return the resulting chassis speed from the\nwheel speeds. This method is often used for odometry -- determining the\nrobot's position on the field using data from the real-world speed of each\nwheel on the robot.\n\n:param wheelSpeeds: The speeds of the wheels.\n\n:returns: The chassis speed.", "returnType": "wpimath.kinematics._kinematics.ChassisSpeeds", "args": [{"name": "swerveDrive3KinematicsBase", "type": "wpimath.kinematics._kinematics.SwerveDrive3KinematicsBase"}, {"name": "wheelSpeeds", "type": "Tuple[wpimath.kinematics._kinematics.SwerveModuleState, wpimath.kinematics._kinematics.SwerveModuleState, wpimath.kinematics._kinematics.SwerveModuleState]"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive3KinematicsBase", "FUNC": "toChassisSpeeds"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive3KinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveModuleState]"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Performs forward kinematics to return the resulting Twist2d from the given\nchange in wheel positions. This method is often used for odometry --\ndetermining the robot's position on the field using changes in the distance\ndriven by each wheel on the robot.\n\n:param start: The starting distances driven by the wheels.\n:param end:   The ending distances driven by the wheels.\n\n:returns: The resulting Twist2d in the robot's movement.", "returnType": "wpimath.geometry._geometry.Twist2d", "args": [{"name": "swerveDrive3KinematicsBase", "type": "wpimath.kinematics._kinematics.SwerveDrive3KinematicsBase"}, {"name": "start", "type": "wpimath.kinematics._kinematics.SwerveDrive3WheelPositions"}, {"name": "end", "type": "wpimath.kinematics._kinematics.SwerveDrive3WheelPositions"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive3KinematicsBase", "FUNC": "toTwist2d"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive3KinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive3WheelPositions"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive3WheelPositions"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySwerveModuleState]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Performs inverse kinematics to return the wheel speeds from a desired\nchassis velocity. This method is often used to convert joystick values into\nwheel speeds.\n\n:param chassisSpeeds: The desired chassis speed.\n\n:returns: The wheel speeds.", "returnType": "Tuple[wpimath.kinematics._kinematics.SwerveModuleState, wpimath.kinematics._kinematics.SwerveModuleState, wpimath.kinematics._kinematics.SwerveModuleState]", "args": [{"name": "swerveDrive3KinematicsBase", "type": "wpimath.kinematics._kinematics.SwerveDrive3KinematicsBase"}, {"name": "chassisSpeeds", "type": "wpimath.kinematics._kinematics.ChassisSpeeds"}], "importModule": ""}, "fields": {"CLASS": "wpimath.kinematics.SwerveDrive3KinematicsBase", "FUNC": "toWheelSpeeds"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySwerveDrive3KinematicsBase"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myChassisSpeeds"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
