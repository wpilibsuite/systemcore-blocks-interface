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
 * @fileoverview SmartMotor hardware component definitions.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as ToolboxItems from '../items';

export const TYPE_NAME = 'SmartMotor';

/**
 * Returns a component definition block for a smart motor.
 */
export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
  return {
    kind: 'block',
    type: 'mrc_component',
    fields: {
      NAME: 'my_motor',
      TYPE: 'SmartMotor',
    },
    extraState: {
      importModule: 'smart_motor',
      params: [{name: 'motor_port', type: 'int'}],
      hideParams,
    },
    ...(hideParams ? {} : {
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 1,
            },
          },
        },
      },
    }),
  };
}

/**
 * Returns the blocks available for a smart motor component.
 */
export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
  return [
    // Event: on_stall
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
    // Method: set_speed(speed: float) -> None
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
        componentName,
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
    // Method: set_angle_degrees(angle: float) -> None
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
        componentName,
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
    // Method: get_num_relative_encoder_ticks() -> int
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'get_num_relative_encoder_ticks',
      },
      inputs: {},
    },
    // Method: get_angle_degrees() -> float
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'get_angle_degrees',
      },
      inputs: {},
    },
    // Method: reset_relative_encoder() -> None
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'reset_relative_encoder',
      },
      inputs: {},
    },
  ];
}