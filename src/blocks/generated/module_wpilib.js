// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for module wpilib

python.PythonEnumValues["wpilib.AnalogTriggerType"] = ["kFallingPulse", "kInWindow", "kRisingPulse", "kState"];
python.PythonEnumTooltips["wpilib.AnalogTriggerType"] = "Defines the state in which the AnalogTrigger triggers.\n\nMembers:\n\n  kInWindow : In window.\n\n  kState : State.\n\n  kRisingPulse : Rising Pulse.\n\n  kFallingPulse : Falling pulse.";
python.PythonEnumValues["wpilib.CompressorConfigType"] = ["Analog", "Digital", "Disabled", "Hybrid"];
python.PythonEnumTooltips["wpilib.CompressorConfigType"] = "Compressor config type.\n\nMembers:\n\n  Disabled : Disabled.\n\n  Digital : Digital.\n\n  Analog : Analog.\n\n  Hybrid : Hybrid.";
python.PythonEnumValues["wpilib.PneumaticsModuleType"] = ["CTREPCM", "REVPH"];
python.PythonEnumTooltips["wpilib.PneumaticsModuleType"] = "Pneumatics module type.\n\nMembers:\n\n  CTREPCM : CTRE PCM.\n\n  REVPH : REV PH.";
python.PythonEnumValues["wpilib.RadioLEDState"] = ["kGreen", "kOff", "kOrange", "kRed"];
python.PythonEnumTooltips["wpilib.RadioLEDState"] = "Members:\n\n  kOff\n\n  kGreen\n\n  kRed\n\n  kOrange";
python.PythonEnumValues["wpilib.RuntimeType"] = ["kRoboRIO", "kRoboRIO2", "kSimulation"];
python.PythonEnumTooltips["wpilib.RuntimeType"] = "Runtime type.\n\nMembers:\n\n  kRoboRIO : roboRIO 1.0.\n\n  kRoboRIO2 : roboRIO 2.0.\n\n  kSimulation : Simulation runtime.";


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "wpilib",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTuple"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Get the thread priority for the current thread.\n\n:param isRealTime: Set to true if thread is real-time, otherwise false.\n\n:returns: The current thread priority. For real-time, this is 1-99\n          with 99 being highest. For non-real-time, this is 0. See\n          \"man 7 sched\" for details.", "returnType": "tuple[int, bool]", "args": [], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "getCurrentThreadPriority"}}}}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Obtains the deploy directory of the program, which is the remote location\nthe deploy directory is deployed to by default. On the roboRIO, this is\n/home/lvuser/py/deploy. In simulation, it is where the simulation was launched\nfrom, in the subdirectory \"deploy\" (`dirname(robot.py)`/deploy).\n\n:returns: The result of the operating directory lookup", "returnType": "str", "args": [], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "getDeployDirectory"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTuple"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Gets error message string for an error code.", "returnType": "tuple[str, int]", "args": [], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "getErrorMessage"}}}}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Obtains the operating directory of the program. On the roboRIO, this\nis /home/lvuser/py. In simulation, it is the location of robot.py\n\n:returns: The result of the operating directory lookup.", "returnType": "str", "args": [], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "getOperatingDirectory"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Gives real-time clock system time with nanosecond resolution\n\n:returns: The time, just in case you want the robot to start autonomous at 8pm\n          on Saturday.", "returnType": "wpimath.units.seconds", "args": [], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "getTime"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Sets the thread priority for the current thread.\n\n:param realTime: Set to true to set a real-time priority, false for standard\n                 priority.\n:param priority: Priority to set the thread to. For real-time, this is 1-99\n                 with 99 being highest. For non-real-time, this is forced to\n                 0. See \"man 7 sched\" for more details.\n\n:returns: True on success.", "returnType": "bool", "args": [{"name": "realTime", "type": "bool"}, {"name": "priority", "type": "int"}], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "setCurrentThreadPriority"}},
      {"kind": "block", "type": "call_python_module_function", "extraState": {"tooltip": "Pause the task for a specified time.\n\nPause the execution of the program for a specified period of time given in\nseconds. Motors will continue to run at their last assigned values, and\nsensors will continue to update. Only the task containing the wait will pause\nuntil the wait time is expired.\n\n:param seconds: Length of time to pause, in seconds.", "returnType": "None", "args": [{"name": "seconds", "type": "wpimath.units.seconds"}], "importModule": "wpilib"}, "fields": {"MODULE": "wpilib", "FUNC": "wait"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kFallingPulse"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kInWindow"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kRisingPulse"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.AnalogTriggerType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.AnalogTriggerType", "ENUM_VALUE": "kState"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Analog"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Digital"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Disabled"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.CompressorConfigType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.CompressorConfigType", "ENUM_VALUE": "Hybrid"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.PneumaticsModuleType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.PneumaticsModuleType", "ENUM_VALUE": "CTREPCM"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.PneumaticsModuleType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.PneumaticsModuleType", "ENUM_VALUE": "REVPH"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kGreen"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kOff"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kOrange"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RadioLEDState", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RadioLEDState", "ENUM_VALUE": "kRed"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kRoboRIO"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kRoboRIO2"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.RuntimeType", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.RuntimeType", "ENUM_VALUE": "kSimulation"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
