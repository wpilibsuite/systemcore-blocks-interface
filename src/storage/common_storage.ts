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

import JSZip from 'jszip';

import * as Blockly from 'blockly/core';

import startingOpModeBlocks from '../modules/opmode_start.json';
import startingMechanismBlocks from '../modules/mechanism_start.json';
import startingRobotBlocks from '../modules/robot_start.json';

import { extendedPythonGenerator } from '../editor/extended_python_generator';
import { createGeneratorContext } from '../editor/generator_context';

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export type Module = {
  modulePath: string,
  moduleType: string,
  projectName: string,
  moduleName: string,
  dateModifiedMillis: number,
  className: string,
};

export type Robot = Module;
export type Mechanism = Module;
export type OpMode = Module;

export type Project = {
  projectName: string, // snake_case
  userVisibleName: string, // PascalCase
  robot: Robot,
  mechanisms: Mechanism[]
  opModes: OpMode[],
};

export type MethodArg = {
  name: string,
  type: string, // '' for an untyped arg.
};

export type Method = {
  blockId: string, // ID of the mrc_class_method_def block that defines the method.
  visibleName: string,
  pythonName: string,
  returnType: string, // 'None' for no return value, '' for an untyped return value.
  args: MethodArg[],
};

export type Component = {
  blockId: string, // ID of the mrc_component block that defines the component.
  name: string,
  className: string,
}

export const MODULE_TYPE_UNKNOWN = 'unknown';
export const MODULE_TYPE_ROBOT = 'robot';
export const MODULE_TYPE_MECHANISM = 'mechanism';
export const MODULE_TYPE_OPMODE = 'opmode';

export const ROBOT_CLASS_NAME = 'Robot';

const DELIMITER_PREFIX = 'BlocksContent';
const MARKER_BLOCKS_CONTENT = 'blocksContent: ';
const MARKER_METHODS = 'methods: ';
const MARKER_MODULE_TYPE = 'moduleType: ';
const MARKER_COMPONENTS = 'components: ';
const PARTS_INDEX_BLOCKS_CONTENT = 0;
const PARTS_INDEX_METHODS = 1;
const PARTS_INDEX_MODULE_TYPE = 2;
const PARTS_INDEX_COMPONENTS = 3;
const NUMBER_OF_PARTS = 4;

export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

export interface Storage {
  saveEntry(entryKey: string, entryValue: string): Promise<void>;
  fetchEntry(entryKey: string, defaultValue: string): Promise<string>;
  listProjects(): Promise<Project[]>;
  fetchModuleContent(modulePath: string): Promise<string>;
  createProject(projectName: string, robotContent: string): Promise<void>;
  createModule(moduleType: string, modulePath: string, moduleContent: string): Promise<void>;
  saveModule(modulePath: string, moduleContent: string): Promise<void>;
  renameProject(oldProjectName: string, newProjectName: string): Promise<void>;
  copyProject(oldProjectName: string, newProjectName: string): Promise<void>;
  renameModule(moduleType: string, projectName: string, oldModuleName: string, newModuleName: string): Promise<void>;
  copyModule(moduleType: string, projectName: string, oldModuleName: string, newModuleName: string): Promise<void>;
  deleteProject(projectName: string): Promise<void>;
  deleteModule(moduleType: string, modulePath: string): Promise<void>;
  downloadProject(projectName: string): Promise<string>;
  uploadProject(projectName: string, blobUrl: string): Promise<void>;
}

/**
 * Creates a new project.
 * @param storage The storage interface to use for creating the project.
 * @param proposedUserVisibleName The name for the new project.
 * @returns A promise that resolves when the project has been created.
 */
export async function createProject(
  storage: Storage, proposedUserVisibleName: string): Promise<void> {
  const newProjectName = pascalCaseToSnakeCase(proposedUserVisibleName);
  const robotContent = newRobotContent(newProjectName);
  await storage.createProject(newProjectName, robotContent);
}

/**
 * Renames a project.
 * @param storage The storage interface to use for renaming the project.
 * @param project The project to rename
 * @param proposedUserVisibleName The new name for the project.
 * @returns A promise that resolves when the project has been renamed.
 */
export async function renameProject(
  storage: Storage, project: Project, proposedUserVisibleName: string): Promise<void> {
  const newProjectName = pascalCaseToSnakeCase(proposedUserVisibleName);
  await storage.renameProject(project.projectName, newProjectName);
}

