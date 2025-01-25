// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpimath.filter.SlewRateLimiter

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 5 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySlewRateLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.filter._filter.SlewRateLimiter", "args": [{"name": "positiveRateLimit", "type": "wpimath.units.units_per_second"}, {"name": "negativeRateLimit", "type": "wpimath.units.units_per_second"}, {"name": "initialValue", "type": "float"}], "tooltip": "Creates a new SlewRateLimiter with the given positive and negative rate\nlimits and initial value.\n\n:param positiveRateLimit: The rate-of-change limit in the positive\n                          direction, in units per second. This is expected\n                          to be positive.\n:param negativeRateLimit: The rate-of-change limit in the negative\n                          direction, in units per second. This is expected\n                          to be negative.\n:param initialValue:      The initial value of the input.", "importModule": "wpimath.filter"}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.SlewRateLimiter"}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySlewRateLimiter"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpimath.filter._filter.SlewRateLimiter", "args": [{"name": "rateLimit", "type": "wpimath.units.units_per_second"}], "tooltip": "Creates a new SlewRateLimiter with the given positive rate limit and\nnegative rate limit of -rateLimit.\n\n:param rateLimit: The rate-of-change limit.", "importModule": "wpimath.filter"}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.SlewRateLimiter"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "slewRateLimiter", "type": "wpimath.filter._filter.SlewRateLimiter"}, {"name": "input", "type": "float"}], "tooltip": "Filters the input to limit its slew rate.\n\n:param input: The input value whose slew rate is to be limited.\n\n:returns: The filtered value, which will not change faster than the slew\n          rate.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.SlewRateLimiter", "FUNC": "calculate"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySlewRateLimiter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "slewRateLimiter", "type": "wpimath.filter._filter.SlewRateLimiter"}], "tooltip": "Returns the value last calculated by the SlewRateLimiter.\n\n:returns: The last value.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.SlewRateLimiter", "FUNC": "lastValue"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySlewRateLimiter"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "slewRateLimiter", "type": "wpimath.filter._filter.SlewRateLimiter"}, {"name": "value", "type": "float"}], "tooltip": "Resets the slew rate limiter to the specified value; ignores the rate limit\nwhen doing so.\n\n:param value: The value to reset to.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpimath.filter.SlewRateLimiter", "FUNC": "reset"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySlewRateLimiter"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SlewRateLimiter",
    contents: contents,
    className: "wpimath.filter.SlewRateLimiter",
  };

  return category;
}
