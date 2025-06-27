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
 * @fileoverview Touch Sensor hardware component definitions.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as ToolboxItems from '../items';

export const TYPE_NAME = 'TouchSensor';

/**
 * Returns a component definition block for a touch sensor.
 */
export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
  return {
    kind: 'block',
    type: 'mrc_component',
    fields: {
      NAME: 'my_touch_sensor',
      TYPE: 'RevTouchSensor',
    },
    extraState: {
      importModule: 'rev_touch_sensor',
      params: [{name: 'smartIO_port', type: 'int'}],
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
 * Returns the blocks available for a touch sensor component.
 */
export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
  return [
    // Event: pressed
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
    // Event: released
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
    // Event: changed with new_state parameter
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
    // Method: is_pressed() -> bool
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'is_pressed',
      },
      inputs: {},
    },
  ];
}
