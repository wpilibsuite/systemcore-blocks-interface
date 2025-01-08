// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.geometry.Twist2d

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.radians", ["dtheta"], ["Angular \"dtheta\" component (radians)"]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.radians", ["dtheta"], ["Angular \"dtheta\" component (radians)"]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.degrees", ["dtheta_degrees"], [""]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.degrees", ["dtheta_degrees"], [""]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.meters", ["dx", "dy"], ["Linear \"dx\" component", "Linear \"dy\" component"]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.meters", ["dx", "dy"], ["Linear \"dx\" component", "Linear \"dy\" component"]);
  pythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.feet", ["dx_feet", "dy_feet"], ["", ""]);
  pythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.feet", ["dx_feet", "dy_feet"], ["", ""]);
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "Twist2d",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.radians", "key": "instance wpimath.geometry.Twist2d wpimath.units.radians", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.radians", "key": "instance wpimath.geometry.Twist2d wpimath.units.radians", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.degrees", "key": "instance wpimath.geometry.Twist2d wpimath.units.degrees", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta_degrees"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.degrees", "key": "instance wpimath.geometry.Twist2d wpimath.units.degrees", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta_degrees"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.geometry.Twist2d wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dx"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.geometry.Twist2d wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dx"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.geometry.Twist2d wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dy"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.meters", "key": "instance wpimath.geometry.Twist2d wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dy"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.geometry.Twist2d wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dx_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.geometry.Twist2d wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dx_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.geometry.Twist2d wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dy_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "wpimath.units.feet", "key": "instance wpimath.geometry.Twist2d wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "VAR": "dy_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpimath.geometry._geometry.Twist2d", "args": [{"name": "dx", "type": "wpimath.units.meters"}, {"name": "dy", "type": "wpimath.units.meters"}, {"name": "dtheta", "type": "wpimath.units.radians"}], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.Twist2d"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "", "returnType": "wpimath.geometry._geometry.Twist2d", "args": [{"name": "dx", "type": "wpimath.units.feet"}, {"name": "dy", "type": "wpimath.units.feet"}, {"name": "dtheta", "type": "wpimath.units.radians"}], "importModule": "wpimath.geometry"}, "fields": {"CLASS": "wpimath.geometry.Twist2d", "FUNC": "fromFeet"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
