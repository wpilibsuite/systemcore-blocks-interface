// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class wpilib.event.EventLoop

function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "EventLoop",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myEventLoop"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.event._event.EventLoop", "args": [], "importModule": "wpilib.event"}, "fields": {"CLASS": "wpilib.event.EventLoop"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Bind a new action to run when the loop is polled.\n\n:param action: the action to run.", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}, {"name": "action", "type": "Callable[[], None]"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.EventLoop", "FUNC": "bind"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Clear all bindings.", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.EventLoop", "FUNC": "clear"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Poll all bindings.", "returnType": "None", "args": [{"name": "eventLoop", "type": "wpilib.event._event.EventLoop"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.EventLoop", "FUNC": "poll"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
