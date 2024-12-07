// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpimath.trajectory.TrapezoidProfileRadians.State

python.PythonVariableGetterNames["instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians"] = ["position"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians"] = ["The position at this state."];
python.PythonVariableGetterNames["instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians_per_second"] = ["velocity"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians_per_second"] = ["The velocity at this state."];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians", "key": "instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State", "VAR": "position"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians_per_second", "key": "instance wpimath.trajectory.TrapezoidProfileRadians.State wpimath.units.radians_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.TrapezoidProfileRadians.State"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.TrapezoidProfileRadians.State", "args": [{"name": "position", "type": "wpimath.units.radians"}, {"name": "velocity", "type": "wpimath.units.radians_per_second"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.TrapezoidProfileRadians.State"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
