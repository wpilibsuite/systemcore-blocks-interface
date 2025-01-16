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
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "bool", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "getProgramStarted"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "bool", "args": [], "tooltip": "Check if the simulator time is paused.\n\n:returns: true if paused", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "isTimingPaused"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [], "tooltip": "Pause the simulator time.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "pauseTiming"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [], "tooltip": "Restart the simulator time.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "restartTiming"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [], "tooltip": "Resume the simulator time.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "resumeTiming"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "setProgramStarted"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [{"name": "type", "type": "hal._wpiHal.RuntimeType"}], "tooltip": "Override the HAL runtime type (simulated/real).\n\n:param type: runtime type", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "setRuntimeType"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRuntimeType"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [{"name": "delta", "type": "wpimath.units.seconds"}], "tooltip": "Advance the simulator time and wait for all notifiers to run.\n\n:param delta: the amount to advance (in seconds)", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "stepTiming"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [{"name": "delta", "type": "wpimath.units.seconds"}], "tooltip": "Advance the simulator time and return immediately.\n\n:param delta: the amount to advance (in seconds)", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "stepTimingAsync"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation", "FUNC": "waitForProgramStart"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
