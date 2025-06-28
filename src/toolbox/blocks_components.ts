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
 * @fileoverview Component blocks for the toolbox.
 */

import * as ToolboxItems from './items';
import * as ColorSensor from './hardware_components/color_sensor';
import * as SmartMotor from './hardware_components/smart_motor';
import * as Servo from './hardware_components/servo';
import * as TouchSensor from './hardware_components/touch_sensor';

const ALL_COMPONENTS: Record<string, (componentName: string) => ToolboxItems.ContentsType[]> = {
  [ColorSensor.TYPE_NAME]: ColorSensor.getBlocks,
  [SmartMotor.TYPE_NAME]: SmartMotor.getBlocks,
  [TouchSensor.TYPE_NAME]: TouchSensor.getBlocks,
  [Servo.TYPE_NAME]: Servo.getBlocks,
};

export function getAllPossibleComponents(hideParams: boolean): ToolboxItems.ContentsType[] {
  return [
    SmartMotor.getDefinitionBlock(hideParams),
    TouchSensor.getDefinitionBlock(hideParams),
    ColorSensor.getDefinitionBlock(hideParams),
    Servo.getDefinitionBlock(hideParams),
  ];
}

export function getBlocks(componentType: string, componentName: string): ToolboxItems.ContentsType[] {
  const getBlocksFunction = ALL_COMPONENTS[componentType];
  if (getBlocksFunction) {
    return getBlocksFunction(componentName);
  }
  return [];
}
