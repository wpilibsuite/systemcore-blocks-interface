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

export async function listProjects(storage: commonStorage.Storage): Promise<Project[]> {
  const pathToModuleContent = await storage.listModules();

  const projects: {[key: string]: Project} = {}; // key is project name, value is Project
  // The mechanisms and opModes variables hold any Mechanisms and OpModes that
  // are read before the Project to which they belong is read.
  const mechanisms: {[key: string]: storageModule.Mechanism[]} = {}; // key is project name, value is list of Mechanisms
  const opModes: {[key: string]: storageModule.OpMode[]} = {}; // key is project name, value is list of OpModes

  for (const modulePath in pathToModuleContent) {
    const moduleContent = pathToModuleContent[modulePath];
    const moduleType = moduleContent.getModuleType();
    const dateModifiedMillis = await storage.fetchModuleDateModifiedMillis(modulePath);
    const module: storageModule.Module = {
      modulePath: modulePath,
      moduleType: moduleType,
      moduleId: moduleContent.getModuleId(),
      projectName: storageNames.getProjectName(modulePath),
      className: storageNames.getClassName(modulePath),
      dateModifiedMillis: dateModifiedMillis,
    };
    if (moduleType === storageModule.MODULE_TYPE_ROBOT) {
      const robot: storageModule.Robot = module as storageModule.Robot;
      const project: Project = {
        projectName: module.projectName,
        robot: robot,
        mechanisms: [],
        opModes: [],
      };
      projects[project.projectName] = project;
      // Add any Mechanisms that belong to this project that have already
      // been read.
      if (project.projectName in mechanisms) {
        project.mechanisms = mechanisms[project.projectName];
        delete mechanisms[project.projectName];
      }
      // Add any OpModes that belong to this project that have already been
      // read.
      if (project.projectName in opModes) {
        project.opModes = opModes[project.projectName];
        delete opModes[project.projectName];
      }
    } else if (moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      const mechanism: storageModule.Mechanism = module as storageModule.Mechanism;
      if (mechanism.projectName in projects) {
        // If the Project to which this Mechanism belongs has already been read,
        // add this Mechanism to it.
        projects[mechanism.projectName].mechanisms.push(mechanism);
      } else {
        // Otherwise, add this Mechanism to the mechanisms local variable.
        if (mechanism.projectName in mechanisms) {
          mechanisms[mechanism.projectName].push(mechanism);
        } else {
          mechanisms[mechanism.projectName] = [mechanism];
        }
      }
    } else if (moduleType === storageModule.MODULE_TYPE_OPMODE) {
      const opMode: storageModule.OpMode = module as storageModule.OpMode;
      if (opMode.projectName in projects) {
        // If the Project to which this OpMode belongs has already been read,
        // add this OpMode to it.
        projects[opMode.projectName].opModes.push(opMode);
      } else {
        // Otherwise, add this OpMode to the opModes local variable.
        if (opMode.projectName in opModes) {
          opModes[opMode.projectName].push(opMode);
        } else {
          opModes[opMode.projectName] = [opMode];
        }
      }
    }
  }

  const projectsList: Project[] = [];
  const sortedProjectNames = Object.keys(projects).sort();
  sortedProjectNames.forEach((projectName) => {
    projectsList.push(projects[projectName]);
  });
  return projectsList;
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

  const opmodePath = storageNames.makeModulePath(newProjectName, storageNames.CLASS_NAME_TELEOP);
  const opmodeContent = storageModuleContent.newOpModeContent(newProjectName, storageNames.CLASS_NAME_TELEOP);
  await storage.saveModule(opmodePath, opmodeContent);
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
  await renameOrCopyProject(storage, project, newProjectName, true);
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
  await renameOrCopyProject(storage, project, newProjectName, false);
}

async function renameOrCopyProject(
    storage: commonStorage.Storage, project: Project, newProjectName: string,
    rename: boolean): Promise<void> {
  const modulePathPrefix = storageNames.makeModulePathPrefix(project.projectName);
  const pathToModuleContent = await storage.listModules(
      (modulePath: string) => modulePath.startsWith(modulePathPrefix));

  for (const modulePath in pathToModuleContent) {
    const className = storageNames.getClassName(modulePath);
    const newModulePath = storageNames.makeModulePath(newProjectName, className);
    const moduleContentText = pathToModuleContent[modulePath].getModuleContentText();
    await storage.saveModule(newModulePath, moduleContentText);
    if (rename) {
      await storage.deleteModule(modulePath);
    }
  }
}

/**
 * Deletes a project.
 * @param storage The storage interface to use for deleting the project.
 * @param project The project to delete.
 * @returns A promise that resolves when the project has been deleted.
 */
