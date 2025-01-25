// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.Trajectory

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 8 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [], "tooltip": "", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "states", "type": "list[wpimath._controls._controls.trajectory.Trajectory.State]"}], "tooltip": "Constructs a trajectory from a vector of states.\n\n@throws std::invalid_argument if the vector of states is empty.", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPose2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.geometry._geometry.Pose2d", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}], "tooltip": "Returns the initial pose of the trajectory.\n\n:returns: The initial pose of the trajectory.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "initialPose"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}], "tooltip": "Transforms all poses in the trajectory so that they are relative to the\ngiven pose. This is useful for converting a field-relative trajectory\ninto a robot-relative trajectory.\n\n:param pose: The pose that is the origin of the coordinate frame that\n             the current trajectory will be transformed into.\n\n:returns: The transformed trajectory.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "relativeTo"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.trajectory.Trajectory.State", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}, {"name": "t", "type": "wpimath.units.seconds"}], "tooltip": "Sample the trajectory at a point in time.\n\n:param t: The point in time since the beginning of the trajectory to sample.\n\n:returns: The state at that point in time.\n          @throws std::runtime_error if the trajectory has no states.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "sample"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "list[wpimath._controls._controls.trajectory.Trajectory.State]", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}], "tooltip": "Return the states of the trajectory.\n\n:returns: The states of the trajectory.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "states"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}], "tooltip": "Returns the overall duration of the trajectory.\n\n:returns: The duration of the trajectory.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "totalTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}, {"name": "transform", "type": "wpimath.geometry._geometry.Transform2d"}], "tooltip": "Transforms all poses in the trajectory by the given transform. This is\nuseful for converting a robot-relative trajectory into a field-relative\ntrajectory. This works with respect to the first pose in the trajectory.\n\n:param transform: The transform to transform the trajectory by.\n\n:returns: The transformed trajectory.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.Trajectory", "FUNC": "transformBy"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTransform2d"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Trajectory",
    contents: contents,
    className: "wpimath.trajectory.Trajectory",
  };

  return category;
}
