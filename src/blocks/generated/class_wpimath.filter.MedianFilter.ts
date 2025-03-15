// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.filter.MedianFilter

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 4 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMedianFilter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.filter.MedianFilter", "args": [{"name": "size", "type": "int"}], "tooltip": "Creates a new MedianFilter.\n\n:param size: The number of samples in the moving window.", "importModule": "wpimath.filter"}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.MedianFilter"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "medianFilter", "type": "wpimath.filter.MedianFilter"}, {"name": "next", "type": "float"}], "tooltip": "Calculates the moving-window median for the next value of the input stream.\n\n:param next: The next input value.\n\n:returns: The median of the moving window, updated to include the next value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.MedianFilter", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "medianFilter", "type": "wpimath.filter.MedianFilter"}], "tooltip": "Returns the last value calculated by the MedianFilter.\n\n:returns: The last value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.MedianFilter", "FUNC": "lastValue"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "medianFilter", "type": "wpimath.filter.MedianFilter"}], "tooltip": "Resets the filter, clearing the window of all elements.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.MedianFilter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "MedianFilter",
    contents: contents,
    className: "wpimath.filter.MedianFilter",
  };

  return category;
}
