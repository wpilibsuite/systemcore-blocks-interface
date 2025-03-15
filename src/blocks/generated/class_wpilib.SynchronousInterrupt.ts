// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.SynchronousInterrupt

export function initialize() {
  pythonEnum.initializeEnum("wpilib.SynchronousInterrupt.WaitResult", ["kBoth", "kFallingEdge", "kRisingEdge", "kTimeout"], "Event trigger combinations for a synchronous interrupt.\n\nMembers:\n\n  kTimeout : Timeout event.\n\n  kRisingEdge : Rising edge event.\n\n  kFallingEdge : Falling edge event.\n\n  kBoth : Both rising and falling edge events.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 12 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.SynchronousInterrupt", "args": [{"name": "source", "type": "wpilib.DigitalSource"}], "tooltip": "Construct a Synchronous Interrupt from a Digital Source.\n\n:param source: the DigitalSource the interrupts are triggered from", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.SynchronousInterrupt", "args": [{"name": "source", "type": "wpilib.DigitalSource"}], "tooltip": "Construct a Synchronous Interrupt from a Digital Source.\n\n:param source: the DigitalSource the interrupts are triggered from", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.SynchronousInterrupt", "args": [{"name": "source", "type": "wpilib.DigitalSource"}], "tooltip": "Construct a Synchronous Interrupt from a Digital Source.\n\n:param source: the DigitalSource the interrupts are triggered from", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "synchronousInterrupt", "type": "wpilib.SynchronousInterrupt"}], "tooltip": "Get the timestamp of the last falling edge.\n\nThis function does not require the interrupt to be enabled to work.\n\nThis only works if falling edge was configured using setInterruptEdges.\n\n:returns: the timestamp in seconds relative to getFPGATime", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt", "FUNC": "getFallingTimestamp"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpimath.units.seconds", "args": [{"name": "synchronousInterrupt", "type": "wpilib.SynchronousInterrupt"}], "tooltip": "Get the timestamp (relative to FPGA Time) of the last rising edge.\n\n:returns: the timestamp in seconds relative to getFPGATime", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt", "FUNC": "getRisingTimestamp"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "synchronousInterrupt", "type": "wpilib.SynchronousInterrupt"}, {"name": "risingEdge", "type": "bool"}, {"name": "fallingEdge", "type": "bool"}], "tooltip": "Set which edges cause an interrupt to occur.\n\n:param risingEdge:  true to trigger on rising edge, false otherwise.\n:param fallingEdge: true to trigger on falling edge, false otherwise", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt", "FUNC": "setInterruptEdges"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myWaitResult"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.SynchronousInterrupt.WaitResult", "args": [{"name": "synchronousInterrupt", "type": "wpilib.SynchronousInterrupt"}, {"name": "timeout", "type": "wpimath.units.seconds"}, {"name": "ignorePrevious", "type": "bool"}], "tooltip": "Wait for an interrupt to occur.\n\nBoth rising and falling edge can be returned if both a rising and\nfalling happened between calls, and ignorePrevious is false.\n\n:param timeout:        The timeout to wait for. 0s or less will return immediately.\n:param ignorePrevious: True to ignore any previous interrupts, false to\n                       return interrupt value if an interrupt has occurred since last call.\n\n:returns: The edge(s) that were triggered, or timeout.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt", "FUNC": "waitForInterrupt"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}}}, "ARG2": {"shadow": {"type": "logic_boolean", "fields": {"BOOL": "TRUE"}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "synchronousInterrupt", "type": "wpilib.SynchronousInterrupt"}], "tooltip": "Wake up an existing wait call. Can be called from any thread.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SynchronousInterrupt", "FUNC": "wakeupWaitingInterrupt"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySynchronousInterrupt"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.SynchronousInterrupt.WaitResult", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.SynchronousInterrupt.WaitResult", "ENUM_VALUE": "kBoth"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.SynchronousInterrupt.WaitResult", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.SynchronousInterrupt.WaitResult", "ENUM_VALUE": "kFallingEdge"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.SynchronousInterrupt.WaitResult", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.SynchronousInterrupt.WaitResult", "ENUM_VALUE": "kRisingEdge"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.SynchronousInterrupt.WaitResult", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.SynchronousInterrupt.WaitResult", "ENUM_VALUE": "kTimeout"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SynchronousInterrupt",
    contents: contents,
    className: "wpilib.SynchronousInterrupt",
  };

  return category;
}
