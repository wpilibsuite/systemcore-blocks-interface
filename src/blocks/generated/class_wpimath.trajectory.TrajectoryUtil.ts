// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrajectoryUtil

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.trajectory.Trajectory", "args": [{"name": "jsonStr", "type": "str"}], "tooltip": "Serializes a Trajectory to PathWeaver-style JSON.\n\n:param jsonStr: the string containing the serialized JSON\n\n:returns: the trajectory represented by the JSON", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "deserializeTrajectory"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.trajectory.Trajectory", "args": [{"name": "path", "type": "str"}], "tooltip": "Imports a Trajectory from a JSON file exported from PathWeaver.\n\n:param path: The path of the json file to import from.\n\n:returns: The trajectory represented by the file.", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "fromPathweaverJson"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "str", "args": [{"name": "trajectory", "type": "wpimath.trajectory.Trajectory"}], "tooltip": "Deserializes a Trajectory from JSON exported from PathWeaver.\n\n:param trajectory: the trajectory to export\n\n:returns: the string containing the serialized JSON", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "serializeTrajectory"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "None", "args": [{"name": "trajectory", "type": "wpimath.trajectory.Trajectory"}, {"name": "path", "type": "str"}], "tooltip": "Exports a Trajectory to a PathWeaver-style JSON file.\n\n:param trajectory: the trajectory to export\n:param path:       the path of the file to export to", "importModule": "wpimath.trajectory"}, "fields": {"MODULE_OR_CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "toPathweaverJson"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "TrajectoryUtil",
    contents: contents,
    className: "wpimath.trajectory.TrajectoryUtil",
  };

  return category;
}
