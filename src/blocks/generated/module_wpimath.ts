// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpimath

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "wpimath.units.radians", "args": [{"name": "angle", "type": "wpimath.units.radians"}], "tooltip": "", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "angleModulus"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "float", "args": [{"name": "value", "type": "float"}, {"name": "deadband", "type": "float"}, {"name": "maxMagnitude", "type": "float"}], "tooltip": "Returns 0.0 if the given value is within the specified range around zero. The\nremaining range between the deadband and the maximum magnitude is scaled from\n0.0 to the maximum magnitude.\n\n:param value:        Value to clip.\n:param deadband:     Range around zero.\n:param maxMagnitude: The maximum magnitude of the input (defaults to 1). Can\n                     be infinite.\n\n:returns: The value after the deadband is applied.", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "applyDeadband"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "int", "args": [{"name": "x", "type": "int"}, {"name": "y", "type": "int"}], "tooltip": "Returns the largest (closest to positive infinity)\n``int`` value that is less than or equal to the algebraic quotient.\n\n:param x: the dividend\n:param y: the divisor\n\n:returns: the largest (closest to positive infinity)\n          ``int`` value that is less than or equal to the algebraic quotient.", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "floorDiv"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "int", "args": [{"name": "x", "type": "int"}, {"name": "y", "type": "int"}], "tooltip": "Returns the floor modulus of the ``int`` arguments.\n\nThe floor modulus is ``r = x - (floorDiv(x, y) * y)``,\nhas the same sign as the divisor ``y`` or is zero, and\nis in the range of ``-std::abs(y) < r < +std::abs(y)``.\n\n:param x: the dividend\n:param y: the divisor\n\n:returns: the floor modulus ``x - (floorDiv(x, y) * y)``", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "floorMod"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "float", "args": [{"name": "input", "type": "float"}, {"name": "minimumInput", "type": "float"}, {"name": "maximumInput", "type": "float"}], "tooltip": "Returns modulus of input.\n\n:param input:        Input value to wrap.\n:param minimumInput: The minimum value expected from the input.\n:param maximumInput: The maximum value expected from the input.", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "inputModulus"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose3d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "wpimath.geometry.Pose3d", "args": [{"name": "objectInField", "type": "wpimath.geometry.Pose3d"}, {"name": "cameraToObject", "type": "wpimath.geometry.Transform3d"}, {"name": "robotToCamera", "type": "wpimath.geometry.Transform3d"}], "tooltip": "", "importModule": "wpimath"}, "fields": {"MODULE_OR_CLASS": "wpimath", "FUNC": "objectToRobotPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose3d"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTransform3d"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTransform3d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    name:  "wpimath",
    contents: contents,
    moduleName: "wpimath",
    packageName: "wpimath",
  };

  return category;
}
