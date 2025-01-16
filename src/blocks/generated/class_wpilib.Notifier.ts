// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.Notifier

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "Notifier",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myNotifier"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.Notifier", "args": [{"name": "handler", "type": "Callable[[], None]"}], "tooltip": "Create a Notifier for timer event notification.\n\n:param handler: The handler is called at the notification time which is set\n                using StartSingle or StartPeriodic.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier"}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "notifier", "type": "wpilib._wpilib.Notifier"}, {"name": "handler", "type": "Callable[[], None]"}], "tooltip": "Change the handler function.\n\n:param handler: Handler", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "setCallback"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifier"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "static", "returnType": "bool", "args": [{"name": "realTime", "type": "bool"}, {"name": "priority", "type": "int"}], "tooltip": "Sets the HAL notifier thread priority.\n\nThe HAL notifier thread is responsible for managing the FPGA's notifier\ninterrupt and waking up user's Notifiers when it's their time to run.\nGiving the HAL notifier thread real-time priority helps ensure the user's\nreal-time Notifiers, if any, are notified to run in a timely manner.\n\n:param realTime: Set to true to set a real-time priority, false for standard\n                 priority.\n:param priority: Priority to set the thread to. For real-time, this is 1-99\n                 with 99 being highest. For non-real-time, this is forced to\n                 0. See \"man 7 sched\" for more details.\n\n:returns: True on success.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "setHALThreadPriority"}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "notifier", "type": "wpilib._wpilib.Notifier"}, {"name": "name", "type": "str"}], "tooltip": "Sets the name of the notifier.  Used for debugging purposes only.\n\n:param name: Name", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "setName"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifier"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "notifier", "type": "wpilib._wpilib.Notifier"}, {"name": "period", "type": "wpimath.units.seconds"}], "tooltip": "Register for periodic event notification.\n\nA timer event is queued for periodic event notification. Each time the\ninterrupt occurs, the event will be immediately requeued for the same time\ninterval.\n\n:param period: Period to call the handler starting one period\n               after the call to this method.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "startPeriodic"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifier"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "notifier", "type": "wpilib._wpilib.Notifier"}, {"name": "delay", "type": "wpimath.units.seconds"}], "tooltip": "Register for single event notification.\n\nA timer event is queued for a single event after the specified delay.\n\n:param delay: Amount of time to wait before the handler is called.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "startSingle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifier"}}}}}},
      {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "notifier", "type": "wpilib._wpilib.Notifier"}], "tooltip": "Stop timer events from occurring.\n\nStop any repeating timer events from occurring. This will also remove any\nsingle notification events from the queue.\n\nIf a timer-based call to the registered handler is in progress, this\nfunction will block until the handler call is complete.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.Notifier", "FUNC": "stop"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNotifier"}}}}}},
    ],
  };
  if (category.contents) {
    category.contents.push(...subcategories);
  }
  return category;
}
