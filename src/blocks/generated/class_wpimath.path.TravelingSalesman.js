// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.path.TravelingSalesman

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "TravelingSalesman",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTravelingSalesman"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a traveling salesman problem solver with a cost function defined\nas the 2D distance between poses.", "returnType": "wpimath._controls._controls.path.TravelingSalesman", "args": [], "importModule": "wpimath.path"}, "fields": {"CLASS": "wpimath.path.TravelingSalesman"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTravelingSalesman"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a traveling salesman problem solver with a user-provided cost\nfunction.\n\n:param cost: Function that returns the cost between two poses. The sum of\n             the costs for every pair of poses is minimized.", "returnType": "wpimath._controls._controls.path.TravelingSalesman", "args": [{"name": "cost", "type": "Callable[[wpimath.geometry._geometry.Pose2d, wpimath.geometry._geometry.Pose2d], float]"}], "importModule": "wpimath.path"}, "fields": {"CLASS": "wpimath.path.TravelingSalesman"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d], float]"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Finds the path through every pose that minimizes the cost. The first pose\nin the returned array is the first pose that was passed in.\n\nThis overload supports a dynamically-sized list of poses for Python to use.\n\n:param poses:      An array of Pose2ds the path must pass through.\n:param iterations: The number of times the solver attempts to find a better\n                   random neighbor.\n\n:returns: The optimized path as an array of Pose2ds.", "returnType": "list[wpimath.geometry._geometry.Pose2d]", "args": [{"name": "travelingSalesman", "type": "wpimath._controls._controls.path.TravelingSalesman"}, {"name": "poses", "type": "List[wpimath.geometry._geometry.Pose2d]"}, {"name": "iterations", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpimath.path.TravelingSalesman", "FUNC": "solve"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTravelingSalesman"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d]"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
