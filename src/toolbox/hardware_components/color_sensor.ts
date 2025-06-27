import * as Blockly from 'blockly/core';
import * as ToolboxItems from '../items';

export const TYPE_NAME = 'ColorRangeSensor';

export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
    return {
        kind: 'block',
        type: 'mrc_component',
        fields: {
            NAME: 'my_color_range_sensor',
            TYPE: 'ColorRangeSensor'
        },
        extraState: {
            importModule: 'rev_color_range_sensor',
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
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
                componentName: componentName,
            },
            fields: {
                COMPONENT_NAME: componentName,
                FUNC: 'get_distance_mm',
            },
            inputs: {},
        },

    ];
}