// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpimath.geometry.Twist2d

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.radians", ["dtheta"], ["Angular \"dtheta\" component (radians)"]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.radians", ["dtheta"], ["Angular \"dtheta\" component (radians)"]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.degrees", ["dtheta_degrees"], [""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.degrees", ["dtheta_degrees"], [""]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.meters", ["dx", "dy"], ["Linear \"dx\" component", "Linear \"dy\" component"]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.meters", ["dx", "dy"], ["Linear \"dx\" component", "Linear \"dy\" component"]);
  getPythonVariable.initializeInstanceVariableGetter("wpimath.geometry.Twist2d", "wpimath.units.feet", ["dx_feet", "dy_feet"], ["", ""]);
  setPythonVariable.initializeInstanceVariableSetter("wpimath.geometry.Twist2d", "wpimath.units.feet", ["dx_feet", "dy_feet"], ["", ""]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Twist2d",
    contents: [
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.radians", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.radians", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.degrees", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta_degrees"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.degrees", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dtheta_degrees"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dx"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dx"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dy"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.meters", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dy"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dx_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dx_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dy_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "mrc_set_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpimath.geometry.Twist2d", "varType": "wpimath.units.feet", "importModule": "", "selfLabel": "twist2d", "selfType": "wpimath.geometry.Twist2d"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "VAR": "dy_feet"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTwist2d"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.geometry._geometry.Twist2d", "args": [{"name": "dx", "type": "wpimath.units.meters"}, {"name": "dy", "type": "wpimath.units.meters"}, {"name": "dtheta", "type": "wpimath.units.radians"}], "tooltip": "", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTwist2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpimath.geometry._geometry.Twist2d", "args": [{"name": "dx", "type": "wpimath.units.feet"}, {"name": "dy", "type": "wpimath.units.feet"}, {"name": "dtheta", "type": "wpimath.units.radians"}], "tooltip": "", "importModule": "wpimath.geometry"}, "fields": {"MODULE_OR_CLASS": "wpimath.geometry.Twist2d", "FUNC": "fromFeet"}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