/**
 * Copies a project.
 * @param storage The storage interface to use for copying the project.
 * @param project The project to copy
 * @param proposedUserVisibleName The name for the new project.
 * @returns A promise that resolves when the project has been copied.
 */
export async function copyProject(
  storage: Storage, project: Project, proposedUserVisibleName: string): Promise<void> {
  const newProjectName = pascalCaseToSnakeCase(proposedUserVisibleName);
  await storage.copyProject(project.projectName, newProjectName);
}

/**
 * Deletes a project.
 * @param storage The storage interface to use for deleting the project.
 * @param project The project to delete.
 * @returns A promise that resolves when the project has been deleted.
 */
export async function deleteProject(
  storage: Storage, project: Project): Promise<void> {
  await storage.deleteProject(project.projectName);
}

/**
 * Adds a new module to the project.
 * @param storage The storage interface to use for creating the module.
 * @param project The project to add the module to.
 * @param moduleType The type of the module (e.g., 'mechanism', 'opmode').
 * @param newClassName The name of the class.
 */
export async function addModuleToProject(
  storage: Storage, project: Project, moduleType: string, newClassName: string): Promise<void> {
  let newModuleName = pascalCaseToSnakeCase(newClassName);
  let newModulePath = makeModulePath(project.projectName, newModuleName);

  if (moduleType === MODULE_TYPE_MECHANISM) {
    const mechanismContent = newMechanismContent(project.projectName, newModuleName);
    await storage.createModule(MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
    project.mechanisms.push({
      modulePath: newModulePath,
      moduleType: MODULE_TYPE_MECHANISM,
      projectName: project.projectName,
      moduleName: newModuleName,
      className: newClassName
    } as Mechanism);
  } else if (moduleType === MODULE_TYPE_OPMODE) {
    const opModeContent = newOpModeContent(project.projectName, newModuleName);
    await storage.createModule(MODULE_TYPE_OPMODE, newModulePath, opModeContent);
    project.opModes.push({
      modulePath: newModulePath,
      moduleType: MODULE_TYPE_OPMODE,
      projectName: project.projectName,
      moduleName: newModuleName,
      className: newClassName
    } as OpMode);
  }
}
/**
 * Removes a module from the project.
 * @param storage The storage interface to use for deleting the module.
 * @param project The project to remove the module from.
 * @param modulePath The path of the module to remove.
 */
export async function removeModuleFromProject(
  storage: Storage, project: Project, modulePath: string): Promise<void> {
  const module = findModuleByModulePath(project, modulePath);
  if (module) {
    if (module.moduleType == MODULE_TYPE_ROBOT) {
      throw new Error('Removing the robot module from the project is not allowed.');
    }
    await storage.deleteModule(module.moduleType, modulePath);
    if (module.moduleType === MODULE_TYPE_MECHANISM) {
      project.mechanisms = project.mechanisms.filter(m => m.modulePath !== modulePath);
    } else if (module.moduleType === MODULE_TYPE_OPMODE) {
      project.opModes = project.opModes.filter(o => o.modulePath !== modulePath);
    }
  }
}

/**
 * Renames a module in the project.
 * @param storage The storage interface to use for renaming the module.
 * @param project The project containing the module to rename.
 * @param proposedClassName The new class name for the module.
 * @param oldModulePath The current path of the module.
 * @returns A promise that resolves when the module has been renamed.
 */
export async function renameModuleInProject(
  storage: Storage, project: Project, proposedClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == MODULE_TYPE_ROBOT) {
      throw new Error('Renaming the robot module is not allowed.');
    }
    const newModuleName = pascalCaseToSnakeCase(proposedClassName);
    const newModulePath = makeModulePath(project.projectName, newModuleName);
    await storage.renameModule(module.moduleType, project.projectName, module.moduleName, newModuleName);
    module.modulePath = newModulePath;
    module.moduleName = newModuleName;
    module.className = proposedClassName;

    if (module.moduleType === MODULE_TYPE_MECHANISM) {
      const mechanism = project.mechanisms.find(m => m.modulePath === module.modulePath);
      if (mechanism) {
        mechanism.modulePath = newModulePath;
        mechanism.moduleName = newModuleName;
        mechanism.className = proposedClassName;
      }
    } else if (module.moduleType === MODULE_TYPE_OPMODE) {
      const opMode = project.opModes.find(o => o.modulePath === module.modulePath);
      if (opMode) {
        opMode.modulePath = newModulePath;
        opMode.moduleName = newModuleName;
        opMode.className = proposedClassName;
      }
      return newModulePath
    }
  }
  return '';
}
/**
 * Copies a module in the project.
 * @param storage The storage interface to use for copying the module.
 * @param project The project containing the module to copy.
 * @param proposedClassName The new name for the module.
 * @param oldModuleName The current name of the module.
 * @returns A promise that resolves when the module has been copied.
 */
