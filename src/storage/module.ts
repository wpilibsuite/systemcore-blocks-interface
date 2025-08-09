/**
 * @license
 * Copyright 2024 Google LLC
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

// TODO(lizlooney): Make a ModuleType enum.
export const MODULE_TYPE_UNKNOWN = 'unknown';
export const MODULE_TYPE_ROBOT = 'robot';
export const MODULE_TYPE_MECHANISM = 'mechanism';
export const MODULE_TYPE_OPMODE = 'opmode';

export type Module = {
  // TODO(lizlooney): Add a uuid so we can keep track of mechanisms in the robot even if the user renames the mechamism
  modulePath: string,
  moduleType: string,
  projectName: string, // For example, WackyWheelerRobot
  className: string,   // For example, GamePieceShooter.
  dateModifiedMillis: number,
};

export type Robot = Module;
export type Mechanism = Module;
export type OpMode = Module;

