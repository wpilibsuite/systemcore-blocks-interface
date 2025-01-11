// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for module wpilib.simulation

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "simulation",
    contents: [
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "", "returnType": "bool", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "getProgramStarted"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Check if the simulator time is paused.\n\n:returns: true if paused", "returnType": "bool", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "isTimingPaused"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Pause the simulator time.", "returnType": "None", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "pauseTiming"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Restart the simulator time.", "returnType": "None", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "restartTiming"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Resume the simulator time.", "returnType": "None", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "resumeTiming"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "", "returnType": "None", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "setProgramStarted"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Override the HAL runtime type (simulated/real).\n\n:param type: runtime type", "returnType": "None", "args": [{"name": "type", "type": "hal._wpiHal.RuntimeType"}], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "setRuntimeType"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRuntimeType"}}}}}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Advance the simulator time and wait for all notifiers to run.\n\n:param delta: the amount to advance (in seconds)", "returnType": "None", "args": [{"name": "delta", "type": "wpimath.units.seconds"}], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "stepTiming"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Advance the simulator time and return immediately.\n\n:param delta: the amount to advance (in seconds)", "returnType": "None", "args": [{"name": "delta", "type": "wpimath.units.seconds"}], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "stepTimingAsync"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "", "returnType": "None", "args": [], "importModule": "wpilib.simulation"}, "fields": {"MODULE": "wpilib.simulation", "FUNC": "waitForProgramStart"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
