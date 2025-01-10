// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.event.BooleanEvent

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "BooleanEvent",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBooleanEvent"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Creates a new event that is active when the condition is true.\n\n:param loop:   the loop that polls this event\n:param signal: the digital signal represented by this object.", "returnType": "wpilib.event._event.BooleanEvent", "args": [{"name": "loop", "type": "wpilib.event._event.EventLoop"}, {"name": "signal", "type": "Callable[[], bool]"}], "importModule": "wpilib.event"}, "fields": {"CLASS": "wpilib.event.BooleanEvent"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myEventLoop"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "A method to \"downcast\" a BooleanEvent instance to a subclass (for example,\nto a command-based version of this class).\n\n:param ctor: a method reference to the constructor of the subclass that\n             accepts the loop as the first parameter and the condition/signal as the\n             second.\n\n:returns: an instance of the subclass.", "returnType": "object", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}, {"name": "ctor", "type": "Callable"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "castTo"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBooleanEvent"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Creates a new debounced event from this event - it will become active when\nthis event has been active for longer than the specified period.\n\n:param debounceTime: The debounce period.\n:param type:         The debounce type.\n\n:returns: The debounced event.", "returnType": "wpilib.event._event.BooleanEvent", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}, {"name": "debounceTime", "type": "wpimath.units.seconds"}, {"name": "type", "type": "wpimath.filter._filter.Debouncer.DebounceType"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "debounce"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDebounceType"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBooleanEvent"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Creates a new event that triggers when this one changes from true to false.\n\n:returns: the event.", "returnType": "wpilib.event._event.BooleanEvent", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "falling"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the state of this signal (high or low) as of the last loop poll.\n\n:returns: true for the high state, false for the low state. If the event was\n          never polled, it returns the state at event construction.", "returnType": "bool", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "getAsBoolean"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Bind an action to this event.\n\n:param action: the action to run if this event is active.", "returnType": "None", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}, {"name": "action", "type": "Callable[[], None]"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "ifHigh"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myBooleanEvent"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Creates a new event that triggers when this one changes from false to true.\n\n:returns: the new event.", "returnType": "wpilib.event._event.BooleanEvent", "args": [{"name": "booleanEvent", "type": "wpilib.event._event.BooleanEvent"}], "importModule": ""}, "fields": {"CLASS": "wpilib.event.BooleanEvent", "FUNC": "rising"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myBooleanEvent"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
