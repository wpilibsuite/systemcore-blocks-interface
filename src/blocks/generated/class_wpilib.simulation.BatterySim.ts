// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.simulation.BatterySim

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 3 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBatterySim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.simulation.BatterySim", "args": [], "tooltip": "", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.BatterySim"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.units.volts", "args": [{"name": "nominalVoltage", "type": "wpimath.units.volts"}, {"name": "resistance", "type": "wpimath.units.ohms"}, {"name": "currents", "type": "List[wpimath.units.amperes]"}], "tooltip": "Calculate the loaded battery voltage. Use this with\nRoboRioSim::SetVInVoltage(double) to set the simulated battery voltage,\nwhich can then be retrieved with the RobotController::GetBatteryVoltage()\nmethod.\n\n:param nominalVoltage: The nominal battery voltage. Usually 12v.\n:param resistance:     The forward resistance of the battery. Most batteries\n                       are at or below 20 milliohms.\n:param currents:       The currents drawn from the battery.\n\n:returns: The battery's voltage under load.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.BatterySim", "FUNC": "calculate"}, "inputs": {"ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.units.volts", "args": [{"name": "currents", "type": "List[wpimath.units.amperes]"}], "tooltip": "Calculate the loaded battery voltage. Use this with\nRoboRioSimSetVInVoltage(double) to set the simulated battery voltage, which\ncan then be retrieved with the RobotController::GetBatteryVoltage() method.\nThis function assumes a nominal voltage of 12V and a resistance of 20\nmilliohms (0.020 ohms).\n\n:param currents: The currents drawn from the battery.\n\n:returns: The battery's voltage under load.", "importModule": "wpilib.simulation"}, "fields": {"MODULE_OR_CLASS": "wpilib.simulation.BatterySim", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myList"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "BatterySim",
    contents: contents,
    className: "wpilib.simulation.BatterySim",
  };

  return category;
}
