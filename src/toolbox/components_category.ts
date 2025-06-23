/**
 * @license
 * Copyright 2025 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */

/**
 * TODO: This is all fake right now, it will be generated dynamically
 * based on the components that are available in the current module.
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import * as commonStorage from '../storage/common_storage';
import { MRC_CATEGORY_STYLE_COMPONENTS } from '../themes/styles';

const CUSTOM_CATEGORY_COMPONENTS = 'COMPONENTS';

export const category = {
    kind: 'category',
    categorystyle: MRC_CATEGORY_STYLE_COMPONENTS,
    name: 'Hardware',
    contents: [
        {
            kind: 'category',
            name: 'my_motor',
            custom: CUSTOM_CATEGORY_COMPONENTS,
            componentConfig: {
                name: 'my_motor',
                type: 'rev.SmartMotor',
            }
        },
        {
            kind: 'category',
            name: 'my_touch_sensor',
            custom: CUSTOM_CATEGORY_COMPONENTS,
            componentConfig: {
                name: 'my_touch_sensor',
                type: 'rev.TouchSensor',
            }
        },
        {
            kind: 'category',
            name: 'New',
            contents: [
                {
                    kind: 'label',
                    text: 'Components',
                },
                {
                    kind: 'block',
                    type: 'mrc_component',
                    fields: {
                        NAME: 'my_motor',
                        TYPE: 'SmartMotor'
                    },
                    extraState: {
                        importModule: 'smart_motor',
                        params: [{ name: 'motor_port', type: 'int' }],
                        hideParams: true
                    },
                },
                {
                    kind: 'block',
                    type: 'mrc_component',
                    fields: {
                        NAME: 'my_color_range_sensor',
                        TYPE: 'ColorRangeSensor'
                    },
                    extraState: {
                        importModule: 'color_range_sensor',
                        params: [{ name: 'i2c_port', type: 'int' }],
                        hideParams: true
                    },
                },
                {
                    kind: 'block',
                    type: 'mrc_component',
                    fields: {
                        NAME: 'my_touch_sensor',
                        TYPE: 'RevTouchSensor'
                    },
                    extraState: {
                        importModule: 'rev_touch_sensor',
                        params: [{ name: 'smartIO_port', type: 'int' }],
                        hideParams: true
                    },
                },
            ]
        },]
};


export class ComponentsCategory {
    private currentModule: commonStorage.Module | null = null;


    constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
        blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_COMPONENTS, this.componentsFlyout.bind(this));
    }

    public setCurrentModule(currentModule: commonStorage.Module | null) {
        this.currentModule = currentModule;
    }

    public componentsFlyout(workspace: Blockly.WorkspaceSvg) {
        const contents: toolboxItems.ContentsType[] = [];

        contents.push(
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
                    SENDER: 'my_motor',
                    EVENT_NAME: 'on_stall',
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
                    EVENT_NAME: 'on_change',
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
                    EVENT_NAME: 'on_pressed',
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
                    EVENT_NAME: 'on_released',
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
                    componentName: 'my_motor',
                },
                fields: {
                    COMPONENT_NAME: 'my_motor',
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
            {
                kind: 'block',
                type: 'mrc_call_python_function',
                extraState: {
                    functionKind: 'instance_component',
                    returnType: 'None',
                    args: [
                    ],
                    tooltip: 'Stop the motor',
                    importModule: '',
                    componentClassName: 'rev.SmartMotor',
                    componentName: 'my_motor',
                },
                fields: {
                    COMPONENT_NAME: 'my_motor',
                    FUNC: 'stop',
                },
            },
        );

        const toolboxInfo = {
            contents: contents,
        };

        return toolboxInfo;
    }
}