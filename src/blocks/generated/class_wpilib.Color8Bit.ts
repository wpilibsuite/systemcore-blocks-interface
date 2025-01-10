// This file was generated. Do not edit!

import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.Color8Bit

export function initialize() {
  pythonVariable.initializeInstanceVariableGetter("wpilib.Color8Bit", "int", ["blue", "green", "red"], ["Blue component (0-255).", "Green component (0-255).", "Red component (0-255)."]);
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Color8Bit",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.Color8Bit int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"CLASS": "wpilib.Color8Bit", "VAR": "blue"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.Color8Bit int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"CLASS": "wpilib.Color8Bit", "VAR": "green"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance wpilib.Color8Bit int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"CLASS": "wpilib.Color8Bit", "VAR": "red"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a default color (black).", "returnType": "wpilib._wpilib.Color8Bit", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Color8Bit"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a Color8Bit.\n\n:param red:   Red value (0-255)\n:param green: Green value (0-255)\n:param blue:  Blue value (0-255)", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "red", "type": "int"}, {"name": "green", "type": "int"}, {"name": "blue", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Color8Bit"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a Color8Bit from a Color.\n\n:param color: The color", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "color", "type": "wpilib._wpilib.Color"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Color8Bit"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a Color8Bit from a hex string.\n\n:param hexString: a string of the format <tt>\\#RRGGBB</tt>\n                  @throws std::invalid_argument if the hex string is invalid.", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "hexString", "type": "str"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Color8Bit"}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Create a Color8Bit from a hex string.\n\n:param hexString: a string of the format <tt>\\#RRGGBB</tt>\n\n:returns: Color8Bit object from hex string.\n          @throws std::invalid_argument if the hex string is invalid.", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "hexString", "type": "str"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.Color8Bit", "FUNC": "fromHexString"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Return this color represented as a hex string.\n\n:returns: a string of the format <tt>\\#RRGGBB</tt>", "returnType": "str", "args": [{"name": "color8Bit", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Color8Bit", "FUNC": "hexString"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.Color", "args": [{"name": "color8Bit", "type": "wpilib._wpilib.Color8Bit"}], "importModule": ""}, "fields": {"CLASS": "wpilib.Color8Bit", "FUNC": "toColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
