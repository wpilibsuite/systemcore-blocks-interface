import * as Blockly from 'blockly/core';
import * as ToolboxItems from '../items';

export const TYPE_NAME = 'Servo';

export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
    return {
        kind: 'block',
        type: 'mrc_component',
        fields: {
            NAME: 'my_servo',
            TYPE: 'RevServo'
        },
        extraState: {
            importModule: 'rev_servo',
            params: [{ name: 'servo_port', type: 'int' }],
            hideParams: hideParams
        },
        ...(hideParams ? {} : {
            inputs: {
                ARG0: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartIO',
                            PORT_NUM: 1
                        },
                    },
                },
            }
        })
    };
}

export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
    return [
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
    ];
}