export async function copyModuleInProject(
  storage: Storage, project: Project, proposedClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == MODULE_TYPE_ROBOT) {
      throw new Error('Copying the robot module is not allowed.');
    }
    const newModuleName = pascalCaseToSnakeCase(proposedClassName);
    const newModulePath = makeModulePath(project.projectName, newModuleName);
    await storage.copyModule(module.moduleType, project.projectName, module.moduleName, newModuleName);

    if (module.moduleType === MODULE_TYPE_MECHANISM) {
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_MECHANISM,
        projectName: project.projectName,
        moduleName: newModuleName,
        className: proposedClassName
      } as Mechanism);
    } else if (module.moduleType === MODULE_TYPE_OPMODE) {
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_OPMODE,
        projectName: project.projectName,
        moduleName: newModuleName,
        className: proposedClassName
      } as OpMode);
    }
    return newModulePath;
  }
  return '';
}

/**
 * Checks if the proposed class name is valid and does not conflict with existing names in the project.
 * @param project The project to check against.
 * @param proposedClassName The proposed class name to validate.
 * @returns An object containing a boolean `ok` indicating if the name is valid, and an `error` message if it is not.
 */
export function isClassNameOk(project: Project, proposedClassName: string) {
  let ok = true;
  let error = '';

  if (!isValidClassName(proposedClassName)) {
    ok = false;
    error = proposedClassName + ' is not a valid name. Please enter a different name.';
  } else if (findModuleByClassName(project, proposedClassName) != null) {
    ok = false;
    error = 'Another Mechanism or OpMode is already named ' + proposedClassName + '. Please enter a different name.'
  }

  return {
    ok: ok,
    error: error
  }
}

/**
 * Returns the module in the given project with the given class name.
 */
export function findModuleByClassName(project: Project, className: string): Module | null {
  if (project.robot.className === className) {
    return project.robot;
  }
  for (const mechanism of project.mechanisms) {
    if (mechanism.className === className) {
      return mechanism;
    }
  }
  for (const opMode of project.opModes) {
    if (opMode.className === className) {
      return opMode;
    }
  }
  return null;
}

/**
 * Returns the module with the given module path inside the given project, or null if it is not found.
 */
export function findModuleByModulePath(project: Project, modulePath: string): Module | null {
  if (project.robot.modulePath === modulePath) {
    return project.robot;
  }
  for (const mechanism of project.mechanisms) {
    if (mechanism.modulePath === modulePath) {
      return mechanism;
    }
  }
  for (const opMode of project.opModes) {
    if (opMode.modulePath === modulePath) {
      return opMode;
    }
  }
  return null;
}


/**
 * Makes the given name a valid class name.
 */
export function onChangeClassName(name: string): string {
  let newName = '';

  // Force the first character to be an upper case letter
  let i = 0;
  for (; i < name.length; i++) {
    const firstChar = name.charAt(0);
    if (firstChar >= 'A' && firstChar <= 'Z') {
      newName += firstChar;
      i++;
      break;
    } else if (firstChar >= 'a' && firstChar <= 'z') {
      newName += firstChar.toUpperCase();
      i++;
      break;
    }
  }

  for (; i < name.length; i++) {
    const char = name.charAt(i);
    if ((char >= 'A' && char <= 'Z') ||
      (char >= 'a' && char <= 'z') ||
      (char >= '0' && char <= '9')) {
      newName += char;
    }
  }

  return newName;
}

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
 * Returns the module name (snake_case) for the given class name (PascalCase).
 */
export function pascalCaseToSnakeCase(className: string): string {
  let moduleName = '';
  for (let i = 0; i < className.length; i++) {
    const char = className.charAt(i);
    if (char >= 'A' && char <= 'Z') {
      if (i > 0) {
        moduleName += '_';
      }
      moduleName += char.toLowerCase();
    } else {
      moduleName += char;
    }
  }
  return moduleName;
}

