// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.path.TravelingSalesman

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTravelingSalesman"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.path.TravelingSalesman", "args": [], "tooltip": "Constructs a traveling salesman problem solver with a cost function defined\nas the 2D distance between poses.", "importModule": "wpimath.path"}, "fields": {"MODULE_OR_CLASS": "wpimath.path.TravelingSalesman"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTravelingSalesman"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.path.TravelingSalesman", "args": [{"name": "cost", "type": "Callable[[wpimath.geometry._geometry.Pose2d, wpimath.geometry._geometry.Pose2d], float]"}], "tooltip": "Constructs a traveling salesman problem solver with a user-provided cost\nfunction.\n\n:param cost: Function that returns the cost between two poses. The sum of\n             the costs for every pair of poses is minimized.", "importModule": "wpimath.path"}, "fields": {"MODULE_OR_CLASS": "wpimath.path.TravelingSalesman"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallable"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "list[wpimath.geometry._geometry.Pose2d]", "args": [{"name": "travelingSalesman", "type": "wpimath.path.TravelingSalesman"}, {"name": "poses", "type": "List[wpimath.geometry._geometry.Pose2d]"}, {"name": "iterations", "type": "int"}], "tooltip": "Finds the path through every pose that minimizes the cost. The first pose\nin the returned array is the first pose that was passed in.\n\nThis overload supports a dynamically-sized list of poses for Python to use.\n\n:param poses:      An array of Pose2ds the path must pass through.\n:param iterations: The number of times the solver attempts to find a better\n                   random neighbor.\n\n:returns: The optimized path as an array of Pose2ds.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.path.TravelingSalesman", "FUNC": "solve"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTravelingSalesman"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "TravelingSalesman",
    contents: contents,
    className: "wpimath.path.TravelingSalesman",
  };

  return category;
}
