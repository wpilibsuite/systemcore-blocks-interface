// This file was generated. Do not edit!

// Blocks for class wpilib.simulation.AnalogEncoderSim

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "AnalogEncoderSim",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs from an AnalogEncoder object.\n\n:param encoder: AnalogEncoder to simulate", "returnType": "wpilib.simulation._simulation.AnalogEncoderSim", "args": [{"name": "encoder", "type": "wpilib._wpilib.AnalogEncoder"}], "importModule": "wpilib.simulation"}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoder"}}}}}}}}},
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myRotation2d"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the position as a Rotation2d.", "returnType": "wpimath.geometry._geometry.Rotation2d", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "getPosition"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Get the simulated position.", "returnType": "wpimath.units.turns", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "getTurns"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the position using an Rotation2d.\n\n:param angle: The angle.", "returnType": "None", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}, {"name": "angle", "type": "wpimath.geometry._geometry.Rotation2d"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "setPosition"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myRotation2d"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Set the position of the encoder.\n\n:param turns: The position.", "returnType": "None", "args": [{"name": "analogEncoderSim", "type": "wpilib.simulation._simulation.AnalogEncoderSim"}, {"name": "turns", "type": "wpimath.units.turns"}], "importModule": ""}, "fields": {"CLASS": "wpilib.simulation.AnalogEncoderSim", "FUNC": "setTurns"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAnalogEncoderSim"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
