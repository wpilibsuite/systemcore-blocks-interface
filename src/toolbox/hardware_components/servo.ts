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
 * @fileoverview Servo hardware component definitions.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

import * as ToolboxItems from '../items';

export const TYPE_NAME = 'Servo';

/**
 * Returns a component definition block for a servo.
 */
export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
  return {
    kind: 'block',
    type: 'mrc_component',
    fields: {
      NAME: 'my_servo',
      TYPE: 'RevServo',
    },
    extraState: {
      importModule: 'rev_servo',
      params: [{name: 'servo_port', type: 'int'}],
      hideParams,
    },
    ...(hideParams ? {} : {
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartIO',
              PORT_NUM: 1,
            },
          },
        },
      },
    }),
  };
}

/**
 * Returns the blocks available for a servo component.
 */
export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
  return [
    // Method: set_position(pos: float) -> None
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
        componentName,
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
        tooltip: 'Set the servo to an angle between 0 and 270.',
        importModule: '',
        componentClassName: 'rev.Servo',
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
  ];
}
