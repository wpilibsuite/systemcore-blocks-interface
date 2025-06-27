export const category =
{
    kind: 'category',
    name: 'Components',
    contents: [
        {
            kind: 'category',
            name: 'REV Color Range Sensor',
            contents: [
                // def get_color_rgb(self) -> tuple[int, int, int]:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'tuple[int, int, int]',
                        args: [],
                        tooltip: 'Get the color in rgb (red, green, blue).',
                        importModule: '',
                        componentClassName: 'rev.ColorRangeSensor',
                        componentName: 'colorSensor',
                    },
                    fields: {
                        COMPONENT_NAME: 'colorSensor',
                        FUNC: 'get_color_rgb',
                    },
                    inputs: {},
                },
                // def get_color_hsv(self) -> tuple[int, int, int]:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'tuple[int, int, int]',
                        args: [],
                        tooltip: 'Get the color in hsv (hue, saturation, value).',
                        importModule: '',
                        componentClassName: 'rev.ColorRangeSensor',
                        componentName: 'colorSensor',
                    },
                    fields: {
                        COMPONENT_NAME: 'colorSensor',
                        FUNC: 'get_color_hsv',
                    },
                    inputs: {},
                },
                // def get_distance_mm(self) -> float:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'float',
                        args: [],
                        tooltip: 'Get the distance of the object seen.',
                        importModule: '',
                        componentClassName: 'rev.ColorRangeSensor',
                        componentName: 'colorSensor',
                    },
                    fields: {
                        COMPONENT_NAME: 'colorSensor',
                        FUNC: 'get_distance_mm',
                    },
                    inputs: {},
                },
            ],
        },
        
  
        {
            kind: 'category',
            name: 'SparkFun LED Stick',
            contents: [
                // def set_color(self, position: int, color: wpilib.Color) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'position',
                                type: 'int',
                            },
                            {
                                name: 'color',
                                type: 'wpilib.Color',
                            },
                        ],
                        tooltip: 'Change the color of an individual LED.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'set_color',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 1,
                                },
                            },
                        },
                        ARG1: {
                            block: {
                                type: 'mrc_get_python_variable',
                                extraState: {
                                    varKind: 'class',
                                    moduleOrClassName: 'wpilib.Color',
                                    varType: 'wpilib.Color',
                                    importModule: 'wpilib',
                                },
                                fields: {
                                    MODULE_OR_CLASS: 'wpilib.Color',
                                    VAR: 'kWhite',
                                },
                            },
                        },
                    },
                },
                // def set_color(self, color: wpilib.Color) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'color',
                                type: 'wpilib.Color',
                            },
                        ],
                        tooltip: 'Change the color of all LEDs to a single color.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'set_color',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'mrc_get_python_variable',
                                extraState: {
                                    varKind: 'class',
                                    moduleOrClassName: 'wpilib.Color',
                                    varType: 'wpilib.Color',
                                    importModule: 'wpilib',
                                },
                                fields: {
                                    MODULE_OR_CLASS: 'wpilib.Color',
                                    VAR: 'kWhite',
                                },
                            },
                        },
                    },
                },
                // def set_colors(self, colors: list[int]) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'colors',
                                type: 'list[int]',
                            },
                        ],
                        tooltip: 'Change the color of all LEDs using a list.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'set_colors',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'variables_get',
                                fields: {
                                    VAR: {
                                        name: 'myListOfColors',
                                    },
                                },
                            },
                        },
                    },
                },
                // def set_brightness(self, position: int, brightness: int) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'position',
                                type: 'int',
                            },
                            {
                                name: 'brightness',
                                type: 'int',
                            },
                        ],
                        tooltip: 'Set the brightness of an individual LED.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'set_brightness',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 1,
                                },
                            },
                        },
                        ARG1: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 16,
                                },
                            },
                        },
                    },
                },
                // def set_brightness(self, brightness: int) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'brightness',
                                type: 'int',
                            }
                        ],
                        tooltip: 'Set the brightness of all LEDs.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'set_brightness',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 16,
                                },
                            },
                        },
                    },
                },
                // def turn_all_off(self) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [],
                        tooltip: 'Turn all LEDs off.',
                        importModule: '',
                        componentClassName: 'sparkfun.LEDStick',
                        componentName: 'ledStick',
                    },
                    fields: {
                        COMPONENT_NAME: 'ledStick',
                        FUNC: 'turn_all_off',
                    },
                    inputs: {},
                },
            ],
        }
    ],
}