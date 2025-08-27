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
 * Returns the list of project names.
 */
export async function listProjectNames(storage: commonStorage.Storage): Promise<string[]> {
  const modulePathRegexPattern = '.*\.robot\.json$';
  const robotModulePaths: string[] = await storage.listModulePaths(modulePathRegexPattern);

  const projectNames: string[] = [];
  for (const robotModulePath of robotModulePaths) {
    projectNames.push(storageNames.getProjectName(robotModulePath))
  }
  return projectNames;
}

/**
 * Fetches a project
 */
export async function fetchProject(
    storage: commonStorage.Storage, projectName: string): Promise<Project> {
  const modulePaths: string[] = await storage.listModulePaths(
      storageNames.makeModulePathRegexPattern(projectName));

  let project: Project | null = null;
  const mechanisms: storageModule.Mechanism[] = []
  const opModes: storageModule.OpMode[] = [];

  for (const modulePath of modulePaths) {
    const moduleContentText = await storage.fetchModuleContentText(modulePath);
    const moduleContent: storageModuleContent.ModuleContent =
        storageModuleContent.parseModuleContentText(moduleContentText);
    const moduleType = storageNames.getModuleType(modulePath);
    const module: storageModule.Module = {
      modulePath: modulePath,
      moduleType: moduleType,
      moduleId: moduleContent.getModuleId(),
      projectName: storageNames.getProjectName(modulePath),
      className: storageNames.getClassName(modulePath),
    };
    switch (moduleType) {
      case storageModule.ModuleType.ROBOT:
        const robot: storageModule.Robot = module as storageModule.Robot;
        project = {
          projectName: projectName,
          robot: robot,
          mechanisms: [],
          opModes: [],
        };
        break;
      case storageModule.ModuleType.MECHANISM:
        const mechanism: storageModule.Mechanism = module as storageModule.Mechanism;
        mechanisms.push(mechanism);
        break;
      case storageModule.ModuleType.OPMODE:
        const opMode: storageModule.OpMode = module as storageModule.OpMode;
        opModes.push(opMode);
        break;
    }
  }
  if (!project) {
    throw new Error('Project did not contain a Robot.');
  }

  project.mechanisms.push(...mechanisms);
  project.opModes.push(...opModes);
  return project;
}

/**
 * Creates a new project.
 * @param storage The storage interface to use for creating the project.
 * @param newProjectName The name for the new project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been created.
 */
export async function createProject(
    storage: commonStorage.Storage, newProjectName: string): Promise<void> {
  const modulePath = storageNames.makeRobotPath(newProjectName);
  const robotContent = storageModuleContent.newRobotContent(newProjectName);
  await storage.saveModule(modulePath, robotContent);

  const opmodePath = storageNames.makeModulePath(
      newProjectName, storageNames.CLASS_NAME_TELEOP, storageModule.ModuleType.OPMODE);
  const opmodeContent = storageModuleContent.newOpModeContent(
      newProjectName, storageNames.CLASS_NAME_TELEOP);
  await storage.saveModule(opmodePath, opmodeContent);
}

/**
 * Renames a project.
 * @param storage The storage interface to use for renaming the project.
 * @param projectName The name of the project to rename.
 * @param newProjectName The new name for the project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been renamed.
 */
export async function renameProject(
    storage: commonStorage.Storage, projectName: string, newProjectName: string): Promise<void> {
  await renameOrCopyProject(storage, projectName, newProjectName, true);
}

/**
 * Copies a project.
 * @param storage The storage interface to use for copying the project.
 * @param projectName The name of the project to copy.
 * @param newProjectName The name for the new project. For example, WackyWheelerRobot
 * @returns A promise that resolves when the project has been copied.
 */
export async function copyProject(
    storage: commonStorage.Storage, projectName: string, newProjectName: string): Promise<void> {
  await renameOrCopyProject(storage, projectName, newProjectName, false);
}

async function renameOrCopyProject(
    storage: commonStorage.Storage, projectName: string, newProjectName: string,
    rename: boolean): Promise<void> {
  const modulePaths: string[] = await storage.listModulePaths(
      storageNames.makeModulePathRegexPattern(projectName));

  for (const modulePath of modulePaths) {
    const className = storageNames.getClassName(modulePath);
    const moduleType = storageNames.getModuleType(modulePath);
    const newModulePath = storageNames.makeModulePath(newProjectName, className, moduleType);
    const moduleContentText = await storage.fetchModuleContentText(modulePath);
    await storage.saveModule(newModulePath, moduleContentText);
    if (rename) {
      await storage.deleteModule(modulePath);
    }
  }
}

