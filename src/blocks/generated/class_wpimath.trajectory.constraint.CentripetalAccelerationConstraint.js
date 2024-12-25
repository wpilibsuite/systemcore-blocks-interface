// This file was generated. Do not edit!

// Blocks for class wpimath.trajectory.constraint.CentripetalAccelerationConstraint

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "CentripetalAccelerationConstraint",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCentripetalAccelerationConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.CentripetalAccelerationConstraint", "args": [{"name": "maxCentripetalAcceleration", "type": "wpimath.units.meters_per_second_squared"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.CentripetalAccelerationConstraint"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myCentripetalAccelerationConstraint"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.CentripetalAccelerationConstraint", "args": [{"name": "maxCentripetalAcceleration", "type": "wpimath.units.feet_per_second_squared"}], "importModule": "wpimath.trajectory.constraint"}, "fields": {"CLASS": "wpimath.trajectory.constraint.CentripetalAccelerationConstraint", "FUNC": "fromFps"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath.units.meters_per_second", "args": [{"name": "centripetalAccelerationConstraint", "type": "wpimath._controls._controls.constraint.CentripetalAccelerationConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.CentripetalAccelerationConstraint", "FUNC": "maxVelocity"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCentripetalAccelerationConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMinMax"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.constraint.TrajectoryConstraint.MinMax", "args": [{"name": "centripetalAccelerationConstraint", "type": "wpimath._controls._controls.constraint.CentripetalAccelerationConstraint"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}, {"name": "speed", "type": "wpimath.units.meters_per_second"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.constraint.CentripetalAccelerationConstraint", "FUNC": "minMaxAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCentripetalAccelerationConstraint"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
