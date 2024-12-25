// This file was generated. Do not edit!

// Blocks for class wpilib.AddressableLED

export function getToolboxCategory(subcategories) {
  const category = {
    kind: "category",
    name: "AddressableLED",
    contents: [
      {"kind": "block", "type": "variables_set", "fields": {"VAR": {"name": "myAddressableLED"}}, "inputs": {"VALUE": {"block": {"kind": "block", "type": "call_python_constructor", "extraState": {"tooltip": "Constructs a new driver for a specific port.\n\n:param port: the output port to use (Must be a PWM header)", "returnType": "wpilib._wpilib.AddressableLED", "args": [{"name": "port", "type": "int"}], "importModule": "wpilib"}, "fields": {"CLASS": "wpilib.AddressableLED"}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the bit timing.\n\nBy default, the driver is set up to drive WS2812Bs, so nothing needs to\nbe set for those.\n\n:param highTime0: high time for 0 bit (default 400ns)\n:param lowTime0:  low time for 0 bit (default 900ns)\n:param highTime1: high time for 1 bit (default 900ns)\n:param lowTime1:  low time for 1 bit (default 600ns)", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}, {"name": "highTime0", "type": "wpimath.units.nanoseconds"}, {"name": "lowTime0", "type": "wpimath.units.nanoseconds"}, {"name": "highTime1", "type": "wpimath.units.nanoseconds"}, {"name": "lowTime1", "type": "wpimath.units.nanoseconds"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "setBitTiming"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the led output data.\n\nIf the output is enabled, this will start writing the next data cycle.\nIt is safe to call, even while output is enabled.\n\n:param ledData: the buffer to write", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}, {"name": "ledData", "type": "List[wpilib._wpilib.AddressableLED.LEDData]"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "setData"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}, "ARG1": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myLEDData]"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the length of the LED strip.\n\nCalling this is an expensive call, so its best to call it once, then\njust update data.\n\nThe max length is 5460 LEDs.\n\n:param length: the strip length", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}, {"name": "length", "type": "int"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "setLength"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Sets the sync time.\n\nThe sync time is the time to hold output so LEDs enable. Default set for\nWS2812B.\n\n:param syncTime: the sync time (default 280us)", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}, {"name": "syncTime", "type": "wpimath.units.microseconds"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "setSyncTime"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Starts the output.\n\nThe output writes continuously.", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "start"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}}},
      {"kind": "block", "type": "call_python_instance_method", "extraState": {"tooltip": "Stops the output.", "returnType": "None", "args": [{"name": "addressableLED", "type": "wpilib._wpilib.AddressableLED"}], "importModule": ""}, "fields": {"CLASS": "wpilib.AddressableLED", "FUNC": "stop"}, "inputs": {"ARG0": {"block": {"type": "variables_get", "fields": {"VAR": {"name": "myAddressableLED"}}}}}},
    ],
  };
  if (subcategories) {
    category.contents.push(...subcategories);
  }
  return category;
}
