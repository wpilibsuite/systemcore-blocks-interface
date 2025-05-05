export const category =
{
    kind: 'category',
    name: 'Robot',
    contents: [
        {
            kind: 'category',
            name: 'drive',
            contents: [
                {
                    kind: 'block',
                    type: 'mrc_call_python_function',
                    extraState: {
                        functionKind: 'instance_component',
                        returnType: '',
                        args: [
                            {
                                name: 'forward_speed',
                                type: 'float',
                            },
                            {
                                name: 'strafe_right_speed',
                                type: 'float',
                            },
                            {
                                name: 'rotate_cw_speed',
                                type: 'float',
                            },
                        ],
                        tooltip: 'Drive (robot relative)',
                        importModule: '',
                        componentClassName: 'rev.ColorRangeSensor',
                        componentName: 'robot.drive',
                    },
                    fields: {
                        COMPONENT_NAME: 'robot.drive',
                        FUNC: 'drive_field_relative',
                    },
                    inputs: {},
                },
            ]
        },
        {
            kind: 'category',
            name: 'claw',
            contents: [
                {
                    kind: 'category',
                    name: 'gripper',
                    contents: [

                    ],
                },
                {
                    kind: 'category',
                    name: 'piece_sensor',
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
                                COMPONENT_NAME: 'robot.claw.piece_sensor',
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
                                COMPONENT_NAME: 'robot.claw.piece_sensor',
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
                                COMPONENT_NAME: 'robot.claw.piece_sensor',
                                FUNC: 'get_distance_mm',
                            },
                            inputs: {},
                        },
                    ],
                },
            ]
        },
        {
            kind: 'category',
            name: 'flywheel',
            contents: [

            ],
        },
        {
            kind: 'category',
            name: 'shooter',
            contents: [

            ],
        },
    ],
}