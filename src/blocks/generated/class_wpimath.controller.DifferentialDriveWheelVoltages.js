// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class wpimath.controller.DifferentialDriveWheelVoltages

python.PythonVariableGetterNames["instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts"] = ["left", "right"];
python.PythonVariableGetterTooltips["instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts"] = ["Left wheel voltage.", "Right wheel voltage."];
python.PythonVariableSetterNames["instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts"] = ["left", "right"];
python.PythonVariableSetterTooltips["instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts"] = ["Left wheel voltage.", "Right wheel voltage."];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "DifferentialDriveWheelVoltages",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.volts", "key": "instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.volts", "key": "instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "left"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.volts", "key": "instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.volts", "key": "instance wpimath.controller.DifferentialDriveWheelVoltages wpimath.units.volts", "importModule": "", "selfLabel": "differentialDriveWheelVoltages", "selfType": "wpimath.controller.DifferentialDriveWheelVoltages"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages", "VAR": "right"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDifferentialDriveWheelVoltages"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.controller.DifferentialDriveWheelVoltages", "args": [{"name": "left", "type": "wpimath.units.volts"}, {"name": "right", "type": "wpimath.units.volts"}], "importModule": "wpimath.controller"}, "fields": {"CLASS": "wpimath.controller.DifferentialDriveWheelVoltages"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
