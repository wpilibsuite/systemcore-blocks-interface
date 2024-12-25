// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class wpimath.trajectory.Trajectory.State

python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared"] = ["acceleration"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared"] = ["The acceleration at that point of the trajectory."];
python.PythonVariableSetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared"] = ["acceleration"];
python.PythonVariableSetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared"] = ["The acceleration at that point of the trajectory."];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second_squared"] = ["acceleration_fps"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second_squared"] = [""];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter"] = ["curvature"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter"] = [""];
python.PythonVariableSetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter"] = ["curvature"];
python.PythonVariableSetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter"] = [""];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d"] = ["pose"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d"] = ["The pose at that point of the trajectory."];
python.PythonVariableSetterNames["instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d"] = ["pose"];
python.PythonVariableSetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d"] = ["The pose at that point of the trajectory."];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.seconds"] = ["t"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.seconds"] = ["The time elapsed since the beginning of the trajectory."];
python.PythonVariableSetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.seconds"] = ["t"];
python.PythonVariableSetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.seconds"] = ["The time elapsed since the beginning of the trajectory."];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second"] = ["velocity"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second"] = ["The speed at that point of the trajectory."];
python.PythonVariableSetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second"] = ["velocity"];
python.PythonVariableSetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second"] = ["The speed at that point of the trajectory."];
python.PythonVariableGetterNames["instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second"] = ["velocity_fps"];
python.PythonVariableGetterTooltips["instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second"] = [""];


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "State",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second_squared", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet_per_second_squared", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second_squared", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "acceleration_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians_per_meter", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "curvature"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.radians_per_meter", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.radians_per_meter", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "curvature"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Pose2d", "key": "instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "pose"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.geometry._geometry.Pose2d", "key": "instance wpimath.trajectory.Trajectory.State wpimath.geometry._geometry.Pose2d", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "pose"}, "inputs": {"VALUE": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}, "SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.seconds", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.seconds", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "t"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.seconds", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.seconds", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "t"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters_per_second", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.meters_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet_per_second", "key": "instance wpimath.trajectory.Trajectory.State wpimath.units.feet_per_second", "importModule": "", "selfLabel": "state", "selfType": "wpimath.trajectory.Trajectory.State"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "VAR": "velocity_fps"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath._controls._controls.trajectory.Trajectory.State", "args": [{"name": "t", "type": "wpimath.units.seconds"}, {"name": "velocity", "type": "wpimath.units.meters_per_second"}, {"name": "acceleration", "type": "wpimath.units.meters_per_second_squared"}, {"name": "pose", "type": "wpimath.geometry._geometry.Pose2d"}, {"name": "curvature", "type": "wpimath.units.radians_per_meter"}], "importModule": "wpimath.trajectory"}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State"}, "inputs": {"ARG3": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose2d"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myState"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Interpolates between two States.\n\n:param endValue: The end value for the interpolation.\n:param i:        The interpolant (fraction).\n\n:returns: The interpolated state.", "returnType": "wpimath._controls._controls.trajectory.Trajectory.State", "args": [{"name": "state", "type": "wpimath._controls._controls.trajectory.Trajectory.State"}, {"name": "endValue", "type": "wpimath._controls._controls.trajectory.Trajectory.State"}, {"name": "i", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.trajectory.Trajectory.State", "FUNC": "interpolate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myState"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
