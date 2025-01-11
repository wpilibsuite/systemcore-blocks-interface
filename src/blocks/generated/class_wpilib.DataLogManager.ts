// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.DataLogManager

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "DataLogManager",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDataLog"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the managed data log (for custom logging). Starts the data log manager\nif not already started.\n\n:returns: data log", "returnType": "wpiutil._wpiutil.log.DataLog", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "getLog"}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Get the log directory.\n\n:returns: log directory", "returnType": "str", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "getLogDir"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Log a message to the \"messages\" entry. The message is also printed to\nstandard output (followed by a newline).\n\n:param message: message", "returnType": "None", "args": [{"name": "message", "type": "str"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "log"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Enable or disable logging of the console output. Defaults to enabled.\n\n:param enabled: true to enable, false to disable", "returnType": "None", "args": [{"name": "enabled", "type": "bool"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "logConsoleOutput"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Enable or disable logging of NetworkTables data. Note that unlike the\nnetwork interface for NetworkTables, this will capture every value change.\nDefaults to enabled.\n\n:param enabled: true to enable, false to disable", "returnType": "None", "args": [{"name": "enabled", "type": "bool"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "logNetworkTables"}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Start data log manager. The parameters have no effect if the data log\nmanager was already started (e.g. by calling another static function).\n\n:param dir:      if not empty, directory to use for data log storage\n:param filename: filename to use; if none provided, the filename is\n                 automatically generated\n:param period:   time between automatic flushes to disk, in seconds;\n                 this is a time/storage tradeoff", "returnType": "None", "args": [{"name": "dir", "type": "str"}, {"name": "filename", "type": "str"}, {"name": "period", "type": "float"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "start"}, "inputs": {"ARG0": {"shadow": {"type": "text", "fields": {"TEXT": ""}}}, "ARG1": {"shadow": {"type": "text", "fields": {"TEXT": ""}}}}},
      {"kind": "block", "type": "call_python_static_method", "extraState": {"tooltip": "Stop data log manager.", "returnType": "None", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DataLogManager", "FUNC": "stop"}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
