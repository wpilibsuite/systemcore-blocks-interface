// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.interpolation.TimeInterpolatablePose3dBuffer

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "args": [{"name": "historySize", "type": "wpimath.units.seconds"}, {"name": "func", "type": "Callable[[wpimath.geometry._geometry.Pose3d, wpimath.geometry._geometry.Pose3d, float], wpimath.geometry._geometry.Pose3d]"}], "tooltip": "Create a new TimeInterpolatableBuffer.\n\n:param historySize: The history size of the buffer.\n:param func:        The function used to interpolate between values.", "importModule": "wpimath.interpolation"}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myCallable"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "args": [{"name": "historySize", "type": "wpimath.units.seconds"}], "tooltip": "Create a new TimeInterpolatableBuffer. By default, the interpolation\nfunction is wpi::Lerp except for Pose2d, which uses the pose exponential.\n\n:param historySize: The history size of the buffer.", "importModule": "wpimath.interpolation"}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timeInterpolatablePose3dBuffer", "type": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}, {"name": "time", "type": "wpimath.units.seconds"}, {"name": "sample", "type": "wpimath.geometry.Pose3d"}], "tooltip": "Add a sample to the buffer.\n\n:param time:   The timestamp of the sample.\n:param sample: The sample object.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "FUNC": "addSample"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPose3d"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "timeInterpolatablePose3dBuffer", "type": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}], "tooltip": "Clear all old samples.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "FUNC": "clear"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "list[tuple[wpimath.units.seconds, wpimath.geometry._geometry.Pose3d]]", "args": [{"name": "timeInterpolatablePose3dBuffer", "type": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}], "tooltip": "Grant access to the internal sample buffer. Used in Pose Estimation to\nreplay odometry inputs stored within this buffer.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "FUNC": "getInternalBuffer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "Optional[wpimath.geometry._geometry.Pose3d]", "args": [{"name": "timeInterpolatablePose3dBuffer", "type": "wpimath.interpolation.TimeInterpolatablePose3dBuffer"}, {"name": "time", "type": "wpimath.units.seconds"}], "tooltip": "Sample the buffer at the given time. If the buffer is empty, an empty\noptional is returned.\n\n:param time: The time at which to sample the buffer.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.interpolation.TimeInterpolatablePose3dBuffer", "FUNC": "sample"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatablePose3dBuffer"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "TimeInterpolatablePose3dBuffer",
    contents: contents,
    className: "wpimath.interpolation.TimeInterpolatablePose3dBuffer",
  };

  return category;
}
