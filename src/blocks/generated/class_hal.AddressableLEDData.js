// This file was generated. Do not edit!

import * as python from "../python.js"

// Blocks for class hal.AddressableLEDData

python.PythonVariableGetterNames["instance hal.AddressableLEDData int"] = ["b", "g", "r"];
python.PythonVariableGetterTooltips["instance hal.AddressableLEDData int"] = ["///< blue value", "///< green value", "///< red value"];
python.PythonVariableSetterNames["instance hal.AddressableLEDData int"] = ["b", "g", "r"];
python.PythonVariableSetterTooltips["instance hal.AddressableLEDData int"] = ["///< blue value", "///< green value", "///< red value"];


function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "AddressableLEDData",
    contents: [
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "b"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "g"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "get_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "set_python_instance_variable", "extraState": {"varType": "int", "key": "instance hal.AddressableLEDData int", "importModule": "", "selfLabel": "addressableLEDData", "selfType": "hal.AddressableLEDData"}, "fields": {"CLASS": "hal.AddressableLEDData", "VAR": "r"}, "inputs": {"SELF": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLEDData"}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAddressableLEDData"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "", "returnType": "hal._wpiHal.AddressableLEDData", "args": [], "importModule": "hal"}, "fields": {"CLASS": "hal.AddressableLEDData"}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}

export {getToolboxCategory}
