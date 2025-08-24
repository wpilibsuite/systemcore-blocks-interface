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

import * as storageModule from './module';


export const CLASS_NAME_ROBOT = 'Robot';
export const CLASS_NAME_TELEOP = 'Teleop';

export const JSON_FILE_EXTENSION = '.json';
export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

const REGEX_PROJECT_NAME_PART = '[A-Z][A-Za-z0-9]*';
const REGEX_CLASS_NAME_PART = '[A-Z][A-Za-z0-9]*';
const REGEX_MODULE_TYPE_PART = '\.(robot|mechanism|opmode)';
const REGEX_MODULE_PATH = '^(' + REGEX_PROJECT_NAME_PART + ')/(' + REGEX_CLASS_NAME_PART + ')' +
    REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) + '$';
const REGEX_MODULE_PATH_TO_FILE_NAME = '^' + REGEX_PROJECT_NAME_PART + '/(' + REGEX_CLASS_NAME_PART +
    REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) + ')$';
const REGEX_FILE_NAME = '^(' + REGEX_CLASS_NAME_PART + ')' +
    REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) + '$';

/**
 * Returns true if the given name is a valid class name.
 */
export function isValidClassName(name: string): boolean {
  if (name) {
    return new RegExp('^' + REGEX_CLASS_NAME_PART + '$').test(name);
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
 * Returns the module path regex pattern for modules in the given project.
 */
export function makeModulePathRegexPattern(projectName: string): string {
  return '^' + escapeRegExp(projectName) + '/' + REGEX_CLASS_NAME_PART +
      REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) + '$';
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns the module path for the given project name and class name.
 */
export function makeModulePath(
    projectName: string, className: string, moduleType: storageModule.ModuleType): string {
  return projectName + '/' + className + '.' + moduleType + JSON_FILE_EXTENSION;
}

/**
 * Returns the robot module path for the given project names.
 */
export function makeRobotPath(projectName: string): string {
  return makeModulePath(projectName, CLASS_NAME_ROBOT, storageModule.ModuleType.ROBOT);
}

/**
 * Returns the project name for given module path.
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
 * Returns the file name for given module path.
 */
export function getFileName(modulePath: string): string {
  const regex = new RegExp(REGEX_MODULE_PATH_TO_FILE_NAME);
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the project name from "' + modulePath + '"');
  }
  return result[1];
}

/**
 * Returns the class name for given module path or file name.
 */
export function getClassName(modulePathOrFileName: string): string {
  let regex = new RegExp(REGEX_MODULE_PATH);
  let result = regex.exec(modulePathOrFileName);
  if (result) {
    return result[2];
  }
  regex = new RegExp(REGEX_FILE_NAME);
  result = regex.exec(modulePathOrFileName);
  if (result) {
    return result[1];
  }
  throw new Error('Unable to extract the class name from "' + modulePathOrFileName + '"');
}

/**
 * Returns the module type for given module path or file name.
 */
export function getModuleType(modulePathOrFileName: string): storageModule.ModuleType {
  let regex = new RegExp(REGEX_MODULE_PATH);
  let result = regex.exec(modulePathOrFileName);
  if (result) {
    return storageModule.stringToModuleType(result[3]);
  }
  regex = new RegExp(REGEX_FILE_NAME);
  result = regex.exec(modulePathOrFileName);
  if (result) {
    return storageModule.stringToModuleType(result[2]);
  }
  throw new Error('Unable to extract the module type from "' + modulePathOrFileName + '"');
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
