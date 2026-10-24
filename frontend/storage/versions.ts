/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Versions of a project, which the user can compare with or go back to.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as commonStorage from './common_storage';
import * as storageNames from './names';
import * as storageProject from './project';
import * as versionDiff from './version_diff';
import { MemoryStorage } from './memory_storage';
import { upgradeProjectIfNecessary } from './upgrade_project';

// A version is a copy of the project's files, kept in the project's versions directory (see
// names.ts). Renaming or deleting a project renames or deletes its versions too, but copying or
// downloading a project leaves them out. Stored versions are never changed: if a version was saved
// with an older storage format, it is upgraded in memory when it is fetched.

export type VersionInfo = {
  versionId: string,
  description: string,
  createdAt: string, // ISO 8601
};

/**
 * Returns the versions of the given project, newest first.
 */
export async function listVersions(
    storage: commonStorage.Storage, projectName: string): Promise<VersionInfo[]> {
  const versionDirectoryNames = await storage.list(
      storageNames.makeVersionsDirectoryPath(projectName));
  const versions: VersionInfo[] = [];
  for (const versionDirectoryName of versionDirectoryNames) {
    if (!versionDirectoryName.endsWith('/')) {
      continue;
    }
    const versionId = versionDirectoryName.slice(0, versionDirectoryName.length - 1);
    try {
      versions.push(await fetchVersionInfo(storage, projectName, versionId));
    } catch (e) {
      console.error('Failed to load version ' + versionId + ':', e);
    }
  }
  versions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return versions;
}

async function fetchVersionInfo(
    storage: commonStorage.Storage, projectName: string, versionId: string): Promise<VersionInfo> {
  const text = await storage.fetchFileContentText(storageNames.makeVersionFilePath(
      projectName, versionId, storageNames.VERSION_INFO_FILE_NAME));
  const parsed = JSON.parse(text);
  return {
    versionId: versionId,
    description: parsed.description || '',
    createdAt: parsed.createdAt || '',
  };
}

async function saveVersionInfo(
    storage: commonStorage.Storage, projectName: string, versionInfo: VersionInfo): Promise<void> {
  await storage.saveFile(
      storageNames.makeVersionFilePath(
          projectName, versionInfo.versionId, storageNames.VERSION_INFO_FILE_NAME),
      JSON.stringify(versionInfo, null, 2));
}

/**
 * Returns a new version id. It is used in file paths (and URLs, with a backend), so it only has
 * lowercase letters and digits, unlike Blockly's ids.
 */
function makeVersionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/**
 * Creates a version holding a copy of the project's current files.
 */
export async function createVersion(
    storage: commonStorage.Storage, projectName: string, description: string): Promise<VersionInfo> {
  const versionInfo: VersionInfo = {
    versionId: makeVersionId(),
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };
  const files = await storageProject.fetchProjectFiles(storage, projectName);
  for (const fileName in files) {
    await storage.saveFile(
        storageNames.makeVersionFilePath(projectName, versionInfo.versionId, fileName),
        files[fileName]);
  }
  // The info file is saved last, so that a version whose files weren't all saved isn't listed.
  await saveVersionInfo(storage, projectName, versionInfo);
  return versionInfo;
}

/**
 * Changes the description of a version.
 */
export async function updateVersionDescription(
    storage: commonStorage.Storage, projectName: string, versionId: string,
    description: string): Promise<void> {
  const versionInfo = await fetchVersionInfo(storage, projectName, versionId);
  versionInfo.description = description.trim();
  await saveVersionInfo(storage, projectName, versionInfo);
}

/**
 * Deletes a version.
 */
export async function deleteVersion(
    storage: commonStorage.Storage, projectName: string, versionId: string): Promise<void> {
  await storage.delete(storageNames.makeVersionDirectoryPath(projectName, versionId));
}

/**
 * Returns the files of a version (its modules and project info file) as a map of
 * fileName → content, upgraded to the current storage format.
 */