export async function deleteProject(
    storage: commonStorage.Storage, project: Project): Promise<void> {
  const modulePathPrefix = storageNames.makeModulePathPrefix(project.projectName);
  const pathToModuleContent = await storage.listModules(
      (modulePath: string) => modulePath.startsWith(modulePathPrefix));
  for (const modulePath in pathToModuleContent) {
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
  storage: commonStorage.Storage, project: Project, moduleType: string, newClassName: string): Promise<void> {
  const newModulePath = storageNames.makeModulePath(project.projectName, newClassName);

  if (moduleType === storageModule.MODULE_TYPE_MECHANISM) {
    const mechanismContent = storageModuleContent.newMechanismContent(project.projectName, newClassName);
    await storage.saveModule(newModulePath, mechanismContent);
    project.mechanisms.push({
      modulePath: newModulePath,
      moduleType: storageModule.MODULE_TYPE_MECHANISM,
      projectName: project.projectName,
      className: newClassName
    } as storageModule.Mechanism);
  } else if (moduleType === storageModule.MODULE_TYPE_OPMODE) {
    const opModeContent = storageModuleContent.newOpModeContent(project.projectName, newClassName);
    await storage.saveModule(newModulePath, opModeContent);
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
    await storage.deleteModule(modulePath);
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
 * @returns The new path of the module, as a promise that resolves when the module has been copied.
 */
export async function renameModuleInProject(
    storage: commonStorage.Storage, project: Project, newClassName: string, oldModulePath: string): Promise<string> {
  const module = findModuleByModulePath(project, oldModulePath);
  if (!module) {
    throw new Error('Failed to find module with path ' + oldModulePath);
  }
  if (module.moduleType == storageModule.MODULE_TYPE_ROBOT) {
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
  if (module.moduleType == storageModule.MODULE_TYPE_ROBOT) {
    throw new Error('Copying the robot module is not allowed.');
  }
  return await renameOrCopyModule(storage, project, newClassName, module, false);
}

async function renameOrCopyModule(
    storage: commonStorage.Storage, project: Project, newClassName: string,
    oldModule: storageModule.Module, rename: boolean): Promise<string> {
  const pathToModuleContent = await storage.listModules(
      (modulePath: string) => modulePath === oldModule.modulePath);
  if (! (oldModule.modulePath in pathToModuleContent)) {
    throw new Error('Failed to find module with path ' + oldModule.modulePath);
  }

  const newModulePath = storageNames.makeModulePath(project.projectName, newClassName);
  const moduleContentText = pathToModuleContent[oldModule.modulePath].getModuleContentText();
  await storage.saveModule(newModulePath, moduleContentText);
  if (rename) {
    // For rename, delete the old module.
    await storage.deleteModule(oldModule.modulePath);

    // Update the project's mechanisms or opModes.
    if (oldModule.moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      const mechanism = project.mechanisms.find(m => m.modulePath === oldModule.modulePath);
      if (mechanism) {
        mechanism.modulePath = newModulePath;
        mechanism.className = newClassName;
      }
    } else if (oldModule.moduleType === storageModule.MODULE_TYPE_OPMODE) {
      const opMode = project.opModes.find(o => o.modulePath === oldModule.modulePath);
      if (opMode) {
        opMode.modulePath = newModulePath;
        opMode.className = newClassName;
      }
    }
  } else {
    // Update the project's mechanisms or opModes.
    if (oldModule.moduleType === storageModule.MODULE_TYPE_MECHANISM) {
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: storageModule.MODULE_TYPE_MECHANISM,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.Mechanism);
    } else if (oldModule.moduleType === storageModule.MODULE_TYPE_OPMODE) {
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: storageModule.MODULE_TYPE_OPMODE,
        projectName: project.projectName,
        className: newClassName
      } as storageModule.OpMode);
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
  const modulePathPrefix = storageNames.makeModulePathPrefix(projectName);
  const pathToModuleContent = await storage.listModules(
      (modulePath: string) => modulePath.startsWith(modulePathPrefix));

  const classNameToModuleContentText: {[className: string]: string} = {}; // value is module content text
  for (const modulePath in pathToModuleContent) {
    const className = storageNames.getClassName(modulePath);
    const moduleContentText = pathToModuleContent[modulePath].getModuleContentText();
    classNameToModuleContentText[className] = moduleContentText;
  }

  const zip = new JSZip();
  for (const className in classNameToModuleContentText) {
    const moduleContentText = classNameToModuleContentText[className];
    const filename = className + storageNames.JSON_FILE_EXTENSION;
    zip.file(filename, moduleContentText);
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
  // Process the uploaded blob to get the module types and contents.
  const classNameToModuleContentText = await processUploadedBlob(blobUrl);

  // Save each module.
  for (const className in classNameToModuleContentText) {
    const moduleContentText = classNameToModuleContentText[className];
    const modulePath = storageNames.makeModulePath(projectName, className);
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
  let foundRobot = false;
  const classNameToModuleContentText: { [className: string]: string } = {}; // value is module content text
  for (const filename in files) {
    const className = filename;
    if (className === storageNames.CLASS_NAME_ROBOT) {
      foundRobot = true;
    }
    // Make sure we can parse the content.
    const moduleContent = storageModuleContent.parseModuleContentText(files[filename]);
    classNameToModuleContentText[className] = moduleContent.getModuleContentText();
  }

  if (!foundRobot) {
    throw new Error('Uploaded file did not contain a Robot.');
  }

  return classNameToModuleContentText;
}
