export const category =
{
    kind: 'category',
    name: 'Components',
    contents: [
        {
            kind: 'category',
            name: 'Rev Touch Sensor',
            contents: [ 
                // def is_pressed(self) -> bool:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "bool",
                        args: [
                            {
                                name: "revTouchSensor",
                                type: "wpilib.RevTouchSensor"
                            }
                        ],
                        tooltip: "Returns if the touch sensor is pressed or not",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.RevTouchSensor",
                        FUNC: 'is_pressed',
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "myRevTouchSensor"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "myRevTouchSensor"
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            kind: 'category',
            name: 'Smart Motor',
            contents: [ ]
        },
        {
            kind: 'category',
            name: 'Servo',
            contents: [ ]
        },
        {
            kind: 'category',
            name: 'Color Range Sensor',
            contents: [ ]
        },
        {
            kind: 'category',
            name: 'SparkFun LED Stick',
            contents: [
                // def set_color(self, position: int, color: wpilib.Color) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [
                            {
                                name: "sparkFunLEDStick",
                                type: "wpilib.SparkFunLEDStick"
                            },
                            {
                                name: "position",
                                type: "int"
                            },
                            {
                                name: "color",
                                type: ""
                            }
                        ],
                        tooltip: "Change the color of an individual LED.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "set_color"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        },
                        ARG1: {
                            block: {
                                type: "math_number",
                                fields: {
                                    NUM: 1
                                }
                            }
                        },
                        ARG2: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "class",
                                    moduleOrClassName: "wpilib.Color",
                                    varType: "wpilib.Color",
                                    importModule: "wpilib"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wpilib.Color",
                                    VAR: "kWhite"
                                }
                            }
                        }
                    }
                },
                // def set_color(self, color: wpilib.Color) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [{
                            name: "sparkFunLEDStick",
                            type: "wpilib.SparkFunLEDStick"
                        },
                        {
                            name: "color",
                            type: ""
                        }],
                        tooltip: "Change the color of all LEDs to a single color.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "set_color"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        },
                        ARG1: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "class",
                                    moduleOrClassName: "wpilib.Color",
                                    varType: "wpilib.Color",
                                    importModule: "wpilib"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wpilib.Color",
                                    VAR: "kWhite"
                                }
                            }
                        }
                    }
                },
                // def set_colors(self, colors: list[int]) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [
                            {
                                name: "sparkFunLEDStick",
                                type: "wpilib.SparkFunLEDStick"
                            },
                            {
                                name: "colors",
                                type: "list[int]"
                            }
                        ],
                        tooltip: "Change the color of all LEDs using a list.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "set_colors"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        },
                        ARG1: {
                            block: {
                                type: "variables_get",
                                fields: {
                                    VAR: {
                                        name: "myListOfColors"
                                    }
                                }
                            }
                        }
                    }
                },
                // def set_brightness(self, position: int, brightness: int) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [
                            {
                                name: "sparkFunLEDStick",
                                type: "wpilib.SparkFunLEDStick"
                            },
                            {
                                name: "position",
                                type: "int"
                            },
                            {
                                name: "brightness",
                                type: "int"
                            }
                        ],
                        tooltip: "Set the brightness of an individual LED.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "set_brightness"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        },
                        ARG1: {
                            block: {
                                type: "math_number",
                                fields: {
                                    NUM: 1
                                }
                            }
                        },
                        ARG2: {
                            block: {
                                type: "math_number",
                                fields: {
                                    NUM: 16
                                }
                            }
                        }
                    }
                },
                // def set_brightness(self, brightness: int) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [
                            {
                                name: "sparkFunLEDStick",
                                type: "wpilib.SparkFunLEDStick"
                            },
                            {
                                name: "brightness",
                                type: "int"
                            }
                        ],
                        tooltip: "Set the brightness of all LEDs.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "set_brightness"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        },
                        ARG1: {
                            block: {
                                type: "math_number",
                                fields: {
                                    NUM: 16
                                }
                            }
                        }
                    }
                },
                // def turn_all_off(self) -> None:
                {
                    kind: "block",
                    type: "mrc_call_python_function",
                    extraState: {
                        functionKind: "instance",
                        returnType: "None",
                        args: [
                            {
                                name: "sparkFunLEDStick",
                                type: "wpilib.SparkFunLEDStick"
                            }
                        ],
                        tooltip: "Turn all LEDs off.",
                        importModule: ""
                    },
                    fields: {
                        MODULE_OR_CLASS: "wpilib.SparkFunLEDStick",
                        FUNC: "turn_all_off"
                    },
                    inputs: {
                        ARG0: {
                            block: {
                                type: "mrc_get_python_variable",
                                extraState: {
                                    varKind: "module",
                                    moduleOrClassName: "wacky_wheeler",
                                    exportedVariable: true,
                                    importModule: "wacky_wheeler",
                                    actualVariableName: "mySparkFunLEDStick"
                                },
                                fields: {
                                    MODULE_OR_CLASS: "wacky_wheeler",
                                    VAR: "mySparkFunLEDStick"
                                }
                            }
                        }
                    }
                },
            ],
        }
    ],
}