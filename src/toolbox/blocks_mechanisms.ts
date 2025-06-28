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
import * as ToolboxItems from './items';

/**
 * TODO: This is all fake right now, it will be generated dynamically
 * based on reading things from mechanisms.
 */

export function getAllPossibleMechanisms(): ToolboxItems.ContentsType[] {
    return [

        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'claw',
                TYPE: 'Claw'
            },
            extraState: {
                importModule: 'claw',
                params: [{ name: 'gripper_port', type: 'int' },
                { name: 'piece_sensor_port', type: 'int' },
                ]
            },
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
                ARG1: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartIO',
                            PORT_NUM: 1
                        },
                    },
                },
            }
        },
        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'drive',
                TYPE: 'DriveMecanum'
            },
            extraState: {
                importModule: 'DriveMecanum',
                params: [{ name: 'front_left_drive_port', type: 'int' },
                { name: 'front_right_drive_port', type: 'int' },
                { name: 'back_left_drive_port', type: 'int' },
                { name: 'back_right_drive_port', type: 'int' },
                ]
            },
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
                ARG1: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartMotor',
                            PORT_NUM: 2
                        },
                    },
                },
                ARG2: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartMotor',
                            PORT_NUM: 3
                        },
                    },
                },
                ARG3: {
                    shadow: {
                        type: 'mrc_port',
                        fields: {
                            TYPE: 'SmartMotor',
                            PORT_NUM: 4
                        },
                    },
                },
            }
        },
    ];
}

