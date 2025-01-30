// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.event.EventLoop

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myEventLoop"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.event._event.EventLoop", "args": [], "tooltip": "", "importModule": "wpilib.event"}, "fields": {"MODULE_OR_CLASS": "wpilib.event.EventLoop"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}, {"name": "action", "type": "Callable[[], None]"}], "tooltip": "Bind a new action to run when the loop is polled.\n\n:param action: the action to run.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.event.EventLoop", "FUNC": "bind"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}], "tooltip": "Clear all bindings.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.event.EventLoop", "FUNC": "clear"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}], "tooltip": "Poll all bindings.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.event.EventLoop", "FUNC": "poll"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "EventLoop",
    contents: contents,
    className: "wpilib.event.EventLoop",
  };

  return category;
}
