// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.interpolation.TimeInterpolatableTranslation3dBuffer

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "TimeInterpolatableTranslation3dBuffer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create a new TimeInterpolatableBuffer.\n\n:param historySize: The history size of the buffer.\n:param func:        The function used to interpolate between values.", "returnType": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer", "args": [{"name": "historySize", "type": "wpimath.units.seconds"}, {"name": "func", "type": "Callable[[wpimath.geometry._geometry.Translation3d, wpimath.geometry._geometry.Translation3d, float], wpimath.geometry._geometry.Translation3d]"}], "importModule": "wpimath.interpolation"}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer"}, "inputs": {"ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTranslation3d]"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Create a new TimeInterpolatableBuffer. By default, the interpolation\nfunction is wpi::Lerp except for Pose2d, which uses the pose exponential.\n\n:param historySize: The history size of the buffer.", "returnType": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer", "args": [{"name": "historySize", "type": "wpimath.units.seconds"}], "importModule": "wpimath.interpolation"}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Add a sample to the buffer.\n\n:param time:   The timestamp of the sample.\n:param sample: The sample object.", "returnType": "None", "args": [{"name": "timeInterpolatableTranslation3dBuffer", "type": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer"}, {"name": "time", "type": "wpimath.units.seconds"}, {"name": "sample", "type": "wpimath.geometry._geometry.Translation3d"}], "importModule": ""}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer", "FUNC": "addSample"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}}}, "ARG2": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTranslation3d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Clear all old samples.", "returnType": "None", "args": [{"name": "timeInterpolatableTranslation3dBuffer", "type": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer"}], "importModule": ""}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer", "FUNC": "clear"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myList"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Grant access to the internal sample buffer. Used in Pose Estimation to\nreplay odometry inputs stored within this buffer.", "returnType": "list[tuple[wpimath.units.seconds, wpimath.geometry._geometry.Translation3d]]", "args": [{"name": "timeInterpolatableTranslation3dBuffer", "type": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer"}], "importModule": ""}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer", "FUNC": "getInternalBuffer"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myTranslation3d]"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sample the buffer at the given time. If the buffer is empty, an empty\noptional is returned.\n\n:param time: The time at which to sample the buffer.", "returnType": "Optional[wpimath.geometry._geometry.Translation3d]", "args": [{"name": "timeInterpolatableTranslation3dBuffer", "type": "wpimath.interpolation._interpolation.TimeInterpolatableTranslation3dBuffer"}, {"name": "time", "type": "wpimath.units.seconds"}], "importModule": ""}, "fields": {"CLASS": "wpimath.interpolation.TimeInterpolatableTranslation3dBuffer", "FUNC": "sample"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myTimeInterpolatableTranslation3dBuffer"}}}}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
