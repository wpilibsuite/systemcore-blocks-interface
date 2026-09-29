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
 * @fileoverview Keys for user settings entries that are tied to a project or a module, and
 * functions that keep those entries in sync when projects and modules are renamed or deleted.
 */

import * as commonStorage from './common_storage';
import * as storageNames from './names';

/** Storage key for the most recent project name. */
export const MOST_RECENT_PROJECT_NAME_KEY = 'mostRecentProject';

/** Returns the storage key for a project's open tabs. */
export function makeOpenTabsKey(projectName: string): string {
  return `user_options_${projectName}`;
}

/** Returns the storage key for a module's saved zoom level. */
export function makeModuleZoomKey(modulePath: string): string {
  return `userZoom_${modulePath}`;
}

/** Returns the storage key for a module's saved scroll position. */
export function makeModuleScrollKey(modulePath: string): string {
  return `userScroll_${modulePath}`;
}

/** Functions that make the keys of all the entries that are tied to a module path. */
const MODULE_ENTRY_KEY_MAKERS: ((modulePath: string) => string)[] = [
  makeModuleZoomKey,
  makeModuleScrollKey,
];

/** Sentinel returned by fetchEntry when an entry doesn't exist. */
const NO_ENTRY = '__no_entry__';

/** Moves the value of the entry at oldKey (if there is one) to newKey. */
async function moveEntry(
    storage: commonStorage.Storage, oldKey: string, newKey: string): Promise<void> {
  const value = await storage.fetchEntry(oldKey, NO_ENTRY);
  if (value !== NO_ENTRY) {
    await storage.saveEntry(newKey, value);
    await storage.deleteEntry(oldKey);
  }
}

/**
 * Updates the saved open tabs of a project by applying updateTabPaths to them, saving the result
 * under the open tabs key of newProjectName.
 */
async function updateOpenTabs(
    storage: commonStorage.Storage, projectName: string, newProjectName: string,
    updateTabPaths: (tabPaths: string[]) => string[]): Promise<void> {
  const oldKey = makeOpenTabsKey(projectName);
  const newKey = makeOpenTabsKey(newProjectName);
  const tabsJson = await storage.fetchEntry(oldKey, NO_ENTRY);
  if (tabsJson === NO_ENTRY) {
    return;
  }
  let tabPaths: string[];
  try {
    tabPaths = JSON.parse(tabsJson);
  } catch {
    tabPaths = [];
  }
  await storage.saveEntry(newKey, JSON.stringify(updateTabPaths(tabPaths)));
  if (newKey !== oldKey) {
    await storage.deleteEntry(oldKey);
  }
}

/** Moves the entries for a module whose path has changed. */
async function moveModuleEntries(
    storage: commonStorage.Storage, oldModulePath: string, newModulePath: string): Promise<void> {
  for (const makeKey of MODULE_ENTRY_KEY_MAKERS) {
    await moveEntry(storage, makeKey(oldModulePath), makeKey(newModulePath));
  }
}

/** Deletes the entries for a module. */
async function deleteModuleEntries(
    storage: commonStorage.Storage, modulePath: string): Promise<void> {
  for (const makeKey of MODULE_ENTRY_KEY_MAKERS) {
    await storage.deleteEntry(makeKey(modulePath));
  }
}

/**
 * Updates the user settings entries for a module that has been renamed.
 * @param storage The storage interface.
 * @param projectName The name of the project containing the module.
 * @param oldModulePath The path of the module before it was renamed.
 * @param newModulePath The path of the module after it was renamed.
 */
export async function renameModuleSettings(
    storage: commonStorage.Storage, projectName: string,
    oldModulePath: string, newModulePath: string): Promise<void> {
  await moveModuleEntries(storage, oldModulePath, newModulePath);
  await updateOpenTabs(storage, projectName, projectName,
      tabPaths => tabPaths.map(path => path === oldModulePath ? newModulePath : path));
}

/**
 * Deletes the user settings entries for a module that has been deleted.
 * @param storage The storage interface.
 * @param projectName The name of the project that contained the module.
 * @param modulePath The path of the deleted module.
 */
export async function deleteModuleSettings(
    storage: commonStorage.Storage, projectName: string, modulePath: string): Promise<void> {
  await deleteModuleEntries(storage, modulePath);
  await updateOpenTabs(storage, projectName, projectName,
      tabPaths => tabPaths.filter(path => path !== modulePath));
}

/**
 * Updates the user settings entries for a project that has been renamed.
 * @param storage The storage interface.
 * @param projectName The name of the project before it was renamed.
 * @param newProjectName The name of the project after it was renamed.
 * @param fileNames The names of the files in the project.
 */
export async function renameProjectSettings(
    storage: commonStorage.Storage, projectName: string, newProjectName: string,
    fileNames: string[]): Promise<void> {
  const newModulePaths: {[oldModulePath: string]: string} = {};
  for (const fileName of fileNames) {
    const oldModulePath = storageNames.makeFilePath(projectName, fileName);
    const newModulePath = storageNames.makeFilePath(newProjectName, fileName);
    newModulePaths[oldModulePath] = newModulePath;
    await moveModuleEntries(storage, oldModulePath, newModulePath);
  }
  await updateOpenTabs(storage, projectName, newProjectName,
      tabPaths => tabPaths.map(path => newModulePaths[path] ?? path));

  const mostRecentProjectName = await storage.fetchEntry(MOST_RECENT_PROJECT_NAME_KEY, '');
  if (mostRecentProjectName === projectName) {
    await storage.saveEntry(MOST_RECENT_PROJECT_NAME_KEY, newProjectName);
  }
}

/**
 * Deletes the user settings entries for a project that has been deleted.
 * @param storage The storage interface.
 * @param projectName The name of the deleted project.
 * @param fileNames The names of the files that were in the project.
 */
export async function deleteProjectSettings(
    storage: commonStorage.Storage, projectName: string, fileNames: string[]): Promise<void> {
  for (const fileName of fileNames) {
    await deleteModuleEntries(storage, storageNames.makeFilePath(projectName, fileName));
  }
  await storage.deleteEntry(makeOpenTabsKey(projectName));

  const mostRecentProjectName = await storage.fetchEntry(MOST_RECENT_PROJECT_NAME_KEY, '');
  if (mostRecentProjectName === projectName) {
    await storage.deleteEntry(MOST_RECENT_PROJECT_NAME_KEY);
  }
}
