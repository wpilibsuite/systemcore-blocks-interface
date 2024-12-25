// This file was generated. Do not edit!

// Blocks for class wpilib.DutyCycle

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "DutyCycle",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myDutyCycle"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a DutyCycle input from a DigitalSource input.\n\nThis class does not own the inputted source.\n\n:param source: The DigitalSource to use.", "returnType": "wpilib._wpilib.DutyCycle", "args": [{"name": "source", "type": "wpilib._wpilib.DigitalSource"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.DutyCycle"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDigitalSource"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the FPGA index for the DutyCycle.\n\n:returns: the FPGA index", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DutyCycle", "FUNC": "getFPGAIndex"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the frequency of the duty cycle signal.\n\n:returns: frequency in Hertz", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DutyCycle", "FUNC": "getFrequency"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the raw high time of the duty cycle signal.\n\n:returns: high time of last pulse", "returnType": "wpimath.units.seconds", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DutyCycle", "FUNC": "getHighTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the output ratio of the duty cycle signal.\n\n0 means always low, 1 means always high.\n\n:returns: output ratio between 0 and 1", "returnType": "float", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DutyCycle", "FUNC": "getOutput"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the channel of the source.\n\n:returns: the source channel", "returnType": "int", "args": [{"name": "dutyCycle", "type": "wpilib._wpilib.DutyCycle"}], "importModule": ""}, "fields": {"CLASS": "wpilib.DutyCycle", "FUNC": "getSourceChannel"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myDutyCycle"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Initializes this Sendable object.\n\n:param builder: sendable builder", "returnType": "None", "args": [{"name": "sendable", "type": "wpiutil._wpiutil.Sendable"}, {"name": "builder", "type": "wpiutil._wpiutil.SendableBuilder"}], "importModule": ""}, "fields": {"CLASS": "wpiutil.Sendable", "FUNC": "initSendable"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendable"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "mySendableBuilder"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