/**
 * Returns the class name (PascalCase) for the given module name (snake_case).
 */
export function snakeCaseToPascalCase(moduleName: string): string {
  let className = '';
  let nextCharUpper = true;
  for (let i = 0; i < moduleName.length; i++) {
    const char = moduleName.charAt(i);
    if (char !== '_') {
      className += nextCharUpper ? char.toUpperCase() : char;
    }
    nextCharUpper = (char === '_');
  }
  return className;
}

/**
 * Returns true if the given name is a valid python module name.
 */
export function isValidPythonModuleName(name: string): boolean {
  if (name) {
    return /^[a-z_][a-z0-9_]*$/.test(name);
  }
  return false;
}

/**
 * Returns the module path for the given project and module names.
 */
export function makeModulePath(projectName: string, moduleName: string): string {
  return projectName + '/' + moduleName + '.py';
}

/**
 * Returns the robot module path for the given project names.
 */
export function makeRobotPath(projectName: string): string {
  return makeModulePath(projectName, projectName);
}

/**
 * Returns the project path for given module path.
 */
export function getProjectName(modulePath: string): string {
  const regex = new RegExp('^([a-z_A-Z][a-z0-9_]*)/([a-z_A-Z][a-z0-9_]*).py$');
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the project name.');
  }
  return result[1];
}

/**
 * Returns the module name for given module path.
 */
export function getModuleName(modulePath: string): string {
  const regex = new RegExp('^([a-z_A-Z][a-z0-9_]*)/([a-z_A-Z][a-z0-9_]*).py$');
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the module name.');
  }
  return result[2];
}

function startingBlocksToModuleContent(
  module: Module, startingBlocks: { [key: string]: any }) {
  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(startingBlocks, headlessBlocklyWorkspace);

  const generatorContext = createGeneratorContext();
  generatorContext.setModule(module);

  const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(
    headlessBlocklyWorkspace, generatorContext);
  const blocksContent = JSON.stringify(
    Blockly.serialization.workspaces.save(headlessBlocklyWorkspace));
  const methodsContent = '[]';
  const componentsContent = '[]';
  return makeModuleContent(
    module, pythonCode, blocksContent, methodsContent, componentsContent);
}

/**
 * Returns the robot module content for a new Project.
 */
export function newRobotContent(projectName: string): string {
  const module: Robot = {
    modulePath: makeRobotPath(projectName),
    moduleType: MODULE_TYPE_ROBOT,
    projectName: projectName,
    moduleName: projectName,
    dateModifiedMillis: 0,
    className: ROBOT_CLASS_NAME,
  };

  return startingBlocksToModuleContent(module, startingRobotBlocks);
}

/**
 * Returns the module content for a new Mechanism.
 */
