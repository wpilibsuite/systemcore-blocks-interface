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

export const CLASS_NAME_ROBOT = 'Robot';
export const CLASS_NAME_TELEOP = 'Teleop';

export const JSON_FILE_EXTENSION = '.json';
export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

/**
 * Regular expression to extract the project name and the class name from a module path.
 */
const REGEX_MODULE_PATH = '^([A-Za-z_][A-Za-z0-9_]*)/([A-Za-z_][A-Za-z0-9_]*).json$';

/**
 * Returns true if the given name is a valid class name.
 */
export function isValidClassName(name: string): boolean {
  if (name) {
    return /^[A-Z][A-Za-z0-9]*$/.test(name);
  }
  return false;
}

/**
 * Returns the snake_case name for the given PascalCase name.
 */
export function pascalCaseToSnakeCase(pascalCaseName: string): string {
  let snakeCaseName = '';
  for (let i = 0; i < pascalCaseName.length; i++) {
    const char = pascalCaseName.charAt(i);
    if (char >= 'A' && char <= 'Z') {
      if (i > 0) {
        snakeCaseName += '_';
      }
      snakeCaseName += char.toLowerCase();
    } else {
      snakeCaseName += char;
    }
  }
  return snakeCaseName;
}

/**
 * Returns the PascalCase name for the given snake_case name.
 */
export function snakeCaseToPascalCase(snakeCaseName: string): string {
  let pascalCaseName = '';
  let nextCharUpper = true;
  for (let i = 0; i < snakeCaseName.length; i++) {
    const char = snakeCaseName.charAt(i);
    if (char !== '_') {
      pascalCaseName += nextCharUpper ? char.toUpperCase() : char;
    }
    nextCharUpper = (char === '_');
  }
  return pascalCaseName;
}

/**
 * Returns the module path for the given project name and class name.
 */
export function makeModulePath(projectName: string, className: string): string {
  return projectName + '/' + className + JSON_FILE_EXTENSION;;
}

/**
 * Returns the robot module path for the given project names.
 */
export function makeRobotPath(projectName: string): string {
  return makeModulePath(projectName, CLASS_NAME_ROBOT);
}

/**
 * Returns the project path for given module path.
 */
export function getProjectName(modulePath: string): string {
  const regex = new RegExp(REGEX_MODULE_PATH);
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the project name from "' + modulePath + '"');
  }
  return result[1];
}

/**
 * Returns the class name for given module path.
 */
export function getClassName(modulePath: string): string {
  const regex = new RegExp(REGEX_MODULE_PATH);
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the class name from "' + modulePath + '"');
  }
  return result[2];
}

/**
 * Makes a unique name given a list of existing names
 */
export function makeUniqueName(preferredName: string, existingNames: string[]): string {
  let name = preferredName; // No suffix.
  let suffix = 0;
  while (true) {
    let nameClash = false;
    for (const existingName of existingNames) {
      if (name == existingName) {
        nameClash = true;
        break;
      }
    }
    if (!nameClash) {
      return name;
    }
    suffix++;
    name = preferredName + suffix;
  }
}
