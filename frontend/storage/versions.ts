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

import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';

import * as commonStorage from './common_storage';
import * as storageNames from './names';
import * as storageProject from './project';
import * as versionDiff from './version_diff';
import { MemoryStorage } from './memory_storage';
import { upgradeProjectIfNecessary } from './upgrade_project';

// A version is a list of the project's files, kept in the project's versions directory (see
// names.ts), with the hash of each file's content. The content is stored once for each hash, in the
// versions' objects directory, so a file that is the same in many versions is only stored once.
// Renaming or deleting a project renames or deletes its versions too, but copying or downloading a
// project leaves them out. Stored versions and objects are never changed: if a version was saved
// with an older storage format, it is upgraded in memory when it is fetched.
//
// Nothing stops two users of the same robot from creating and deleting versions at the same time,
// so the order of the steps in createVersion and collectGarbage matters; see those functions.

export type VersionInfo = {
  versionId: string,
  description: string,
  createdAt: string, // ISO 8601
};

/**
 * The contents of a version's info file, plus its versionId, which is the file's name and isn't
 * saved in it.
 */
type VersionManifest = VersionInfo & {
  files: {[fileName: string]: string}, // the hash of each file's content
  // False while the version's objects are being saved. Incomplete versions aren't listed.
  complete: boolean,
};

/**
 * How long after it was created a version that is still incomplete is considered abandoned (for
 * example, because the browser was closed while it was being saved), and is deleted.
 */
const ABANDONED_VERSION_AGE_MS = 60 * 60 * 1000;

/**
 * Returns the versions of the given project, newest first.
 */
export async function listVersions(
    storage: commonStorage.Storage, projectName: string): Promise<VersionInfo[]> {
  const versions: VersionInfo[] = [];
  for (const manifest of await fetchAllManifests(storage, projectName)) {
    if (manifest.complete) {
      versions.push({
        versionId: manifest.versionId,
        description: manifest.description,
        createdAt: manifest.createdAt,
      });
    }
  }
  versions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return versions;
}

/**
 * Returns the manifests of all of the given project's versions, including incomplete ones. Versions
 * whose info file can't be read (for example, because it is from before versions listed their
 * files) are left out.
 */
async function fetchAllManifests(
    storage: commonStorage.Storage, projectName: string): Promise<VersionManifest[]> {
  const names = await storage.list(storageNames.makeVersionsDirectoryPath(projectName));
  const manifests: VersionManifest[] = [];
  for (const name of names) {
    // Skip the objects directory.
    if (!name.endsWith(storageNames.VERSION_INFO_FILE_EXTENSION)) {
      continue;
    }
    const versionId = name.slice(0, name.length - storageNames.VERSION_INFO_FILE_EXTENSION.length);
    try {
      manifests.push(await fetchManifest(storage, projectName, versionId));
    } catch (e) {
      console.error('Failed to load version ' + versionId + ':', e);
    }
  }
  return manifests;
}

async function fetchManifest(
    storage: commonStorage.Storage, projectName: string,
    versionId: string): Promise<VersionManifest> {
  const text = await storage.fetchFileContentText(
      storageNames.makeVersionInfoPath(projectName, versionId));
  const parsed = JSON.parse(text);
  if (!parsed.files || typeof parsed.files !== 'object') {
    throw new Error('Version ' + versionId + ' does not list its files.');
  }
  return {
    versionId: versionId,
    description: parsed.description || '',
    createdAt: parsed.createdAt || '',
    files: parsed.files,
    complete: parsed.complete === true,
  };
}

async function saveManifest(
    storage: commonStorage.Storage, projectName: string, manifest: VersionManifest): Promise<void> {
  const {versionId, ...content} = manifest;
  await storage.saveFile(
      storageNames.makeVersionInfoPath(projectName, versionId),
      JSON.stringify(content, null, 2));
}

/** Returns the hashes of the objects that are stored for the given project's versions. */
async function listObjectHashes(
    storage: commonStorage.Storage, projectName: string): Promise<Set<string>> {
  // Each object's file name is its hash.
  const fileNames = await storage.list(storageNames.makeVersionObjectsDirectoryPath(projectName));
  return new Set(fileNames.filter(fileName => !fileName.endsWith('/')));
}

/**
 * Returns the SHA-256 hash of the given text, as lowercase hex. The browser's own crypto.subtle
 * can't be used, since it is only available in secure contexts, and the robot is served over http.
 */
export function hashContent(text: string): string {
  return bytesToHex(sha256(utf8ToBytes(text)));
}

/**
 * Returns a new version id: 16 lowercase letters and digits, the current time in milliseconds in
 * base 36 (8 digits from 1972 until 2059) followed by 8 random base 36 digits, so two versions
 * only collide if they are created in the same millisecond and get the same random digits. It is
 * used in file paths (and URLs, with a backend), so it only has lowercase letters and digits,
 * unlike Blockly's ids. 
 */
