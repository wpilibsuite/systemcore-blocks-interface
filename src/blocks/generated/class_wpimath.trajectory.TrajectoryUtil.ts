// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.trajectory.TrajectoryUtil

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "TrajectoryUtil",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Serializes a Trajectory to PathWeaver-style JSON.\n\n:param jsonStr: the string containing the serialized JSON\n\n:returns: the trajectory represented by the JSON", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "jsonStr", "type": "str"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "deserializeTrajectory"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTrajectory"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Imports a Trajectory from a JSON file exported from PathWeaver.\n\n:param path: The path of the json file to import from.\n\n:returns: The trajectory represented by the file.", "returnType": "wpimath._controls._controls.trajectory.Trajectory", "args": [{"name": "path", "type": "str"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "fromPathweaverJson"}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Deserializes a Trajectory from JSON exported from PathWeaver.\n\n:param trajectory: the trajectory to export\n\n:returns: the string containing the serialized JSON", "returnType": "str", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "serializeTrajectory"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Exports a Trajectory to a PathWeaver-style JSON file.\n\n:param trajectory: the trajectory to export\n:param path:       the path of the file to export to", "returnType": "None", "args": [{"name": "trajectory", "type": "wpimath._controls._controls.trajectory.Trajectory"}, {"name": "path", "type": "str"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrajectoryUtil", "FUNC": "toPathweaverJson"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTrajectory"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
