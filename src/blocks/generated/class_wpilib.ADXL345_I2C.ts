// This file was generated. Do not edit!

import * as pythonEnum from "../python_enum";
import * as pythonVariable from "../python_variable";
import {Category} from "../../toolbox/items";

// Blocks for class wpilib.ADXL345_I2C

export function initialize() {
  pythonVariable.initializeClassVariableGetter("wpilib.ADXL345_I2C", "int", ["kAddress"], []);
  pythonEnum.initializeEnum("wpilib.ADXL345_I2C.Axes", ["kAxis_X", "kAxis_Y", "kAxis_Z"], "Accelerometer axes.\n\nMembers:\n\n  kAxis_X : X axis.\n\n  kAxis_Y : Y axis.\n\n  kAxis_Z : Z axis.");
  pythonEnum.initializeEnum("wpilib.ADXL345_I2C.Range", ["kRange_16G", "kRange_2G", "kRange_4G", "kRange_8G"], "Accelerometer range.\n\nMembers:\n\n  kRange_2G : 2 Gs max.\n\n  kRange_4G : 4 Gs max.\n\n  kRange_8G : 8 Gs max.\n\n  kRange_16G : 16 Gs max.");
}

export function getToolboxCategory(subcategories: any): Category {
  const category = {
    kind: "category",
    name: "ADXL345_I2C",
    contents: [
      {"kind": "block", "type": "get_python_class_variable", "extraState": {"varType": "int", "key": "class wpilib.ADXL345_I2C int", "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "VAR": "kAddress"}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myADXL345_I2C"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs the ADXL345 Accelerometer over I2C.\n\n:param port:          The I2C port the accelerometer is attached to\n:param range:         The range (+ or -) that the accelerometer will measure\n:param deviceAddress: The I2C address of the accelerometer (0x1D or 0x53)", "returnType": "wpilib._wpilib.ADXL345_I2C", "args": [{"name": "port", "type": "wpilib._wpilib.I2C.Port"}, {"name": "range", "type": "wpilib._wpilib.ADXL345_I2C.Range"}, {"name": "deviceAddress", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.ADXL345_I2C"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myPort"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}, "ARG2": {"shadow": {"type": "math_number", "fields": {"NUM": 29.0}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the acceleration of one axis in Gs.\n\n:param axis: The axis to read from.\n\n:returns: Acceleration of the ADXL345 in Gs.", "returnType": "float", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}, {"name": "axis", "type": "wpilib._wpilib.ADXL345_I2C.Axes"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getAcceleration"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAxes"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAllAxes"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the acceleration of all axes in Gs.\n\n:returns: An object containing the acceleration measured on each axis of the\n          ADXL345 in Gs.", "returnType": "wpilib._wpilib.ADXL345_I2C.AllAxes", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getAccelerations"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "int", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getI2CDeviceAddress"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myPort"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "wpilib._wpilib.I2C.Port", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getI2CPort"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the acceleration along the X axis in g-forces.\n\n:returns: The acceleration along the X axis in g-forces.", "returnType": "float", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getX"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the acceleration along the Y axis in g-forces.\n\n:returns: The acceleration along the Y axis in g-forces.", "returnType": "float", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getY"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Returns the acceleration along the Z axis in g-forces.\n\n:returns: The acceleration along the Z axis in g-forces.", "returnType": "float", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "getZ"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "", "returnType": "None", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}, {"name": "builder", "type": "ntcore._ntcore.NTSendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myNTSendableBuilder"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the measuring range of the accelerometer.\n\n:param range: The maximum acceleration, positive or negative, that the\n              accelerometer will measure.", "returnType": "None", "args": [{"name": "aDXL345_I2C", "type": "wpilib._wpilib.ADXL345_I2C"}, {"name": "range", "type": "wpilib._wpilib.ADXL345_I2C.Range"}], "importModule": ""}, "fields": {"CLASS": "wpilib.ADXL345_I2C", "FUNC": "setRange"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myADXL345_I2C"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRange"}}}}}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Axes", "ENUM_VALUE": "kAxis_X"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Axes", "ENUM_VALUE": "kAxis_Y"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Axes", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Axes", "ENUM_VALUE": "kAxis_Z"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Range", "ENUM_VALUE": "kRange_16G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Range", "ENUM_VALUE": "kRange_2G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Range", "ENUM_VALUE": "kRange_4G"}},
      {"kind": "block", "type": "get_python_enum_value", "extraState": {"enumType": "wpilib.ADXL345_I2C.Range", "importModule": "wpilib"}, "fields": {"ENUM_TYPE": "wpilib.ADXL345_I2C.Range", "ENUM_VALUE": "kRange_8G"}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
