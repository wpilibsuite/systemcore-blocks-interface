// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for module wpilib

export function initialize() {
  pythonEnum.initializeEnum("wpilib.AnalogTriggerType", ["kFallingPulse", "kInWindow", "kRisingPulse", "kState"], "Defines the state in which the AnalogTrigger triggers.\n\nMembers:\n\n  kInWindow : In window.\n\n  kState : State.\n\n  kRisingPulse : Rising Pulse.\n\n  kFallingPulse : Falling pulse.");
  pythonEnum.initializeEnum("wpilib.CompressorConfigType", ["Analog", "Digital", "Disabled", "Hybrid"], "Compressor config type.\n\nMembers:\n\n  Disabled : Disabled.\n\n  Digital : Digital.\n\n  Analog : Analog.\n\n  Hybrid : Hybrid.");
  pythonEnum.initializeEnum("wpilib.PneumaticsModuleType", ["CTREPCM", "REVPH"], "Pneumatics module type.\n\nMembers:\n\n  CTREPCM : CTRE PCM.\n\n  REVPH : REV PH.");
  pythonEnum.initializeEnum("wpilib.RadioLEDState", ["kGreen", "kOff", "kOrange", "kRed"], "State for the radio led.\n\nMembers:\n\n  kOff : ///< Off.\n\n  kGreen : ///< Green.\n\n  kRed : ///< Red.\n\n  kOrange : ///< Orange.");
  pythonEnum.initializeEnum("wpilib.RuntimeType", ["kRoboRIO", "kRoboRIO2", "kSimulation"], "Runtime type.\n\nMembers:\n\n  kRoboRIO : roboRIO 1.0.\n\n  kRoboRIO2 : roboRIO 2.0.\n\n  kSimulation : Simulation runtime.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTuple"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "tuple[int, bool]", "args": [], "tooltip": "Get the thread priority for the current thread.\n\n:param isRealTime: Set to true if thread is real-time, otherwise false.\n\n:returns: The current thread priority. For real-time, this is 1-99\n          with 99 being highest. For non-real-time, this is 0. See\n          \"man 7 sched\" for details.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "getCurrentThreadPriority"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "str", "args": [], "tooltip": "Obtains the deploy directory of the program, which is the remote location\nthe deploy directory is deployed to by default. On the roboRIO, this is\n/home/lvuser/py/deploy. In simulation, it is where the simulation was launched\nfrom, in the subdirectory \"deploy\" (`dirname(robot.py)`/deploy).\n\n:returns: The result of the operating directory lookup", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "getDeployDirectory"}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTuple"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "tuple[str, int]", "args": [], "tooltip": "Gets error message string for an error code.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "getErrorMessage"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "str", "args": [], "tooltip": "Obtains the operating directory of the program. On the roboRIO, this\nis /home/lvuser/py. In simulation, it is the location of robot.py\n\n:returns: The result of the operating directory lookup.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "getOperatingDirectory"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "wpimath.units.seconds", "args": [], "tooltip": "Gives real-time clock system time with nanosecond resolution\n\n:returns: The time, just in case you want the robot to start autonomous at 8pm\n          on Saturday.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "getTime"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "bool", "args": [{"name": "realTime", "type": "bool"}, {"name": "priority", "type": "int"}], "tooltip": "Sets the thread priority for the current thread.\n\n:param realTime: Set to true to set a real-time priority, false for standard\n                 priority.\n:param priority: Priority to set the thread to. For real-time, this is 1-99\n                 with 99 being highest. For non-real-time, this is forced to\n                 0. See \"man 7 sched\" for more details.\n\n:returns: True on success.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "setCurrentThreadPriority"}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "module", "returnType": "None", "args": [{"name": "seconds", "type": "wpimath.units.seconds"}], "tooltip": "Pause the task for a specified time.\n\nPause the execution of the program for a specified period of time given in\nseconds. Motors will continue to run at their last assigned values, and\nsensors will continue to update. Only the task containing the wait will pause\nuntil the wait time is expired.\n\n:param seconds: Length of time to pause, in seconds.", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib", "FUNC": "wait"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kFallingPulse"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kInWindow"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kRisingPulse"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kState"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Analog"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Digital"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Disabled"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Hybrid"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.PneumaticsModuleType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.PneumaticsModuleType", "ENUM_VALUE": "CTREPCM"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.PneumaticsModuleType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.PneumaticsModuleType", "ENUM_VALUE": "REVPH"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kGreen"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kOff"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kOrange"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kRed"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kRoboRIO"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kRoboRIO2"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kSimulation"}},
  ];
  contents.push(...subcategories);
  const category: toolboxItems.PythonModuleCategory = {
    kind: "category",
    moduleName: "wpilib",
    name:  "wpilib",
      contents: contents,
  };
  return category;
}
