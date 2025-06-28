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
 * @fileoverview Color range sensor hardware component definitions.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as ToolboxItems from '../items';

export const TYPE_NAME = 'ColorRangeSensor';

/**
 * Returns a component definition block for a color range sensor.
 */
export function getDefinitionBlock(hideParams: boolean): ToolboxItems.ContentsType {
  return {
    kind: 'block',
    type: 'mrc_component',
    fields: {
      NAME: 'my_color_range_sensor',
      TYPE: TYPE_NAME,
    },
    extraState: {
      importModule: 'rev_color_range_sensor',
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
 * Returns the blocks available for a color range sensor component.
 */
export function getBlocks(componentName: string): ToolboxItems.ContentsType[] {
  return [
    // Method: get_color_rgb() -> tuple[int, int, int]
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'get_color_rgb',
      },
      inputs: {},
    },
    // Method: get_color_hsv() -> tuple[int, int, int]
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'get_color_hsv',
      },
      inputs: {},
    },
    // Method: get_distance_mm() -> float
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
        componentName,
      },
      fields: {
        COMPONENT_NAME: componentName,
        FUNC: 'get_distance_mm',
      },
      inputs: {},
    },
  ];
}