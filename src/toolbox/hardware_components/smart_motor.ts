import * as Blockly from 'blockly/core';
import * as ToolboxItems from '../items';

export const TYPE_NAME = 'SmartMotor';

export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
    return {
        kind: 'block',
        type: 'mrc_component',
        fields: {
            NAME: 'my_motor',
            TYPE: 'SmartMotor'
        },
        extraState: {
            importModule: 'smart_motor',
            params: [{ name: 'motor_port', type: 'int' }],
            hideParams: hideParams
        },
        ...(hideParams ? {} : {
            inputs: {
                ARG0: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartMotor',
                            PORT_NUM: 1
                        },
                    },
                },
            }
        })
    }
}

export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
    return [
        {
            kind: 'block',
            type: 'mrc_event_handler',
            extraState: {
                tooltip: '',
                pathOfSender: '',
                typeOfSender: 'component',
                params: [],
            },
            fields: {
                SENDER: componentName,
                EVENT_NAME: 'on_stall',
            },
        },        
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
                FUNC: 'reset_relative_encoder',
            },
            inputs: {},
        },
    ];
}