// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpimath.filter.MedianFilter

export function initialize() {
}

export function getToolboxCategory(subcategories: Category[] = []): Category {
  const category: Category = {
    kind: "category",
    name: "MedianFilter",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myMedianFilter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Creates a new MedianFilter.\n\n:param size: The number of samples in the moving window.", "returnType": "wpimath.filter._filter.MedianFilter", "args": [{"name": "size", "type": "int"}], "importModule": "wpimath.filter"}, "fields": {"CLASS": "wpimath.filter.MedianFilter"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Calculates the moving-window median for the next value of the input stream.\n\n:param next: The next input value.\n\n:returns: The median of the moving window, updated to include the next value.", "returnType": "float", "args": [{"name": "medianFilter", "type": "wpimath.filter._filter.MedianFilter"}, {"name": "next", "type": "float"}], "importModule": ""}, "fields": {"CLASS": "wpimath.filter.MedianFilter", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the last value calculated by the MedianFilter.\n\n:returns: The last value.", "returnType": "float", "args": [{"name": "medianFilter", "type": "wpimath.filter._filter.MedianFilter"}], "importModule": ""}, "fields": {"CLASS": "wpimath.filter.MedianFilter", "FUNC": "lastValue"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Resets the filter, clearing the window of all elements.", "returnType": "None", "args": [{"name": "medianFilter", "type": "wpimath.filter._filter.MedianFilter"}], "importModule": ""}, "fields": {"CLASS": "wpimath.filter.MedianFilter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myMedianFilter"}}}}}},
    ],
  };
  category.contents.push(...subcategories);
  return category;
}
