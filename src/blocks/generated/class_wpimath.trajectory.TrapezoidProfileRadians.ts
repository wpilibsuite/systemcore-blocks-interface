// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrapezoidProfileRadians

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "TrapezoidProfileRadians",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a TrapezoidProfile.\n\n:param constraints: The constraints on the profile, like maximum velocity.", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians", "args": [{"name": "constraints", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.Constraints"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myConstraints"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Calculates the position and velocity for the profile at a time t where the\ncurrent state is at time t = 0.\n\n:param t:       How long to advance from the current state toward the desired\n                state.\n:param current: The current state.\n:param goal:    The desired state when the profile is complete.\n\n:returns: The position and velocity of the profile at time t.", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.State", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians"}, {"name": "t", "type": "wpimath.units.seconds"}, {"name": "current", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.State"}, {"name": "goal", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.State"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}, "ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns true if the profile has reached the goal.\n\nThe profile has reached the goal if the time since the profile started has\nexceeded the profile's total time.\n\n:param t: The time since the beginning of the profile.\n\n:returns: True if the profile has reached the goal.", "returnType": "bool", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians"}, {"name": "t", "type": "wpimath.units.seconds"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "isFinished"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the time left until a target distance in the profile is reached.\n\n:param target: The target distance.\n\n:returns: The time left until a target distance in the profile is reached.", "returnType": "wpimath.units.seconds", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians"}, {"name": "target", "type": "wpimath.units.radians"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "timeLeftUntil"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the total time the profile takes to reach the goal.\n\n:returns: The total time the profile takes to reach the goal.", "returnType": "wpimath.units.seconds", "args": [{"name": "trapezoidProfileRadians", "type": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians", "FUNC": "totalTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrapezoidProfileRadians"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
