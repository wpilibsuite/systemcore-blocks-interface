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

import JSZip from 'jszip';

import * as commonStorage from './common_storage';
import * as storageModule from './module';
import * as storageModuleContent from './module_content';
import * as storageNames from './names';

// Types, constants, and functions related to projects, regardless of where the projects are stored.

export type Project = {
  projectName: string, // For example, WackyWheelerRobot
  robot: storageModule.Robot,
  mechanisms: storageModule.Mechanism[]
  opModes: storageModule.OpMode[],
};

/**
 * Creates a new project.
 * @param storage The storage interface to use for creating the project.
 * @param newProjectName The name for the new project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been created.
 */
export async function createProject(
  storage: commonStorage.Storage, newProjectName: string): Promise<void> {
  const robotContent = storageModuleContent.newRobotContent(newProjectName);
  const opmodeContent = storageModuleContent.newOpModeContent(newProjectName, storageNames.CLASS_NAME_TELEOP);
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
  storage: commonStorage.Storage, project: Project, newProjectName: string): Promise<void> {
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
  storage: commonStorage.Storage, project: Project, newProjectName: string): Promise<void> {
  await storage.copyProject(project.projectName, newProjectName);
}

/**
 * Deletes a project.
 * @param storage The storage interface to use for deleting the project.
 * @param project The project to delete.
 * @returns A promise that resolves when the project has been deleted.
 */
export async function deleteProject(
  storage: commonStorage.Storage, project: Project): Promise<void> {
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
  storage: commonStorage.Storage, project: Project, moduleType: string, newClassName: string): Promise<void> {
  const newModulePath = storageNames.makeModulePath(project.projectName, newClassName);

  if (moduleType === storageModule.MODULE_TYPE_MECHANISM) {
    const mechanismContent = storageModuleContent.newMechanismContent(project.projectName, newClassName);
    await storage.createModule(storageModule.MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
    project.mechanisms.push({
      modulePath: newModulePath,
      moduleType: storageModule.MODULE_TYPE_MECHANISM,
      projectName: project.projectName,
      className: newClassName
    } as storageModule.Mechanism);
  } else if (moduleType === storageModule.MODULE_TYPE_OPMODE) {
    const opModeContent = storageModuleContent.newOpModeContent(project.projectName, newClassName);
    await storage.createModule(storageModule.MODULE_TYPE_OPMODE, newModulePath, opModeContent);
    project.opModes.push({
      modulePath: newModulePath,
      moduleType: storageModule.MODULE_TYPE_OPMODE,
      projectName: project.projectName,
      className: newClassName
    } as storageModule.OpMode);
  }
}
/**
 * Removes a module from the project.
 * @param storage The storage interface to use for deleting the module.
 * @param project The project to remove the module from.
 * @param modulePath The path of the module to remove.
 */
export async function removeModuleFromProject(
  storage: commonStorage.Storage, project: Project, modulePath: string): Promise<void> {
  const module = findModuleByModulePath(project, modulePath);
  if (module) {
    if (module.moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Removing the robot module from the project is not allowed.');
    }
    await storage.deleteModule(module.moduleType, modulePath);
    if (module.moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      project.mechanisms = project.mechanisms.filter(m => m.modulePath !== modulePath);
    } else if (module.moduleType === storageModule.MODULE_TYPE_OPMODE) {
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
  storage: commonStorage.Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Renaming the robot module is not allowed.');
    }
    const newModulePath = storageNames.makeModulePath(project.projectName, newClassName);
    await storage.renameModule(module.moduleType, project.projectName, module.className, newClassName);
    module.modulePath = newModulePath;
    module.className = newClassName;
    module.className = newClassName;

    if (module.moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      const mechanism = project.mechanisms.find(m => m.modulePath === module.modulePath);
      if (mechanism) {
        mechanism.modulePath = newModulePath;
        mechanism.className = newClassName;
        mechanism.className = newClassName;
      }
      return newModulePath;
    } else if (module.moduleType === storageModule.MODULE_TYPE_OPMODE) {
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
  storage: commonStorage.Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (module) {
    if (module.moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Copying the robot module is not allowed.');
    }
    const newModulePath = storageNames.makeModulePath(project.projectName, newClassName);
    await storage.copyModule(module.moduleType, project.projectName, module.className, newClassName);

    if (module.moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: storageModule.MODULE_TYPE_MECHANISM,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.Mechanism);
    } else if (module.moduleType === storageModule.MODULE_TYPE_OPMODE) {
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: storageModule.MODULE_TYPE_OPMODE,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.OpMode);
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

  if (!storageNames.isValidClassName(proposedClassName)) {
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
export function findModuleByClassName(project: Project, className: string): storageModule.Module | null {
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
export function findModuleByModulePath(project: Project, modulePath: string): storageModule.Module | null {
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
 * Produce the blob for downloading a project.
 */
export async function produceDownloadProjectBlob(
    classNameToModuleContentText: { [key: string]: string }): Promise<string> {
  const zip = new JSZip();
  for (const className in classNameToModuleContentText) {
    const moduleContentText = classNameToModuleContentText[className];
    const filename = className + storageNames.JSON_FILE_EXTENSION;
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
    0, uploadFileName.length - storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION.length);
  return storageNames.makeUniqueName(preferredName, existingProjectNames);
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
    const className = filename.endsWith(storageNames.JSON_FILE_EXTENSION)
        ? filename.substring(0, filename.length - storageNames.JSON_FILE_EXTENSION.length)
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
    const [className, moduleType, moduleContent] = processUploadedModule(
        filename, uploadedContent);
    classNameToModuleType[className] = moduleType;
    classNameToModuleContentText[className] = moduleContent;
  }

  return [classNameToModuleType, classNameToModuleContentText];
}

/**
 * Processes an uploaded module to get the class name, type, and content text.
 */
function processUploadedModule(
    filename: string, uploadedContent: string): [string, string, string] {

  const moduleContent = storageModuleContent.parseModuleContentText(uploadedContent);
  const moduleType = moduleContent.getModuleType();
  const className = filename;
  const moduleContentText = moduleContent.getModuleContentText();
  return [className, moduleType, moduleContentText];
}
