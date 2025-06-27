import * as Blockly from 'blockly/core';
import * as ToolboxItems from '../items';

export const TYPE_NAME = 'TouchSensor';

export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
    return {
        kind: 'block',
        type: 'mrc_component',
        fields: {
            NAME: 'my_touch_sensor',
            TYPE: 'RevTouchSensor'
        },
        extraState: {
            importModule: 'rev_touch_sensor',
            params: [{ name: 'smartIO_port', type: 'int' }],
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
                SENDER: 'my_touch_sensor',
                EVENT_NAME: 'pressed',
            },
        },
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
                SENDER: 'my_touch_sensor',
                EVENT_NAME: 'released',
            },
        },
        {
            kind: 'block',
            type: 'mrc_event_handler',
            extraState: {
                tooltip: '',
                pathOfSender: '',
                typeOfSender: 'component',
                params: [
                    {
                        name: 'new_state',
                        type: 'boolean',
                    },
                ],
            },
            fields: {
                SENDER: 'my_touch_sensor',
                EVENT_NAME: 'changed',
            },
        },
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
                FUNC: 'is_pressed',
            },
            inputs: {},
        },
    ];
}
