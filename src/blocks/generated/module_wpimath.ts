// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module wpimath

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "wpimath",
    contents: [
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "", "returnType": "wpimath.units.radians", "args": [{"name": "angle", "type": "wpimath.units.radians"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "angleModulus"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Returns 0.0 if the given value is within the specified range around zero. The\nremaining range between the deadband and the maximum magnitude is scaled from\n0.0 to the maximum magnitude.\n\n:param value:        Value to clip.\n:param deadband:     Range around zero.\n:param maxMagnitude: The maximum magnitude of the input (defaults to 1). Can\n                     be infinite.\n\n:returns: The value after the deadband is applied.", "returnType": "float", "args": [{"name": "value", "type": "float"}, {"name": "deadband", "type": "float"}, {"name": "maxMagnitude", "type": "float"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "applyDeadband"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Returns the largest (closest to positive infinity)\n``int`` value that is less than or equal to the algebraic quotient.\n\n:param x: the dividend\n:param y: the divisor\n\n:returns: the largest (closest to positive infinity)\n          ``int`` value that is less than or equal to the algebraic quotient.", "returnType": "int", "args": [{"name": "x", "type": "int"}, {"name": "y", "type": "int"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "floorDiv"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Returns the floor modulus of the ``int`` arguments.\n\nThe floor modulus is ``r = x - (floorDiv(x, y) * y)``,\nhas the same sign as the divisor ``y`` or is zero, and\nis in the range of ``-std::abs(y) < r < +std::abs(y)``.\n\n:param x: the dividend\n:param y: the divisor\n\n:returns: the floor modulus ``x - (floorDiv(x, y) * y)``", "returnType": "int", "args": [{"name": "x", "type": "int"}, {"name": "y", "type": "int"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "floorMod"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Returns modulus of input.\n\n:param input:        Input value to wrap.\n:param minimumInput: The minimum value expected from the input.\n:param maximumInput: The maximum value expected from the input.", "returnType": "float", "args": [{"name": "input", "type": "float"}, {"name": "minimumInput", "type": "float"}, {"name": "maximumInput", "type": "float"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "inputModulus"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose3d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "", "returnType": "wpimath.geometry._geometry.Pose3d", "args": [{"name": "objectInField", "type": "wpimath.geometry._geometry.Pose3d"}, {"name": "cameraToObject", "type": "wpimath.geometry._geometry.Transform3d"}, {"name": "robotToCamera", "type": "wpimath.geometry._geometry.Transform3d"}], "importModule": "wpimath"}, "fields": {"MODULE": "wpimath", "FUNC": "objectToRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose3d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTransform3d"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTransform3d"}}}}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