/**
 * Deletes a project.
 * @param storage The storage interface to use for deleting the project.
 * @param projectName The name of the project to delete.
 * @returns A promise that resolves when the project has been deleted.
 */
export async function deleteProject(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const modulePaths: string[] = await storage.listModulePaths(
      storageNames.makeModulePathRegexPattern(projectName));

  for (const modulePath of modulePaths) {
    await storage.deleteModule(modulePath);
  }
}

/**
 * Adds a new module to the project.
 * @param storage The storage interface to use for creating the module.
 * @param project The project to add the module to.
 * @param moduleType The type of the module (e.g., 'mechanism', 'opmode').
 * @param newClassName The name of the class. For example, GamePieceShooter.
 */
export async function addModuleToProject(
    storage: commonStorage.Storage,
    project: Project,
    moduleType: storageModule.ModuleType,
    newClassName: string): Promise<void> {
  const newModulePath = storageNames.makeModulePath(project.projectName, newClassName, moduleType);

  switch (moduleType) {
    case storageModule.ModuleType.MECHANISM:
      const mechanismContent = storageModuleContent.newMechanismContent(project.projectName, newClassName);
      await storage.saveModule(newModulePath, mechanismContent);
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: storageModule.ModuleType.MECHANISM,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.Mechanism);
      break;
    case storageModule.ModuleType.OPMODE:
      const opModeContent = storageModuleContent.newOpModeContent(project.projectName, newClassName);
      await storage.saveModule(newModulePath, opModeContent);
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: storageModule.ModuleType.OPMODE,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.OpMode);
      break;
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
    switch (module.moduleType) {
      case storageModule.ModuleType.ROBOT:
        throw new Error('Removing the robot module from the project is not allowed.');
      case storageModule.ModuleType.MECHANISM:
        project.mechanisms = project.mechanisms.filter(m => m.modulePath !== modulePath);
        break;
      case storageModule.ModuleType.OPMODE:
        project.opModes = project.opModes.filter(o => o.modulePath !== modulePath);
        break;
    }
    await storage.deleteModule(modulePath);
  }
}

/**
 * Renames a module in the project.
 * @param storage The storage interface to use for renaming the module.
 * @param project The project containing the module to rename.
 * @param newClassName The new name for the module. For example, GamePieceShooter.
 * @param oldModulePath The current path of the module.
 * @returns The new path of the module, as a promise that resolves when the module has been copied.
 */
export async function renameModuleInProject(
    storage: commonStorage.Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (!module) {
    throw new Error('Failed to find module with path ' + oldModulePath);
  }
  if (module.moduleType == storageModule.ModuleType.ROBOT) {
    throw new Error('Renaming the robot module is not allowed.');
  }
  return await renameOrCopyModule(storage, project, newClassName, module, true);
}

/**
 * Copies a module in the project.
 * @param storage The storage interface to use for copying the module.
 * @param project The project containing the module to copy.
 * @param newClassName The new name for the module. For example, GamePieceShooter.
 * @param oldModulePath The current path of the module.
 * @returns The new path of the module, as a promise that resolves when the module has been copied.
 */
export async function copyModuleInProject(
    storage: commonStorage.Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (!module) {
    throw new Error('Failed to find module with path ' + oldModulePath);
  }
  if (module.moduleType == storageModule.ModuleType.ROBOT) {
    throw new Error('Copying the robot module is not allowed.');
  }
  return await renameOrCopyModule(storage, project, newClassName, module, false);
}

