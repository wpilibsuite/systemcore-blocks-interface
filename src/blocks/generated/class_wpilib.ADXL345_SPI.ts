// This file was generated. Do not edit!

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as toolboxItems from "../../toolbox/items";

// Blocks for class wpilib.ADXL345_SPI

export function initialize() {
  pythonEnum.initializeEnum("wpilib.ADXL345_SPI.Axes", ["kAxis_X", "kAxis_Y", "kAxis_Z"], "Accelerometer axes.\n\nMembers:\n\n  kAxis_X : X axis.\n\n  kAxis_Y : Y axis.\n\n  kAxis_Z : Z axis.");
  pythonEnum.initializeEnum("wpilib.ADXL345_SPI.Range", ["kRange_16G", "kRange_2G", "kRange_4G", "kRange_8G"], "Accelerometer range.\n\nMembers:\n\n  kRange_2G : 2 Gs max.\n\n  kRange_4G : 4 Gs max.\n\n  kRange_8G : 8 Gs max.\n\n  kRange_16G : 16 Gs max.");
}

export function getToolboxCategory(subcategories: toolboxItems.Category[] = []): toolboxItems.Category {

  // There are 16 blocks.
  const contents: toolboxItems.ContentsType[] = [
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345_SPI"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "constructor", "returnType": "wpilib.ADXL345_SPI", "args": [{"name": "port", "type": "wpilib.SPI.Port"}, {"name": "range", "type": "wpilib.ADXL345_SPI.Range"}], "tooltip": "Constructor.\n\n:param port:  The SPI port the accelerometer is attached to\n:param range: The range (+ or -) that the accelerometer will measure", "importModule": "wpilib"}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPort"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}, {"name": "axis", "type": "wpilib.ADXL345_SPI.Axes"}], "tooltip": "Get the acceleration of one axis in Gs.\n\n:param axis: The axis to read from.\n\n:returns: Acceleration of the ADXL345 in Gs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAxes"}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.ADXL345_SPI.AllAxes", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}], "tooltip": "Get the acceleration of all axes in Gs.\n\n:returns: An object containing the acceleration measured on each axis of the\n          ADXL345 in Gs.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getAccelerations"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}}}}},
    {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPort"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "wpilib.SPI.Port", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getSpiPort"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}], "tooltip": "Returns the acceleration along the X axis in g-forces.\n\n:returns: The acceleration along the X axis in g-forces.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}], "tooltip": "Returns the acceleration along the Y axis in g-forces.\n\n:returns: The acceleration along the Y axis in g-forces.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "float", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}], "tooltip": "Returns the acceleration along the Z axis in g-forces.\n\n:returns: The acceleration along the Z axis in g-forces.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "getZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}, {"name": "builder", "type": "ntcore.NTSendableBuilder"}], "tooltip": "", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNTSendableBuilder"}}}}}},
    {"kind": "block", "type": "mrc_call_python_function", "extraState": {"functionKind": "instance", "returnType": "None", "args": [{"name": "aDXL345_SPI", "type": "wpilib.ADXL345_SPI"}, {"name": "range", "type": "wpilib.ADXL345_SPI.Range"}], "tooltip": "Set the measuring range of the accelerometer.\n\n:param range: The maximum acceleration, positive or negative, that the\n              accelerometer will measure.", "importModule": ""}, "fields": {"MODULE_OR_CLASS": "wpilib.ADXL345_SPI", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_SPI"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Axes", "ENUM_VALUE": "kAxis_X"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Axes", "ENUM_VALUE": "kAxis_Y"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Axes", "ENUM_VALUE": "kAxis_Z"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Range", "ENUM_VALUE": "kRange_16G"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Range", "ENUM_VALUE": "kRange_2G"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Range", "ENUM_VALUE": "kRange_4G"}},
    {"kind": "block", "type": "mrc_get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_SPI.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_SPI.Range", "ENUM_VALUE": "kRange_8G"}},
  ];

  contents.push(...subcategories);

  const category: toolboxItems.PythonClassCategory = {
    kind: "category",
    name:  "ADXL345_SPI",
    contents: contents,
    className: "wpilib.ADXL345_SPI",
  };

  return category;
}
