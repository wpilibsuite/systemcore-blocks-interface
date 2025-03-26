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
            name: 'REV Servo',
            contents: [
                // def set_position(self, pos: float) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'pos',
                                type: 'float',
                            },
                        ],
                        tooltip: 'Set the servo to a position between 0 and 1.',
                        importModule: '',
                        componentClassName: 'rev.Servo',
                        componentName: 'clawServo',
                    },
                    fields: {
                        COMPONENT_NAME: 'clawServo',
                        FUNC: 'set_position',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 0.5,
                                },
                            },
                        },
                    },
                },
                // def set_angle_degrees(self, angle: float) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'angle',
                                type: 'float',
                            },
                        ],
                        tooltip: 'Set the servo to an angle between 0 and 270.',
                        importModule: '',
                        componentClassName: 'rev.Servo',
                        componentName: 'clawServo',
                    },
                    fields: {
                        COMPONENT_NAME: 'clawServo',
                        FUNC: 'set_angle_degrees',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 180,
                                },
                            },
                        },
                    },
                },
            ],
        },
        {
            kind: 'category',
            name: 'REV Smart Motor',
            contents: [
                // def set_speed(self, speed: float) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'speed',
                                type: 'float',
                            },
                        ],
                        tooltip: 'Set the motor to a speed between -1 and 1.',
                        importModule: '',
                        componentClassName: 'rev.SmartMotor',
                        componentName: 'leftMotor',
                    },
                    fields: {
                        COMPONENT_NAME: 'leftMotor',
                        FUNC: 'set_speed',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 0.8,
                                },
                            },
                        },
                    },
                },
                // def set_angle_degrees(self, angle: float) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [
                            {
                                name: 'angle',
                                type: 'float',
                            },
                        ],
                        tooltip: 'Set the motor to an angle between 0 and 360.',
                        importModule: '',
                        componentClassName: 'rev.SmartMotor',
                        componentName: 'leftMotor',
                    },
                    fields: {
                        COMPONENT_NAME: 'leftMotor',
                        FUNC: 'set_angle_degrees',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: 'math_number',
                                fields: {
                                    NUM: 180,
                                },
                            },
                        },
                    },
                },
                // def get_num_relative_encoder_ticks(self) -> int:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'int',
                        args: [],
                        tooltip: 'Get the number of relative motor ticks since reset of encoder.',
                        importModule: '',
                        componentClassName: 'rev.SmartMotor',
                        componentName: 'leftMotor',
                    },
                    fields: {
                        COMPONENT_NAME: 'leftMotor',
                        FUNC: 'get_num_relative_encoder_ticks',
                    },
                    inputs: {},
                },
                // def get_angle_degrees(self) -> float:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'float',
                        args: [],
                        tooltip: 'Get the angle position of the motor.',
                        importModule: '',
                        componentClassName: 'rev.SmartMotor',
                        componentName: 'leftMotor',
                    },
                    fields: {
                        COMPONENT_NAME: 'leftMotor',
                        FUNC: 'get_angle_degrees',
                    },
                    inputs: {},
                },
                // def reset_relative_encoder(self) -> None:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'None',
                        args: [],
                        tooltip: 'Reset the relative encoder value to 0.',
                        importModule: '',
                        componentClassName: 'rev.SmartMotor',
                        componentName: 'leftMotor',
                    },
                    fields: {
                        COMPONENT_NAME: 'leftMotor',
                        FUNC: 'reset_relative_encoder',
                    },
                    inputs: {},
                },
            ]
        },
        {
            kind: 'category',
            name: 'REV Touch Sensor',
            contents: [ 
                // def is_pressed(self) -> bool:
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: 'bool',
                        args: [],
                        tooltip: 'Return whether the touch sensor is pressed.',
                        importModule: '',
                        componentClassName: 'rev.TouchSensor',
                        componentName: 'frontTouch',
                    },
                    fields: {
                        COMPONENT_NAME: 'frontTouch',
                        FUNC: 'is_pressed',
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