// This file was generated. Do not edit!

import * as python from "../python.js";

// Blocks for class wpilib.interfaces.Accelerometer

python.PythonEnumValues["wpilib.interfaces.Accelerometer.Range"] = ["kRange_16G", "kRange_2G", "kRange_4G", "kRange_8G"];
python.PythonEnumTooltips["wpilib.interfaces.Accelerometer.Range"] = "Accelerometer range.\n\nMembers:\n\n  kRange_2G : 2 Gs max.\n\n  kRange_4G : 4 Gs max.\n\n  kRange_8G : 8 Gs max.\n\n  kRange_16G : 16 Gs max.";


export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "Accelerometer",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAccelerometer"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "wpilib.interfaces._interfaces.Accelerometer", "args": [], "importModule": "wpilib.interfaces"}, "fields": {"CLASS": "wpilib.interfaces.Accelerometer"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for getting the x axis acceleration.\n\n:returns: The acceleration along the x axis in g-forces", "returnType": "float", "args": [{"name": "accelerometer", "type": "wpilib.interfaces._interfaces.Accelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.Accelerometer", "FUNC": "getX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for getting the y axis acceleration.\n\n:returns: The acceleration along the y axis in g-forces", "returnType": "float", "args": [{"name": "accelerometer", "type": "wpilib.interfaces._interfaces.Accelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.Accelerometer", "FUNC": "getY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for getting the z axis acceleration.\n\n:returns: The acceleration along the z axis in g-forces", "returnType": "float", "args": [{"name": "accelerometer", "type": "wpilib.interfaces._interfaces.Accelerometer"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.Accelerometer", "FUNC": "getZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAccelerometer"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Common interface for setting the measuring range of an accelerometer.\n\n:param range: The maximum acceleration, positive or negative, that the\n              accelerometer will measure. Not all accelerometers support all\n              ranges.", "returnType": "None", "args": [{"name": "accelerometer", "type": "wpilib.interfaces._interfaces.Accelerometer"}, {"name": "range", "type": "wpilib.interfaces._interfaces.Accelerometer.Range"}], "importModule": ""}, "fields": {"CLASS": "wpilib.interfaces.Accelerometer", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAccelerometer"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.Accelerometer.Range", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.Accelerometer.Range", "ENUM_VALUE": "kRange_16G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.Accelerometer.Range", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.Accelerometer.Range", "ENUM_VALUE": "kRange_2G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.Accelerometer.Range", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.Accelerometer.Range", "ENUM_VALUE": "kRange_4G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.interfaces.Accelerometer.Range", "importModule": "wpilib.interfaces"}, "fields": {"ENUM_TYPE": "wpilib.interfaces.Accelerometer.Range", "ENUM_VALUE": "kRange_8G"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