export async function fetchVersionFiles(
    storage: commonStorage.Storage, projectName: string,
    versionId: string): Promise<{[fileName: string]: string}> {
  const versionDirectoryPath = storageNames.makeVersionDirectoryPath(projectName, versionId);
  const memoryStorage = new MemoryStorage();
  for (const fileName of await storage.list(versionDirectoryPath)) {
    if (storageNames.isValidModuleFileName(fileName) ||
        storageNames.isValidProjectInfoFileName(fileName)) {
      await memoryStorage.saveFile(
          storageNames.makeFilePath(projectName, fileName),
          await storage.fetchFileContentText(versionDirectoryPath + fileName));
    }
  }
  await upgradeProjectIfNecessary(memoryStorage, projectName);
  return storageProject.fetchProjectFiles(memoryStorage, projectName);
}

/**
 * Replaces the project's files with the files of a version. First, the project's current files
 * are saved as a new version with the given description, so the user can get them back.
 * The project keeps its projectId, so the user's settings for it still apply.
 * Returns the version that was created.
 */
export async function restoreVersionInPlace(
    storage: commonStorage.Storage, projectName: string, versionId: string,
    descriptionOfCurrentState: string): Promise<VersionInfo> {
  const versionFiles = await fetchVersionFiles(storage, projectName, versionId);
  const currentProjectInfo = await storageProject.fetchProjectInfo(storage, projectName);
  const backup = await createVersion(storage, projectName, descriptionOfCurrentState);

  // Delete modules that were added after the version was created.
  for (const fileName of await storageProject.listProjectFileNames(storage, projectName)) {
    if (storageNames.isValidModuleFileName(fileName) && !(fileName in versionFiles)) {
      await storage.delete(storageNames.makeFilePath(projectName, fileName));
    }
  }
  const moduleFiles: {[fileName: string]: string} = {};
  for (const fileName in versionFiles) {
    if (storageNames.isValidModuleFileName(fileName)) {
      moduleFiles[fileName] = versionFiles[fileName];
    }
  }
  await storageProject.uploadProjectFiles(storage, projectName, moduleFiles);

  const versionProjectInfo = await storageProject.fetchProjectInfo(
      await makeStorageWithFiles(projectName, versionFiles), projectName);
  versionProjectInfo.projectId = currentProjectInfo.projectId;
  await storageProject.saveProjectInfo(storage, projectName, versionProjectInfo);
  return backup;
}

/**
 * Returns true if the project has changed since its newest version was created, or if it has no
 * versions.
 */
export async function hasChangesSinceLatestVersion(
    storage: commonStorage.Storage, projectName: string): Promise<boolean> {
  const versions = await listVersions(storage, projectName);
  if (!versions.length) {
    return true;
  }
  return hasChangesBetween(
      projectName,
      await fetchVersionFiles(storage, projectName, versions[0].versionId),
      await storageProject.fetchProjectFiles(storage, projectName));
}

/**
 * Returns true if two sets of the project's files (maps of fileName → content) are different.
 * Modules are compared the same way as when comparing with a version, and the project's gamepad
 * configuration is compared too, since restoring a version restores it.
 */
export async function hasChangesBetween(
    projectName: string,
    oldFiles: {[fileName: string]: string},
    newFiles: {[fileName: string]: string}): Promise<boolean> {
  if (versionDiff.diffModules(oldFiles, newFiles).some(
      moduleDiff => moduleDiff.change !== versionDiff.ModuleChange.UNCHANGED)) {
    return true;
  }
  const oldProjectInfo = await storageProject.fetchProjectInfo(
      await makeStorageWithFiles(projectName, oldFiles), projectName);
  const newProjectInfo = await storageProject.fetchProjectInfo(
      await makeStorageWithFiles(projectName, newFiles), projectName);
  return JSON.stringify(oldProjectInfo.gamepadConfig) !==
      JSON.stringify(newProjectInfo.gamepadConfig);
}

/**
 * Creates a new project from the files of a version.
 */
export async function restoreVersionAsNewProject(
    storage: commonStorage.Storage, projectName: string, versionId: string,
    newProjectName: string): Promise<void> {
  const versionFiles = await fetchVersionFiles(storage, projectName, versionId);
  await storageProject.createProjectFromSample(storage, versionFiles, newProjectName);
}

async function makeStorageWithFiles(
    projectName: string, files: {[fileName: string]: string}): Promise<MemoryStorage> {
  const memoryStorage = new MemoryStorage();
  await storageProject.uploadProjectFiles(memoryStorage, projectName, files);
  return memoryStorage;
}
