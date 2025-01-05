// This file was generated. Do not edit!

import {Category} from "../../toolbox/items";

// Blocks for class wpilib.SendableChooser

export function initialize() {
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "SendableChooser",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "mySendableChooser"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.SendableChooser", "args": [], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.SendableChooser"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Adds the given object to the list of options.\n\nOn the SmartDashboard on the desktop, the object will appear as the given\nname.\n\n:param name:   the name of the option\n:param object: the option", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "name", "type": "str"}, {"name": "object", "type": "object"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SendableChooser", "FUNC": "addOption"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns a copy of the selected option (a std::weak_ptr<U> if T =\nstd::shared_ptr<U>).\n\nIf there is none selected, it will return the default. If there is none\nselected and no default, then it will return a value-initialized instance.\nFor integer types, this is 0. For container types like std::string, this is\nan empty string.\n\n:returns: The option selected", "returnType": "object", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SendableChooser", "FUNC": "getSelected"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SendableChooser", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Bind a listener that's called when the selected value changes.\nOnly one listener can be bound. Calling this function will replace the\nprevious listener.\n\n:param listener: The function to call that accepts the new value", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "param0", "type": "Callable[[object], None]"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SendableChooser", "FUNC": "onChange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Add the given object to the list of options and marks it as the default.\n\nFunctionally, this is very close to AddOption() except that it will use\nthis as the default option if none other is explicitly selected.\n\n:param name:   the name of the option\n:param object: the option", "returnType": "None", "args": [{"name": "sendableChooser", "type": "wpilib._wpilib.SendableChooser"}, {"name": "name", "type": "str"}, {"name": "object", "type": "object"}], "importModule": ""}, "fields": {"CLASS": "wpilib.SendableChooser", "FUNC": "setDefaultOption"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableChooser"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
