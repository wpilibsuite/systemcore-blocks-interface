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


/**
 * Paths and file names for Blocks Projects
 *
 * All projects are stored in a directory called '/projects/'.
 *
 * Files in a project are stored in a subdirectory whose name is the project name. All files have
 * the extension '.json' and contain JSON text.
 *
 * Project information is stored in a file called 'project.info.json'.
 *
 * Modules
 * Files that contain blocks are called modules. During deployment, a Python file is created for
 * each module. Each Python file contains a Python class definition.
 * There are three types of modules:
 *     robot
 *     mechanism
 *     opmode
 * A project consists of:
 *     one project information file named 'project.info.json'
 *     one robot module, named 'Robot.robot.json'
 *     zero or more mechanisms, with the extension '.mechanism.json'
 *     zero or more opmodes, with the extension '.opmode.json'
 *
 * The file path of the project info file is /projects/<ProjectName>/project.info.json.
 * The file path of a module is /projects/<ProjectName>/<ClassName>.<ModuleType>.json.
 */

// The class name of the Robot module that is created automatically when a new project is created.
export const CLASS_NAME_ROBOT = 'Robot';

// The class name of the OpMode module that is created automatically when a new project is created.
export const CLASS_NAME_TELEOP = 'Teleop';

// The extension of all JSON files is .json.
const JSON_FILE_EXTENSION = '.json';

// The extension of a downloaded project is .blocks.
export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

// The file name of the project info file.
const PROJECT_INFO_FILE_NAME = 'project.info.json';

// A project name starts with an uppercase letter, followed by alphanumeric characters.
const REGEX_PROJECT_NAME_PART = '[A-Z][A-Za-z0-9]*';

// A module's class name starts with an uppercase letter, followed by alphanumeric characters.
const REGEX_CLASS_NAME_PART = '[A-Z][A-Za-z0-9]*';

// This regex is used to validate a class name
const REGEX_CLASS_NAME = '^' + REGEX_CLASS_NAME_PART + '$'

// The module type of a module path is either .robot, .mechanism, or .opmode.
const REGEX_MODULE_TYPE_PART = '\.(robot|mechanism|opmode)';

export const PROJECTS_DIRECTORY_PATH = '/projects/';

// This regex is used to extract the project name from a file path.
const REGEX_FILE_PATH = '^' + escapeRegExp(PROJECTS_DIRECTORY_PATH) +
    '(' + REGEX_PROJECT_NAME_PART + ')/.*' + escapeRegExp(JSON_FILE_EXTENSION) + '$';

// This regex is used to extract the class name from a module path.
const REGEX_MODULE_PATH = '^' + escapeRegExp(PROJECTS_DIRECTORY_PATH) +
    REGEX_PROJECT_NAME_PART + '/' +
    '(' + REGEX_CLASS_NAME_PART + ')' + REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) +
    '$';

// This regex is used to extract the class name from a module file name.
const REGEX_MODULE_FILE_NAME = '^(' + REGEX_CLASS_NAME_PART + ')' +
    REGEX_MODULE_TYPE_PART + escapeRegExp(JSON_FILE_EXTENSION) + '$';

/**
 * Returns true if the given name is a valid class name.
 */
export function isValidClassName(name: string): boolean {
  return new RegExp(REGEX_CLASS_NAME).test(name);
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
 * Escapes the given text so it can be used literally in a regular expression.
 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns the project directory path for the given project name.
 */
export function makeProjectDirectoryPath(projectName: string): string {
  return PROJECTS_DIRECTORY_PATH + projectName + '/';
}

/**
 * Returns the file path for the given project name and file name.
 */
export function makeFilePath(projectName: string, fileName: string): string {
  return makeProjectDirectoryPath(projectName) + fileName;
}

/**
 * Returns the project info path for the given project name.
 */
export function makeProjectInfoPath(projectName: string): string {
  return makeFilePath(projectName, PROJECT_INFO_FILE_NAME);
}

/**
 * Returns the module path for the given project name and class name.
 */
export function makeModulePath(
    projectName: string, className: string, moduleType: storageModule.ModuleType): string {
  return makeFilePath(projectName, className + '.' + moduleType + JSON_FILE_EXTENSION);
}

/**
 * Returns the robot module path for the given project name.
 */
export function makeRobotPath(projectName: string): string {
  return makeModulePath(projectName, CLASS_NAME_ROBOT, storageModule.ModuleType.ROBOT);
}

/**
 * Returns the project name for given file path.
 */
export function getProjectName(filePath: string): string {
  const regex = new RegExp(REGEX_FILE_PATH);
  const result = regex.exec(filePath)
  if (!result) {
    throw new Error('Unable to extract the project name from "' + filePath + '"');
  }
  return result[1];
}

/**
 * Returns true if the given file name is a valid module file name.
 */
export function isValidModuleFileName(fileName: string): boolean {
  return new RegExp(REGEX_MODULE_FILE_NAME).test(fileName);
}

/**
 * Returns true if the given file name is a valid project info file name.
 */
export function isValidProjectInfoFileName(fileName: string): boolean {
  if (fileName === PROJECT_INFO_FILE_NAME) {
    return true;
  }
  return false;
}


/**
 * Returns the class name for given module path or module file name.
 */
export function getClassName(modulePathOrModuleFileName: string): string {
  let regex = new RegExp(REGEX_MODULE_PATH);
  let result = regex.exec(modulePathOrModuleFileName);
  if (result) {
    return result[1];
  }
  regex = new RegExp(REGEX_MODULE_FILE_NAME);
  result = regex.exec(modulePathOrModuleFileName);
  if (result) {
    return result[1];
  }
  throw new Error('Unable to extract the class name from "' + modulePathOrModuleFileName + '"');
}

/**
 * Returns the module type for given module path or module file name.
 */
export function getModuleType(modulePathOrModuleFileName: string): storageModule.ModuleType {
  let regex = new RegExp(REGEX_MODULE_PATH);
  let result = regex.exec(modulePathOrModuleFileName);
  if (result) {
    return storageModule.stringToModuleType(result[2]);
  }
  regex = new RegExp(REGEX_MODULE_FILE_NAME);
  result = regex.exec(modulePathOrModuleFileName);
  if (result) {
    return storageModule.stringToModuleType(result[2]);
  }
  throw new Error('Unable to extract the module type from "' + modulePathOrModuleFileName + '"');
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
