// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.optimization.SimulatedAnnealing

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SimulatedAnnealing",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimulatedAnnealing"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructor for Simulated Annealing that can be used for the same functions\nbut with different initial states.\n\n:param initialTemperature: The initial temperature. Higher temperatures make\n                           it more likely a worse state will be accepted during iteration, helping\n                           to avoid local minima. The temperature is decreased over time.\n:param neighbor:           Function that generates a random neighbor of the current\n                           state.\n:param cost:               Function that returns the scalar cost of a state.", "returnType": "wpimath._controls._controls.optimization.SimulatedAnnealing", "args": [{"name": "initialTemperature", "type": "float"}, {"name": "neighbor", "type": "Callable[[object], object]"}, {"name": "cost", "type": "Callable[[object], float]"}], "importModule": "wpimath.optimization"}, "fields": {"CLASS": "wpimath.optimization.SimulatedAnnealing"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Runs the Simulated Annealing algorithm.\n\n:param initialGuess: The initial state.\n:param iterations:   Number of iterations to run the solver.\n\n:returns: The optimized state.", "returnType": "object", "args": [{"name": "simulatedAnnealing", "type": "wpimath._controls._controls.optimization.SimulatedAnnealing"}, {"name": "initialGuess", "type": "object"}, {"name": "iterations", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpimath.optimization.SimulatedAnnealing", "FUNC": "solve"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimulatedAnnealing"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
