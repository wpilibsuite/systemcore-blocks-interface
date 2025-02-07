// This file was generated. Do not edit!

import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.SendableChooser

export function initialize() {
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 6 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooser"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib._wpilib.SendableChooser", "args": [], "tooltip": "", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser"}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "name", "type": "str"}, {"name": "object", "type": "object"}], "tooltip": "Adds the given object to the list of options.\n\nOn the SmartDashboard on the desktop, the object will appear as the given\nname.\n\n:param name:   the name of the option\n:param object: the option", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser", "FUNC": "addOption"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "object", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}], "tooltip": "Returns a copy of the selected option (a std::weak_ptr<U> if T =\nstd::shared_ptr<U>).\n\nIf there is none selected, it will return the default. If there is none\nselected and no default, then it will return a value-initialized instance.\nFor integer types, this is 0. For container types like std::string, this is\nan empty string.\n\n:returns: The option selected", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser", "FUNC": "getSelected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "listener", "type": "Callable[[object], None]"}], "tooltip": "Bind a listener that's called when the selected value changes.\nOnly one listener can be bound. Calling this function will replace the\nprevious listener.\n\n:param listener: The function to call that accepts the new value", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser", "FUNC": "onChange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "name", "type": "str"}, {"name": "object", "type": "object"}], "tooltip": "Add the given object to the list of options and marks it as the default.\n\nFunctionally, this is very close to AddOption() except that it will use\nthis as the default option if none other is explicitly selected.\n\n:param name:   the name of the option\n:param object: the option", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.SendableChooser", "FUNC": "setDefaultOption"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "SendableChooser",
    contents: contents,
    className: "wpilib.SendableChooser",
  };

  return category;
}
