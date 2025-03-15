// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.controller.DifferentialDriveAccelerationLimiter

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.DifferentialDriveAccelerationLimiter", "args": [{"name": "system", "type": "wpimath.system.LinearSystem_2_2_2"}, {"name": "trackwidth", "type": "wpimath.units.meters"}, {"name": "maxLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxAngularAccel", "type": "wpimath.units.radians_per_second_squared"}], "tooltip": "Constructs a DifferentialDriveAccelerationLimiter.\n\n:param system:          The differential drive dynamics.\n:param trackwidth:      The distance between the differential drive's left and\n                        right wheels.\n:param maxLinearAccel:  The maximum linear acceleration.\n:param maxAngularAccel: The maximum angular acceleration.", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_2_2_2"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.controller.DifferentialDriveAccelerationLimiter", "args": [{"name": "system", "type": "wpimath.system.LinearSystem_2_2_2"}, {"name": "trackwidth", "type": "wpimath.units.meters"}, {"name": "minLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxAngularAccel", "type": "wpimath.units.radians_per_second_squared"}], "tooltip": "Constructs a DifferentialDriveAccelerationLimiter.\n\n:param system:          The differential drive dynamics.\n:param trackwidth:      The distance between the differential drive's left and\n                        right wheels.\n:param minLinearAccel:  The minimum (most negative) linear acceleration.\n:param maxLinearAccel:  The maximum (most positive) linear acceleration.\n:param maxAngularAccel: The maximum angular acceleration.\n                        @throws std::invalid_argument if minimum linear acceleration is greater\n                        than maximum linear acceleration", "importModule": "wpimath.controller"}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_2_2_2"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.controller.DifferentialDriveWheelVoltages", "args": [{"name": "differentialDriveAccelerationLimiter", "type": "wpimath.controller.DifferentialDriveAccelerationLimiter"}, {"name": "leftVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "rightVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "leftVoltage", "type": "wpimath.units.volts"}, {"name": "rightVoltage", "type": "wpimath.units.volts"}], "tooltip": "Returns the next voltage pair subject to acceleration constraints.\n\n:param leftVelocity:  The left wheel velocity.\n:param rightVelocity: The right wheel velocity.\n:param leftVoltage:   The unconstrained left motor voltage.\n:param rightVoltage:  The unconstrained right motor voltage.\n\n:returns: The constrained wheel voltages.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "DifferentialDriveAccelerationLimiter",
    contents: contents,
    className: "wpimath.controller.DifferentialDriveAccelerationLimiter",
  };

  return category;
}
