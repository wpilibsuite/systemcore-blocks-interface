// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveVoltageConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint", "args": [{"name": "feedforward", "type": "wpimath.controller.SimpleMotorFeedforwardMeters"}, {"name": "kinematics", "type": "wpimath.kinematics.DifferentialDriveKinematics"}, {"name": "maxVoltage", "type": "wpimath.units.volts"}], "tooltip": "Creates a new DifferentialDriveVoltageConstraint.\n\n:param feedforward: A feedforward component describing the behavior of the\n                    drive.\n:param kinematics:  A kinematics component describing the drive geometry.\n:param maxVoltage:  The maximum voltage available to the motors while\n                    following the path. Should be somewhat less than the nominal battery\n                    voltage (12V) to account for \"voltage sag\" due to current draw.", "importModule": "wpimath.trajectory.constraint"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimpleMotorFeedforwardMeters"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveKinematics"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "differentialDriveVoltageConstraint", "type": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveVoltageConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "differentialDriveVoltageConstraint", "type": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint"}, {"name": "pose", "type": "wpimath.geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveVoltageConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DifferentialDriveVoltageConstraint",
    contents: contents,
    className: "wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint",
  };

  return category;
}