function makeVersionId(): string {
  return Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10).padEnd(8, '0');
}

/**
 * Creates a version of the project's current files.
 */
export async function createVersion(
    storage: commonStorage.Storage, projectName: string,
    description: string): Promise<VersionInfo> {
  const files = await storageProject.fetchProjectFiles(storage, projectName);
  const hashToContent = new Map<string, string>();
  const fileHashes: {[fileName: string]: string} = {};
  for (const fileName in files) {
    const hash = hashContent(files[fileName]);
    fileHashes[fileName] = hash;
    hashToContent.set(hash, files[fileName]);
  }
  const manifest: VersionManifest = {
    versionId: makeVersionId(),
    description: description.trim(),
    createdAt: new Date().toISOString(),
    files: fileHashes,
    complete: false,
  };

  // The manifest is saved before the objects, so that collectGarbage (which lists the objects
  // before it reads the manifests) never deletes an object that this version is about to use.
  await saveManifest(storage, projectName, manifest);
  const saveMissingObjects = async (): Promise<void> => {
    const storedHashes = await listObjectHashes(storage, projectName);
    for (const [hash, content] of hashToContent) {
      if (!storedHashes.has(hash)) {
        await storage.saveFile(storageNames.makeVersionObjectPath(projectName, hash), content);
      }
    }
  };
  await saveMissingObjects();
  // Look again, in case an object that was already stored was deleted by collectGarbage after
  // deleting another version, before this version's manifest was saved.
  await saveMissingObjects();

  manifest.complete = true;
  await saveManifest(storage, projectName, manifest);
  return {
    versionId: manifest.versionId,
    description: manifest.description,
    createdAt: manifest.createdAt,
  };
}

/**
 * Changes the description of a version.
 */
export async function updateVersionDescription(
    storage: commonStorage.Storage, projectName: string, versionId: string,
    description: string): Promise<void> {
  const manifest = await fetchManifest(storage, projectName, versionId);
  manifest.description = description.trim();
  await saveManifest(storage, projectName, manifest);
}

/**
 * Deletes a version, and the objects that no other version uses.
 */
export async function deleteVersion(
    storage: commonStorage.Storage, projectName: string, versionId: string): Promise<void> {
  await storage.delete(storageNames.makeVersionInfoPath(projectName, versionId));
  await collectGarbage(storage, projectName);
}

/**
 * Deletes the objects that no version uses, and versions that were abandoned while they were being
 * created. The objects are listed before the manifests are read: createVersion saves a version's
 * manifest before its objects, so any object that is listed here belongs to a manifest that is
 * read here, and objects saved after the list was made are left alone.
 */
async function collectGarbage(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const storedHashes = await listObjectHashes(storage, projectName);
  const usedHashes = new Set<string>();
  const now = Date.now();
  for (const manifest of await fetchAllManifests(storage, projectName)) {
    if (!manifest.complete &&
        now - new Date(manifest.createdAt).getTime() > ABANDONED_VERSION_AGE_MS) {
      await storage.delete(storageNames.makeVersionInfoPath(projectName, manifest.versionId));
      continue;
    }
    Object.values(manifest.files).forEach(hash => usedHashes.add(hash));
  }
  for (const hash of storedHashes) {
    if (!usedHashes.has(hash)) {
      await storage.delete(storageNames.makeVersionObjectPath(projectName, hash));
    }
  }
}

/**
 * Returns the files of a version (its modules and project info file) as a map of
 * fileName → content, upgraded to the current storage format.
 */
export async function fetchVersionFiles(
    storage: commonStorage.Storage, projectName: string,
    versionId: string): Promise<{[fileName: string]: string}> {
  const manifest = await fetchManifest(storage, projectName, versionId);
  const memoryStorage = new MemoryStorage();
  for (const fileName in manifest.files) {
    if (storageNames.isValidModuleFileName(fileName) ||
        storageNames.isValidProjectInfoFileName(fileName)) {
      // This throws if the object is missing.
      const content = await storage.fetchFileContentText(
          storageNames.makeVersionObjectPath(projectName, manifest.files[fileName]));
      await memoryStorage.saveFile(storageNames.makeFilePath(projectName, fileName), content);
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
    leftFiles: {[fileName: string]: string},
    rightFiles: {[fileName: string]: string}): Promise<boolean> {
  if (versionDiff.diffModules(leftFiles, rightFiles).some(
      moduleDiff => moduleDiff.change !== versionDiff.ModuleChange.UNCHANGED)) {
    return true;
  }
  const leftProjectInfo = await storageProject.fetchProjectInfo(
      await makeStorageWithFiles(projectName, leftFiles), projectName);
  const rightProjectInfo = await storageProject.fetchProjectInfo(
      await makeStorageWithFiles(projectName, rightFiles), projectName);
  return JSON.stringify(leftProjectInfo.gamepadConfig) !==
      JSON.stringify(rightProjectInfo.gamepadConfig);
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