async function renameOrCopyModule(
    storage: commonStorage.Storage, project: Project, newClassName: string,
    oldModule: storageModule.Module, rename: boolean): Promise<string> {
  const newModulePath = storageNames.makeModulePath(project.projectName, newClassName, oldModule.moduleType);
  let moduleContentText = await storage.fetchModuleContentText(oldModule.modulePath);
  if (!rename) {
    // Change the ids in the module.
    const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
    moduleContent.changeIds();
    moduleContentText = moduleContent.getModuleContentText();
  }
  await storage.saveModule(newModulePath, moduleContentText);
  if (rename) {
    // For rename, delete the old module.
    await storage.deleteModule(oldModule.modulePath);

    // Update the project's mechanisms or opModes.
    switch (oldModule.moduleType) {
      case storageModule.ModuleType.MECHANISM:
        const mechanism = project.mechanisms.find(m => m.modulePath === oldModule.modulePath);
        if (mechanism) {
          mechanism.modulePath = newModulePath;
          mechanism.className = newClassName;
        }
        break;
      case storageModule.ModuleType.OPMODE:
        const opMode = project.opModes.find(o => o.modulePath === oldModule.modulePath);
        if (opMode) {
          opMode.modulePath = newModulePath;
          opMode.className = newClassName;
        }
        break;
    }
  } else { // copy
    // Update the project's mechanisms or opModes.
    const newModule = {
      modulePath: newModulePath,
      moduleType: oldModule.moduleType,
      projectName: project.projectName,
      className: newClassName
    };
    switch (oldModule.moduleType) {
      case storageModule.ModuleType.MECHANISM:
        project.mechanisms.push(newModule as storageModule.Mechanism);
        break;
      case storageModule.ModuleType.OPMODE:
        project.opModes.push(newModule as storageModule.OpMode);
        break;
    }
  }

  return newModulePath;
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
export async function downloadProject(
    storage: commonStorage.Storage, projectName: string): Promise<string> {
  const modulePaths: string[] = await storage.listModulePaths(
      storageNames.makeModulePathRegexPattern(projectName));

  const fileNameToModuleContentText: {[fileName: string]: string} = {}; // value is module content text
  for (const modulePath of modulePaths) {
    const fileName = storageNames.getFileName(modulePath);
    const moduleContentText = await storage.fetchModuleContentText(modulePath);
    fileNameToModuleContentText[fileName] = moduleContentText;
  }

  const zip = new JSZip();
  for (const fileName in fileNameToModuleContentText) {
    const moduleContentText = fileNameToModuleContentText[fileName];
    zip.file(fileName, moduleContentText);
  }
  const content = await zip.generateAsync({ type: "blob" });
  return URL.createObjectURL(content);
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

export async function uploadProject(
    storage: commonStorage.Storage, projectName: string, blobUrl: string): Promise<void> {
  // Process the uploaded blob to get the file names and contents.
  const fileNameToModuleContentText = await processUploadedBlob(blobUrl);

  // Save each module.
  for (const fileName in fileNameToModuleContentText) {
    const moduleContentText = fileNameToModuleContentText[fileName];
    const className = storageNames.getClassName(fileName);
    const moduleType = storageNames.getModuleType(fileName);
    const modulePath = storageNames.makeModulePath(projectName, className, moduleType);
    await storage.saveModule(modulePath, moduleContentText);
  }
}

/**
 * Process the uploaded blob to get the module class names and contents.
 */
async function processUploadedBlob(blobUrl: string): Promise<{ [className: string]: string }> {

  const prefix = 'data:application/octet-stream;base64,';
  if (!blobUrl.startsWith(prefix)) {
    throw new Error('blobUrl does not have the expected prefix.');
  }
  const data = blobUrl.substring(prefix.length);

  const zip = await JSZip.loadAsync(data, { base64: true });
  const promises: { [key: string]: Promise<string> } = {};
  zip.forEach((fileName, zipEntry) => {
    promises[fileName] = zipEntry.async('text');
  });

  // Wait for all promises to resolve.
  const files: { [fileName: string]: string } = {}; // value is file content
  await Promise.all(
    Object.entries(promises).map(async ([fileName, promise]) => {
      files[fileName] = await promise;
    })
  );

  // Process each module's content.
  let foundRobot = false;
  const fileNameToModuleContentText: { [fileName: string]: string } = {}; // value is module content text
  for (const fileName in files) {
    const moduleType = storageNames.getModuleType(fileName);
    if (moduleType === storageModule.ModuleType.ROBOT) {
      foundRobot = true;
    }
    // Make sure we can parse the content.
    const moduleContent = storageModuleContent.parseModuleContentText(files[fileName]);
    fileNameToModuleContentText[fileName] = moduleContent.getModuleContentText();
  }

  if (!foundRobot) {
    throw new Error('Uploaded file did not contain a Robot.');
  }

  return fileNameToModuleContentText;
}
