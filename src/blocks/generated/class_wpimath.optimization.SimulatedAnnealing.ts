// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.optimization.SimulatedAnnealing

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 2 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySimulatedAnnealing"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.optimization.SimulatedAnnealing", "args": [{"name": "initialTemperature", "type": "float"}, {"name": "neighbor", "type": "Callable[[object], object]"}, {"name": "cost", "type": "Callable[[object], float]"}], "tooltip": "Constructor for Simulated Annealing that can be used for the same functions\nbut with different initial states.\n\n:param initialTemperature: The initial temperature. Higher temperatures make\n                           it more likely a worse state will be accepted during iteration, helping\n                           to avoid local minima. The temperature is decreased over time.\n:param neighbor:           Function that generates a random neighbor of the current\n                           state.\n:param cost:               Function that returns the scalar cost of a state.", "importModule": "wpimath.optimization"}, "fields": {"MODULE_OR_CLASS": "wpimath.optimization.SimulatedAnnealing"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallable"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallable"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "object", "args": [{"name": "simulatedAnnealing", "type": "wpimath.optimization.SimulatedAnnealing"}, {"name": "initialGuess", "type": "object"}, {"name": "iterations", "type": "int"}], "tooltip": "Runs the Simulated Annealing algorithm.\n\n:param initialGuess: The initial state.\n:param iterations:   Number of iterations to run the solver.\n\n:returns: The optimized state.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.optimization.SimulatedAnnealing", "FUNC": "solve"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySimulatedAnnealing"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SimulatedAnnealing",
    contents: contents,
    className: "wpimath.optimization.SimulatedAnnealing",
  };

  return category;
}
