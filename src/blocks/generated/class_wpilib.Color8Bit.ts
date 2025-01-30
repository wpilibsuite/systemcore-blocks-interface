// This file was generated. Do not edit!

import * as getPythonVariable from "../mrc_get_python_variable";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.Color8Bit

export function initialize() {
  getPythonVariable.initializeInstanceVariableGetter("wpilib.Color8Bit", "int", ["blue", "green", "red"], ["Blue component (0-255).", "Green component (0-255).", "Red component (0-255)."]);
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 10 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.Color8Bit", "varType": "int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "VAR": "blue"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.Color8Bit", "varType": "int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "VAR": "green"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
    {"kind": "block", "type": "mrc_get_python_variable", "extraState": {"varKind": "instance", "moduleOrClassName": "wpilib.Color8Bit", "varType": "int", "importModule": "", "selfLabel": "color8Bit", "selfType": "wpilib.Color8Bit"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "VAR": "red"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Color8Bit", "args": [], "tooltip": "Constructs a default color (black).", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "red", "type": "int"}, {"name": "green", "type": "int"}, {"name": "blue", "type": "int"}], "tooltip": "Constructs a Color8Bit.\n\n:param red:   Red value (0-255)\n:param green: Green value (0-255)\n:param blue:  Blue value (0-255)", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "color", "type": "wpilib._wpilib.Color"}], "tooltip": "Constructs a Color8Bit from a Color.\n\n:param color: The color", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "hexString", "type": "str"}], "tooltip": "Constructs a Color8Bit from a hex string.\n\n:param hexString: a string of the format <tt>\\#RRGGBB</tt>\n                  @throws std::invalid_argument if the hex string is invalid.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor8Bit"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "wpilib._wpilib.Color8Bit", "args": [{"name": "hexString", "type": "str"}], "tooltip": "Create a Color8Bit from a hex string.\n\n:param hexString: a string of the format <tt>\\#RRGGBB</tt>\n\n:returns: Color8Bit object from hex string.\n          @throws std::invalid_argument if the hex string is invalid.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "FUNC": "fromHexString"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "str", "args": [{"name": "color8Bit", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "Return this color represented as a hex string.\n\n:returns: a string of the format <tt>\\#RRGGBB</tt>", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "FUNC": "hexString"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myColor"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib._wpilib.Color", "args": [{"name": "color8Bit", "type": "wpilib._wpilib.Color8Bit"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Color8Bit", "FUNC": "toColor"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myColor8Bit"}}}}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "Color8Bit",
    contents: contents,
    className: "wpilib.Color8Bit",
  };

  return category;
}
