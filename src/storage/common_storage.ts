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

export type Project = {
  projectName: string, // For example, WackyWheelerRobot
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

export type MechanismInRobot = {
  blockId: string, // ID of the mrc_mechanism block that adds the mechanism to the robot.
  name: string,
  className: string, // Includes the module name, for example 'game_piece_shooter.GamePieceShooter'.
}

export type Component = {
  blockId: string, // ID of the mrc_component block that adds the component to the robot or to a mechanism.
  name: string,
  className: string, // Includes the module name, for example 'smart_motor.SmartMotor'.
  ports: {[port: string]: string}, // The value is the type.
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
export const CLASS_NAME_TELEOP = 'Teleop';

export const JSON_FILE_EXTENSION = '.json';
export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

/**
 * Regular expression to extract the project name and the class name from a module path.
 */
const REGEX_MODULE_PATH = '^([A-Za-z_][A-Za-z0-9_]*)/([A-Za-z_][A-Za-z0-9_]*).json$';

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
  renameModule(moduleType: string, projectName: string, oldClassName: string, newClassName: string): Promise<void>;
  copyModule(moduleType: string, projectName: string, oldClassName: string, newClassName: string): Promise<void>;
  deleteProject(projectName: string): Promise<void>;
  deleteModule(moduleType: string, modulePath: string): Promise<void>;
  downloadProject(projectName: string): Promise<string>;
  uploadProject(projectName: string, blobUrl: string): Promise<void>;
}

/**
 * Creates a new project.
 * @param storage The storage interface to use for creating the project.
 * @param newProjectName The name for the new project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been created.
 */
export async function createProject(
  storage: Storage, newProjectName: string): Promise<void> {
  const robotContent = newRobotContent(newProjectName);
  const opmodeContent = newOpModeContent(newProjectName, CLASS_NAME_TELEOP);
  await storage.createProject(newProjectName, robotContent, opmodeContent);
}

/**
 * Renames a project.
 * @param storage The storage interface to use for renaming the project.
 * @param project The project to rename
 * @param newProjectName The new name for the project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been renamed.
 */
export async function renameProject(
  storage: Storage, project: Project, newProjectName: string): Promise<void> {
  await storage.renameProject(project.projectName, newProjectName);
}

/**
 * Copies a project.
 * @param storage The storage interface to use for copying the project.
 * @param project The project to copy
 * @param newProjectName The name for the new project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been copied.
 */
export async function copyProject(
  storage: Storage, project: Project, newProjectName: string): Promise<void> {
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
 * @param newClassName The name of the class. For example, GamePieceShooter.
 */
export async function addModuleToProject(
  storage: Storage, project: Project, moduleType: string, newClassName: string): Promise<void> {
  const newModulePath = makeModulePath(project.projectName, newClassName);

  if (moduleType === MODULE_TYPE_MECHANISM) {
    const mechanismContent = newMechanismContent(project.projectName, newClassName);
    await storage.createModule(MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
    project.mechanisms.push({
      modulePath: newModulePath,
      moduleType: MODULE_TYPE_MECHANISM,
      projectName: project.projectName,
      className: newClassName
    } as Mechanism);
  } else if (moduleType === MODULE_TYPE_OPMODE) {
    const opModeContent = newOpModeContent(project.projectName, newClassName);
    await storage.createModule(MODULE_TYPE_OPMODE, newModulePath, opModeContent);
    project.opModes.push({
      modulePath: newModulePath,
      moduleType: MODULE_TYPE_OPMODE,
      projectName: project.projectName,
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
 * @param newClassName The new name for the module. For example, GamePieceShooter.
 * @param oldModulePath The current path of the module.
 * @returns A promise that resolves when the module has been renamed.
 */
export async function renameModuleInProject(
  storage: Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == MODULE_TYPE_ROBOT) {
      throw new Error('Renaming the robot module is not allowed.');
    }
    const newModulePath = makeModulePath(project.projectName, newClassName);
    await storage.renameModule(module.moduleType, project.projectName, module.className, newClassName);
    module.modulePath = newModulePath;
    module.className = newClassName;
    module.className = newClassName;

    if (module.moduleType === MODULE_TYPE_MECHANISM) {
      const mechanism = project.mechanisms.find(m => m.modulePath === module.modulePath);
      if (mechanism) {
        mechanism.modulePath = newModulePath;
        mechanism.className = newClassName;
        mechanism.className = newClassName;
      }
      return newModulePath;
    } else if (module.moduleType === MODULE_TYPE_OPMODE) {
      const opMode = project.opModes.find(o => o.modulePath === module.modulePath);
      if (opMode) {
        opMode.modulePath = newModulePath;
        opMode.className = newClassName;
        opMode.className = newClassName;
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
 * @param newClassName The new name for the module. For example, GamePieceShooter.
 * @param oldModulePath The current path of the module.
 * @returns A promise that resolves when the module has been copied.
 */
export async function copyModuleInProject(
  storage: Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == MODULE_TYPE_ROBOT) {
      throw new Error('Copying the robot module is not allowed.');
    }
    const newModulePath = makeModulePath(project.projectName, newClassName);
    await storage.copyModule(module.moduleType, project.projectName, module.className, newClassName);

    if (module.moduleType === MODULE_TYPE_MECHANISM) {
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_MECHANISM,
        projectName: project.projectName,
        className: newClassName
      } as Mechanism);
    } else if (module.moduleType === MODULE_TYPE_OPMODE) {
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_OPMODE,
        projectName: project.projectName,
        className: newClassName
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

function startingBlocksToModuleContentText(
    module: Module, startingBlocks: { [key: string]: any }): string {
  const mechanisms: MechanismInRobot[] = [];
  const components: Component[] = [];
  const events: Event[] = [];
  const methods: Method[] = [];
  return makeModuleContentText(
      module,
      startingBlocks,
      mechanisms,
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
    className: CLASS_NAME_ROBOT,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingRobotBlocks);
}

/**
 * Returns the module content for a new Mechanism.
 */
export function newMechanismContent(projectName: string, mechanismClassName: string): string {
  const module: Mechanism = {
    modulePath: makeModulePath(projectName, mechanismClassName),
    moduleType: MODULE_TYPE_MECHANISM,
    projectName: projectName,
    className: mechanismClassName,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingMechanismBlocks);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(projectName: string, opModeClassName: string): string {
  const module: OpMode = {
    modulePath: makeModulePath(projectName, opModeClassName),
    moduleType: MODULE_TYPE_OPMODE,
    projectName: projectName,
    className: opModeClassName,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingOpModeBlocks);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContentText(
    module: Module,
    blocks: { [key: string]: any },
    mechanisms: MechanismInRobot[],
    components: Component[],
    events: Event[],
    methods: Method[]): string {
  const moduleContent = new ModuleContent(
      module.moduleType,
      blocks,
      mechanisms,
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
      parsedContent.mechanisms,
      parsedContent.components,
      parsedContent.events,
      parsedContent.methods);
}

export class ModuleContent {
  constructor(
      private moduleType: string,
      private blocks : { [key: string]: any },
      private mechanisms: MechanismInRobot[],
      private components: Component[],
      private events: Event[],
      private methods: Method[]) {
  }

  getModuleContentText(): string {
    return JSON.stringify(this, null, 2);
  }

  getModuleType(): string {
    return this.moduleType;
  }

  getBlocks(): { [key: string]: any } {
    return this.blocks;
  }

  getMechanisms(): MechanismInRobot[] {
    return this.mechanisms;
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
    classNameToModuleContentText: { [key: string]: string }): Promise<string> {
  const zip = new JSZip();
  for (const className in classNameToModuleContentText) {
    const moduleContentText = classNameToModuleContentText[className];
    const filename = className + JSON_FILE_EXTENSION;
    zip.file(filename, moduleContentText);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  return blobUrl;
}

/**
 * Make a unique project name for an uploaded project.
 */
export function makeUploadProjectName(
    uploadFileName: string, existingProjectNames: string[]): string {
  const preferredName = uploadFileName.substring(
    0, uploadFileName.length - UPLOAD_DOWNLOAD_FILE_EXTENSION.length);
  return makeUniqueName(preferredName, existingProjectNames);
}

/**
 * Process the uploaded blob to get the module types and contents.
 * Returns a promise of classNameToModuleType and classNameToModuleContentText.
 */
export async function processUploadedBlob(
    blobUrl: string)
    : Promise<[{ [className: string]: string }, { [className: string]: string }]> {

  const prefix = 'data:application/octet-stream;base64,';
  if (!blobUrl.startsWith(prefix)) {
    throw new Error('blobUrl does not have the expected prefix.');
  }
  const data = blobUrl.substring(prefix.length);

  const zip = await JSZip.loadAsync(data, { base64: true });
  const promises: { [key: string]: Promise<string> } = {};
  zip.forEach((filename, zipEntry) => {
    const className = filename.endsWith(JSON_FILE_EXTENSION)
        ? filename.substring(0, filename.length - JSON_FILE_EXTENSION.length)
        : filename;
    promises[className] = zipEntry.async('text');
  });

  // Wait for all promises to resolve.
  const files: { [key: string]: string } = {}; // key is file name, value is content
  await Promise.all(
    Object.entries(promises).map(async ([filename, promise]) => {
      files[filename] = await promise;
    })
  );

  // Process each module's content.
  const classNameToModuleType: { [className: string]: string } = {}; // key is class name, value is module type
  const classNameToModuleContentText: { [className: string]: string } = {}; // key is class name, value is module content text
  for (const filename in files) {
    const uploadedContent = files[filename];
    const [className, moduleType, moduleContent] = _processUploadedModule(
        filename, uploadedContent);
    classNameToModuleType[className] = moduleType;
    classNameToModuleContentText[className] = moduleContent;
  }

  return [classNameToModuleType, classNameToModuleContentText];
}

/**
 * Processes an uploaded module to get the class name, type, and content text.
 */
export function _processUploadedModule(
    filename: string, uploadedContent: string): [string, string, string] {

  const moduleContent = parseModuleContentText(uploadedContent);
  const moduleType = moduleContent.getModuleType();
  const className = filename;
  const moduleContentText = moduleContent.getModuleContentText();
  return [className, moduleType, moduleContentText];
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