export function newMechanismContent(projectName: string, mechanismName: string): string {
  const module: Module = {
    modulePath: makeModulePath(projectName, mechanismName),
    moduleType: MODULE_TYPE_MECHANISM,
    projectName: projectName,
    moduleName: mechanismName,
    dateModifiedMillis: 0,
    className: snakeCaseToPascalCase(mechanismName),
  };

  return startingBlocksToModuleContent(module, startingMechanismBlocks);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(projectName: string, opModeName: string): string {
  const module: Module = {
    modulePath: makeModulePath(projectName, opModeName),
    moduleType: MODULE_TYPE_OPMODE,
    projectName: projectName,
    moduleName: opModeName,
    dateModifiedMillis: 0,
    className: snakeCaseToPascalCase(opModeName),
  };

  return startingBlocksToModuleContent(module, startingOpModeBlocks);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContent(
  module: Module,
  pythonCode: string,
  blocksContent: string,
  methodsContent: string,
  componentsContent: string): string {
  let delimiter = DELIMITER_PREFIX;
  while (module.moduleType.includes(delimiter)
      || blocksContent.includes(delimiter)
      || methodsContent.includes(delimiter)
      || componentsContent.includes(delimiter)) {
    delimiter += '.';
  }
  return (
    '# This file was generated by the Blocks editor.\n\n' +
    pythonCode + '\n\n\n' +
    '"""\n' +
    delimiter + '\n' +
    MARKER_COMPONENTS + componentsContent + '\n' +
    delimiter + '\n' +
    MARKER_MODULE_TYPE + module.moduleType + '\n' +
    delimiter + '\n' +
    MARKER_METHODS + methodsContent + '\n' +
    delimiter + '\n' +
    MARKER_BLOCKS_CONTENT + blocksContent + '\n' +
    delimiter + '\n' +
    '"""\n');
}

function getParts(moduleContent: string): string[] {
  // The last line is """.
  const lastChars = '\n"""\n';
  if (!moduleContent.endsWith(lastChars) || moduleContent.length <= lastChars.length) {
    throw new Error('Unable to parse the module content.');
  }
  // The line before that is the delimiter.
  const iEndOfDelimiter = moduleContent.length - lastChars.length;
  const iPreviousNewLine = moduleContent.lastIndexOf('\n', iEndOfDelimiter - 1);
  if (iPreviousNewLine === -1) {
    throw new Error('Unable to parse the module content.');
  }
  const iStartOfDelimiter = iPreviousNewLine + 1;
  const delimiter = moduleContent.substring(iStartOfDelimiter, iEndOfDelimiter);
  const split = moduleContent.split(delimiter);
  split.pop(); // The last element is the """ that closes the python comment.
  const parts = [];
  // Pop the elements off of the split array and push them onto the parts array
  // so they end up in the reverse order that they were in the module content.
  // Ignore the first (index 0) element of the split array, which is the python
  // code.
  while (split.length > 1 && parts.length < NUMBER_OF_PARTS) {
    const s = split.pop();
    if (s) {
      parts.push(s.trim());
    }
  }
  if (parts.length <= PARTS_INDEX_METHODS) {
    // This module was saved without methods.
    parts.push(MARKER_METHODS + '[]');
  } else if (!parts[PARTS_INDEX_METHODS].startsWith(MARKER_METHODS)) {
    // Older modules were saved with exported blocks instead of methods.
    parts[PARTS_INDEX_METHODS] = MARKER_METHODS + '[]'
  }
  if (parts.length <= PARTS_INDEX_MODULE_TYPE) {
    // This module was saved without the module type.
    // This module is either a Project or an OpMode, but we don't know which from just the content.
    parts.push(MODULE_TYPE_UNKNOWN);
  }
  if (parts.length <= PARTS_INDEX_COMPONENTS) {
    // This module was saved without components.
    parts.push(MARKER_COMPONENTS + '[]');
  }
  return parts;
}

/**
 * Extract the blocks content from the given module content.
 */
export function extractBlocksContent(moduleContent: string): string {
  const parts = getParts(moduleContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  return blocksContent;
}

/**
 * Extract the methods from the given module content.
 */
export function extractMethods(moduleContent: string): Method[] {
  const parts = getParts(moduleContent);
  let methodsContent = parts[PARTS_INDEX_METHODS];
  if (methodsContent.startsWith(MARKER_METHODS)) {
    methodsContent = methodsContent.substring(MARKER_METHODS.length);
  }
  const methods: Method[] = JSON.parse(methodsContent);
  return methods;
}

/**
 * Extract the moduleType from the given module content.
 */
export function extractModuleType(moduleContent: string): string {
  const parts = getParts(moduleContent);
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }
  return moduleType;
}

/**
 * Extract the components from the given module content.
 */
export function extractComponents(moduleContent: string): Component[] {
  const parts = getParts(moduleContent);
  let componentsContent = parts[PARTS_INDEX_COMPONENTS];
  if (componentsContent.startsWith(MARKER_COMPONENTS)) {
    componentsContent = componentsContent.substring(MARKER_COMPONENTS.length);
  }
  const components: Component[] = JSON.parse(componentsContent);
  return components;
}

/**
 * Produce the blob for downloading a project.
 */
export async function produceDownloadProjectBlob(
  projectName: string, moduleContents: { [key: string]: string }): Promise<string> {
  const zip = new JSZip();
  for (const moduleName in moduleContents) {
    const moduleContent = moduleContents[moduleName];
    const moduleContentForDownload = _processModuleContentForDownload(
      projectName, moduleName, moduleContent);
    zip.file(moduleName, moduleContentForDownload);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  return blobUrl;
}

export function getClassNameForModule(moduleType: string, moduleName: string) {
  return (moduleType == MODULE_TYPE_ROBOT)
      ? ROBOT_CLASS_NAME
      : snakeCaseToPascalCase(moduleName);
}

/**
 * Process the module content so it can be downloaded.
 */
function _processModuleContentForDownload(
  projectName: string, moduleName: string, moduleContent: string): string {
  const parts = getParts(moduleContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }
  let methodsContent = parts[PARTS_INDEX_METHODS];
  if (methodsContent.startsWith(MARKER_METHODS)) {
    methodsContent = methodsContent.substring(MARKER_METHODS.length);
  }
  let componentsContent = parts[PARTS_INDEX_COMPONENTS];
  if (componentsContent.startsWith(MARKER_COMPONENTS)) {
    componentsContent = componentsContent.substring(MARKER_COMPONENTS.length);
  }

  const module: Module = {
    modulePath: makeModulePath(projectName, moduleName),
    moduleType: moduleType,
    projectName: projectName,
    moduleName: moduleName,
    dateModifiedMillis: 0,
    className: getClassNameForModule(moduleType, moduleName),
  };

  // Clear out the python content.
  const pythonCode = '';
  return makeModuleContent(
    module, pythonCode, blocksContent, methodsContent, componentsContent);
}

/**
 * Make a unique project name for an uploaded project.
 */
export function makeUploadProjectName(
  uploadFileName: string, existingProjectNames: string[]): string {
  const preferredName = uploadFileName.substring(
    0, uploadFileName.length - UPLOAD_DOWNLOAD_FILE_EXTENSION.length);
  let name = preferredName; // No suffix.
  let suffix = 0;
  while (true) {
    let nameClash = false;
    for (const existingProjectName of existingProjectNames) {
      if (name == existingProjectName) {
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

/**
 * Process the uploaded blob to get the module types and contents.
 */
export async function processUploadedBlob(
  projectName: string, blobUrl: string)
  : Promise<[{ [key: string]: string }, { [key: string]: string }]> {
  const prefix = 'data:application/octet-stream;base64,';
  if (!blobUrl.startsWith(prefix)) {
    throw new Error('blobUrl does not have the expected prefix.');
  }
  const data = blobUrl.substring(prefix.length);

  const zip = await JSZip.loadAsync(data, { base64: true });
  const promises: { [key: string]: Promise<string> } = {};
  zip.forEach((moduleName, zipEntry) => {
    promises[moduleName] = zipEntry.async('text');
  });

  // Wait for all promises to resolve.
  const files: { [key: string]: string } = {}; // key is file name, value is content
  await Promise.all(
    Object.entries(promises).map(async ([filename, promise]) => {
      files[filename] = await promise;
    })
  );

  // Process each module's content.
  const moduleTypes: { [key: string]: string } = {}; // key is module name, value is module type
  const moduleContents: { [key: string]: string } = {}; // key is module name, value is module content
  for (const filename in files) {
    const uploadedContent = files[filename];
    let [moduleName, moduleType, moduleContent] = _processUploadedModule(
      projectName, filename, uploadedContent);

    moduleTypes[moduleName] = moduleType;
    moduleContents[moduleName] = moduleContent;
  }

  return [moduleTypes, moduleContents];
}

/**
 * Processes an uploaded module to get the module name, type, and content.
 */
export function _processUploadedModule(
  projectName: string, filename: string, uploadedContent: string)
  : [string, string, string] {
  const parts = getParts(uploadedContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }
  let methodsContent = parts[PARTS_INDEX_METHODS];
  if (methodsContent.startsWith(MARKER_METHODS)) {
    methodsContent = methodsContent.substring(MARKER_METHODS.length);
  }
  let componentsContent = parts[PARTS_INDEX_COMPONENTS];
  if (componentsContent.startsWith(MARKER_COMPONENTS)) {
    componentsContent = componentsContent.substring(MARKER_COMPONENTS.length);
  }

  const moduleName = (moduleType === MODULE_TYPE_ROBOT)
    ? projectName : filename;

  const module: Module = {
    modulePath: makeModulePath(projectName, moduleName),
    moduleType: moduleType,
    projectName: projectName,
    moduleName: moduleName,
    dateModifiedMillis: 0,
    className: snakeCaseToPascalCase(moduleName),
  };

  // Generate the python content.
  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(
    JSON.parse(blocksContent), headlessBlocklyWorkspace);

  const generatorContext = createGeneratorContext();
  generatorContext.setModule(module);

  const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(
    headlessBlocklyWorkspace, generatorContext);

  const moduleContent = makeModuleContent(
    module, pythonCode, blocksContent, methodsContent, componentsContent);
  return [moduleName, moduleType, moduleContent];
}
