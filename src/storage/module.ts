/**
 * @license
 * Copyright 2025 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export enum ModuleType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  OPMODE = 'opmode',
}

export type Module = {
  modulePath: string,
  moduleType: ModuleType,
  moduleId: string,
  projectName: string, // For example, WackyWheelerRobot
  className: string,   // For example, GamePieceShooter.
  dateModifiedMillis: number,
};

export type Robot = Module;
export type Mechanism = Module;
export type OpMode = Module;


export function stringToModuleType(str: string): ModuleType {
  const moduleType = Object.values(ModuleType).find((value) => value == str);
  if (moduleType) {
    return moduleType;
  }
  throw new Error('Unable to convert string "' + str + '" to module type.');
}
