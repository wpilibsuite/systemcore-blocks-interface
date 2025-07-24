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

import startingOpModeBlocks from '../modules/opmode_start.json';
import startingMechanismBlocks from '../modules/mechanism_start.json';
import startingRobotBlocks from '../modules/robot_start.json';

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

export type Event = {
  blockId: string, // ID of the mrc_event block that defines the event.
  name: string,
  args: MethodArg[],
};

export const MODULE_TYPE_UNKNOWN = 'unknown';
export const MODULE_TYPE_ROBOT = 'robot';
export const MODULE_TYPE_MECHANISM = 'mechanism';
export const MODULE_TYPE_OPMODE = 'opmode';

const CLASS_NAME_ROBOT = 'Robot';

export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

export interface Storage {
  saveEntry(entryKey: string, entryValue: string): Promise<void>;
  fetchEntry(entryKey: string, defaultValue: string): Promise<string>;
  listProjects(): Promise<Project[]>;
  fetchModuleContentText(modulePath: string): Promise<string>;
  createProject(projectName: string, robotContent: string, opmodeContent: string): Promise<void>;
  createModule(moduleType: string, modulePath: string, moduleContentText: string): Promise<void>;
  saveModule(modulePath: string, moduleContentText: string): Promise<void>;
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
  const opmodeContent = newOpModeContent(newProjectName, 'Teleop');
  await storage.createProject(newProjectName, robotContent, opmodeContent);
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
  const newModuleName = pascalCaseToSnakeCase(newClassName);
  const newModulePath = makeModulePath(project.projectName, newModuleName);

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
      return newModulePath;
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
  return projectName + '/' + moduleName + '.blocks';
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
  const regex = new RegExp('^([a-z_A-Z][a-z0-9_]*)/([a-z_A-Z][a-z0-9_]*).blocks$');
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

function startingBlocksToModuleContentText(
    module: Module, startingBlocks: { [key: string]: any }): string {
  const components: Component[] = [];
  const events: Event[] = [];
  const methods: Method[] = [];
  return makeModuleContentText(
      module,
      startingBlocks,
      components,
      events,
      methods);
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
    className: CLASS_NAME_ROBOT,
  };

  return startingBlocksToModuleContentText(module, startingRobotBlocks);
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

  return startingBlocksToModuleContentText(module, startingMechanismBlocks);
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

  return startingBlocksToModuleContentText(module, startingOpModeBlocks);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContentText(
    module: Module,
    blocks: { [key: string]: any },
    components: Component[],
    events: Event[],
    methods: Method[]): string {
  const moduleContent = new ModuleContent(
      module.moduleType,
      blocks,
      components,
      events,
      methods);
  return moduleContent.getModuleContentText();
}

export function parseModuleContentText(moduleContentText: string): ModuleContent {
  const parsedContent = JSON.parse(moduleContentText);
  return new ModuleContent(
      parsedContent.moduleType,
      parsedContent.blocks,
      parsedContent.components,
      parsedContent.events,
      parsedContent.methods);
}

export class ModuleContent {
  constructor(
      private moduleType: string,
      private blocks : { [key: string]: any },
      private components: Component[],
      private events: Event[],
      private methods: Method[]) {
  }

  getModuleContentText(): string {
    return JSON.stringify(this);
  }

  getModuleType(): string {
    return this.moduleType;
  }

  getBlocks(): { [key: string]: any } {
    return this.blocks;
  }

  getComponents(): Component[] {
    return this.components;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getMethods(): Method[] {
    return this.methods;
  }
}

/**
 * Produce the blob for downloading a project.
 */
export async function produceDownloadProjectBlob(
    moduleNameToContentText: { [key: string]: string }): Promise<string> {
  const zip = new JSZip();
  for (const moduleName in moduleNameToContentText) {
    const moduleContentText = moduleNameToContentText[moduleName];
    zip.file(moduleName, moduleContentText);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  return blobUrl;
}

export function getClassNameForModule(moduleType: string, moduleName: string) {
  return (moduleType == MODULE_TYPE_ROBOT)
      ? CLASS_NAME_ROBOT
      : snakeCaseToPascalCase(moduleName);
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
  const moduleNameToType: { [key: string]: string } = {}; // key is module name, value is module type
  const moduleNameToContentText: { [key: string]: string } = {}; // key is module name, value is module content text
  for (const filename in files) {
    const uploadedContent = files[filename];
    const [moduleName, moduleType, moduleContent] = _processUploadedModule(
        projectName, filename, uploadedContent);
    moduleNameToType[moduleName] = moduleType;
    moduleNameToContentText[moduleName] = moduleContent;
  }

  return [moduleNameToType, moduleNameToContentText];
}

/**
 * Processes an uploaded module to get the module name, type, and content text.
 */
export function _processUploadedModule(
    projectName: string, filename: string, uploadedContent: string)
    : [string, string, string] {

  const moduleContent = parseModuleContentText(uploadedContent);
  const moduleType = moduleContent.getModuleType();
  const moduleName = (moduleType === MODULE_TYPE_ROBOT) ? projectName : filename;
  const moduleContentText = moduleContent.getModuleContentText();
  return [moduleName, moduleType, moduleContentText];
}
