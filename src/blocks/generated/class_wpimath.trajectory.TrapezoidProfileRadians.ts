// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfileRadians

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.trajectory.TrapezoidProfileRadians", "args": [{"name": "constraints", "type": "wpimath.trajectory.TrapezoidProfileRadians.Constraints"}], "tooltip": "Constructs a TrapezoidProfile.\n\n:param constraints: The constraints on the profile, like maximum velocity.", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.trajectory.TrapezoidProfileRadians.State", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath.trajectory.TrapezoidProfileRadians"}, {"name": "t", "type": "wpimath.units.seconds"}, {"name": "current", "type": "wpimath.trajectory.TrapezoidProfileRadians.State"}, {"name": "goal", "type": "wpimath.trajectory.TrapezoidProfileRadians.State"}], "tooltip": "Calculates the position and velocity for the profile at a time t where the\ncurrent state is at time t = 0.\n\n:param t:       How long to advance from the current state toward the desired\n                state.\n:param current: The current state.\n:param goal:    The desired state when the profile is complete.\n\n:returns: The position and velocity of the profile at time t.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}, "ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "bool", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath.trajectory.TrapezoidProfileRadians"}, {"name": "t", "type": "wpimath.units.seconds"}], "tooltip": "Returns true if the profile has reached the goal.\n\nThe profile has reached the goal if the time since the profile started has\nexceeded the profile's total time.\n\n:param t: The time since the beginning of the profile.\n\n:returns: True if the profile has reached the goal.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "isFinished"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath.trajectory.TrapezoidProfileRadians"}, {"name": "target", "type": "wpimath.units.radians"}], "tooltip": "Returns the time left until a target distance in the profile is reached.\n\n:param target: The target distance.\n\n:returns: The time left until a target distance in the profile is reached.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "timeLeftUntil"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath.trajectory.TrapezoidProfileRadians"}], "tooltip": "Returns the total time the profile takes to reach the goal.\n\n:returns: The total time the profile takes to reach the goal.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "totalTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "TrapezoidProfileRadians",
    contents: contents,
    className: "wpimath.trajectory.TrapezoidProfileRadians",
  };

  return category;
}
