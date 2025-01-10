// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.controller.DifferentialDriveAccelerationLimiter

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DifferentialDriveAccelerationLimiter",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a DifferentialDriveAccelerationLimiter.\n\n:param system:          The differential drive dynamics.\n:param trackwidth:      The distance between the differential drive's left and\n                        right wheels.\n:param maxLinearAccel:  The maximum linear acceleration.\n:param maxAngularAccel: The maximum angular acceleration.", "returnType": "wpimath._controls._controls.controller.DifferentialDriveAccelerationLimiter", "args": [{"name": "system", "type": "wpimath._controls._controls.system.LinearSystem_2_2_2"}, {"name": "trackwidth", "type": "wpimath.units.meters"}, {"name": "maxLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxAngularAccel", "type": "wpimath.units.radians_per_second_squared"}], "importModule": "wpimath.controller"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_2_2_2"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a DifferentialDriveAccelerationLimiter.\n\n:param system:          The differential drive dynamics.\n:param trackwidth:      The distance between the differential drive's left and\n                        right wheels.\n:param minLinearAccel:  The minimum (most negative) linear acceleration.\n:param maxLinearAccel:  The maximum (most positive) linear acceleration.\n:param maxAngularAccel: The maximum angular acceleration.\n                        @throws std::invalid_argument if minimum linear acceleration is greater\n                        than maximum linear acceleration", "returnType": "wpimath._controls._controls.controller.DifferentialDriveAccelerationLimiter", "args": [{"name": "system", "type": "wpimath._controls._controls.system.LinearSystem_2_2_2"}, {"name": "trackwidth", "type": "wpimath.units.meters"}, {"name": "minLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxLinearAccel", "type": "wpimath.units.meters_per_second_squared"}, {"name": "maxAngularAccel", "type": "wpimath.units.radians_per_second_squared"}], "importModule": "wpimath.controller"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLinearSystem_2_2_2"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the next voltage pair subject to acceleration constraints.\n\n:param leftVelocity:  The left wheel velocity.\n:param rightVelocity: The right wheel velocity.\n:param leftVoltage:   The unconstrained left motor voltage.\n:param rightVoltage:  The unconstrained right motor voltage.\n\n:returns: The constrained wheel voltages.", "returnType": "wpimath._controls._controls.controller.DifferentialDriveWheelVoltages", "args": [{"name": "differentialDriveAccelerationLimiter", "type": "wpimath._controls._controls.controller.DifferentialDriveAccelerationLimiter"}, {"name": "leftVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "rightVelocity", "type": "wpimath.units.meters_per_second"}, {"name": "leftVoltage", "type": "wpimath.units.volts"}, {"name": "rightVoltage", "type": "wpimath.units.volts"}], "importModule": ""}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveAccelerationLimiter", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveAccelerationLimiter"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
