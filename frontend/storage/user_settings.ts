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
 * @fileoverview The user's settings.
 *
 * The user's general settings are kept in one entry, userSettings. The settings for each project
 * are kept in their own entry, Project_<projectId>, which holds the project's open tabs and, under
 * Module_<moduleId>, the settings for each of its modules. The most recent project is kept in the
 * mostRecentProjectId entry.
 *
 * The entries for projects and the most recent project are tied to the storage the projects are
 * kept in, so their keys start with local/ or server/ (see commonStorage.makeStorageKey). The
 * general settings are shared, since they don't depend on where projects are kept.
 */

import * as commonStorage from './common_storage';

/** Storage key for the entry that holds the user's general settings. */
const USER_SETTINGS_KEY = 'userSettings';

/** Storage key for the projectId of the most recent project. */
const MOST_RECENT_PROJECT_ID_KEY = 'mostRecentProjectId';

const PROJECT_KEY_PREFIX = 'Project_';
const MODULE_KEY_PREFIX = 'Module_';

/** A workspace scroll position (the coordinates of the upper-left corner of the view). */
export interface ModuleScroll {
  x: number;
  y: number;
}

/** The settings for a module. */
export interface ModuleSettings {
  zoom?: number;
  scroll?: ModuleScroll;
}

type ModuleKey = `${typeof MODULE_KEY_PREFIX}${string}`;

/** The settings for a project, as they are kept in its Project_<projectId> entry. */
interface ProjectSettings {
  /** The moduleIds of the project's open tabs, in order. */
  openTabs?: string[];
  [moduleKey: ModuleKey]: ModuleSettings | undefined;
}

/** The user's general settings, as they are kept in the userSettings entry. */
export interface UserSettingsData {
  language?: string;
  theme?: string;
  renderer?: string;
  showSimpleClassNames?: boolean;
  /** The zoom level most recently used for any module. */
  lastZoom?: number;
  tourCompleted?: boolean;
  shownPythonToolboxCategories?: string[];
  hiddenLibraryToolboxKeys?: string[];
}

function makeProjectKey(storage: commonStorage.Storage, projectId: string): string {
  return commonStorage.makeStorageKey(storage, PROJECT_KEY_PREFIX + projectId);
}

function makeModuleKey(moduleId: string): ModuleKey {
  return `${MODULE_KEY_PREFIX}${moduleId}`;
}

/**
 * Updates of each entry that haven't finished yet. Updates of an entry are done one at a time, so
 * that one doesn't overwrite the changes made by another.
 */
const pendingUpdates = new Map<string, Promise<void>>();

function enqueueUpdate(entryKey: string, operation: () => Promise<void>): Promise<void> {
  const previous = pendingUpdates.get(entryKey) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(operation);
  pendingUpdates.set(entryKey, next);
  next.catch(() => {}).finally(() => {
    if (pendingUpdates.get(entryKey) === next) {
      pendingUpdates.delete(entryKey);
    }
  });
  return next;
}

/** Returns the parsed JSON object in an entry, or an empty object if there isn't one. */
async function fetchJsonEntry<T extends object>(
    storage: commonStorage.Storage, entryKey: string): Promise<T> {
  const json = await storage.fetchEntry(entryKey, '{}');
  try {
    const value = JSON.parse(json);
    return (value && typeof value === 'object') ? value : {} as T;
  } catch (error) {
    console.warn(`Failed to parse entry ${entryKey}, using default:`, error);
    return {} as T;
  }
}

/**
 * Changes the JSON object in an entry by calling update, which modifies the object it is given.
 * Properties that update sets to undefined are removed. The entry is only written if something
 * changed, and is deleted if the object is left empty.
 */
function updateJsonEntry<T extends object>(
    storage: commonStorage.Storage, entryKey: string, update: (value: T) => void): Promise<void> {
  return enqueueUpdate(entryKey, async () => {
    const value = await fetchJsonEntry<T>(storage, entryKey);
    const oldJson = JSON.stringify(value);
    update(value);
    // JSON.stringify leaves out properties that are undefined.
    const newJson = JSON.stringify(value);
    if (newJson === oldJson) {
      return;
    }
    if (newJson === '{}') {
      await storage.deleteEntry(entryKey);
    } else {
      await storage.saveEntry(entryKey, newJson);
    }
  });
}

/** Returns the user's general settings. */
export async function fetchUserSettings(
    storage: commonStorage.Storage): Promise<UserSettingsData> {
  return fetchJsonEntry<UserSettingsData>(storage, USER_SETTINGS_KEY);
}

/**
 * Changes the user's general settings by calling update, which modifies the settings it is given.
 * Properties that update sets to undefined are removed.
 */
export function updateUserSettings(
    storage: commonStorage.Storage,
    update: (settings: UserSettingsData) => void): Promise<void> {
  return updateJsonEntry(storage, USER_SETTINGS_KEY, update);
}

async function fetchProjectSettings(
    storage: commonStorage.Storage, projectId: string): Promise<ProjectSettings> {
  return fetchJsonEntry<ProjectSettings>(storage, makeProjectKey(storage, projectId));
}

/**
 * Changes the settings for a project by calling update, which modifies the settings it is given.
 * The project's entry is deleted if no settings are left.
 */
function updateProjectSettings(
    storage: commonStorage.Storage, projectId: string,
    update: (settings: ProjectSettings) => void): Promise<void> {
  return updateJsonEntry(storage, makeProjectKey(storage, projectId), update);
}

/** Returns the projectId of the most recent project, or '' if there isn't one. */
export async function fetchMostRecentProjectId(storage: commonStorage.Storage): Promise<string> {
  const entryKey = commonStorage.makeStorageKey(storage, MOST_RECENT_PROJECT_ID_KEY);
  return storage.fetchEntry(entryKey, '');
}

/** Saves the projectId of the most recent project. */
export async function saveMostRecentProjectId(
    storage: commonStorage.Storage, projectId: string): Promise<void> {
  const entryKey = commonStorage.makeStorageKey(storage, MOST_RECENT_PROJECT_ID_KEY);
  await enqueueUpdate(entryKey, () => projectId ?
      storage.saveEntry(entryKey, projectId) : storage.deleteEntry(entryKey));
}

/** Deletes the most recent projectId if it is one of the given projectIds. */
async function deleteMostRecentProjectIdIf(
    storage: commonStorage.Storage, shouldDelete: (projectId: string) => boolean): Promise<void> {
  const entryKey = commonStorage.makeStorageKey(storage, MOST_RECENT_PROJECT_ID_KEY);
  await enqueueUpdate(entryKey, async () => {
    const projectId = await storage.fetchEntry(entryKey, '');
    if (projectId && shouldDelete(projectId)) {
      await storage.deleteEntry(entryKey);
    }
  });
}

/** Returns the moduleIds of a project's saved open tabs. */
export async function fetchOpenTabs(
    storage: commonStorage.Storage, projectId: string): Promise<string[]> {
  const openTabs = (await fetchProjectSettings(storage, projectId)).openTabs;
  return Array.isArray(openTabs) ? openTabs : [];
}

/** Saves the moduleIds of a project's open tabs. */
export async function saveOpenTabs(
    storage: commonStorage.Storage, projectId: string, moduleIds: string[]): Promise<void> {
  await updateProjectSettings(storage, projectId, settings => {
    settings.openTabs = moduleIds;
  });
}

/** Returns the settings for a module. */
export async function fetchModuleSettings(
    storage: commonStorage.Storage, projectId: string, moduleId: string): Promise<ModuleSettings> {
  return (await fetchProjectSettings(storage, projectId))[makeModuleKey(moduleId)] ?? {};
}

/**
 * Changes the settings for a module by calling update, which modifies the settings it is given.
 * Properties that update sets to undefined are removed.
 */
export async function updateModuleSettings(
    storage: commonStorage.Storage, projectId: string, moduleId: string,
    update: (settings: ModuleSettings) => void): Promise<void> {
  const moduleKey = makeModuleKey(moduleId);
  await updateProjectSettings(storage, projectId, settings => {
    const moduleSettings = settings[moduleKey] ?? {};
    update(moduleSettings);
    const isEmpty = Object.values(moduleSettings).every(value => value === undefined);
    settings[moduleKey] = isEmpty ? undefined : moduleSettings;
  });
}

/** Removes the given modules from a project's settings. */
function removeModules(settings: ProjectSettings, shouldRemove: (moduleId: string) => boolean) {
  for (const key of Object.keys(settings)) {
    if (key.startsWith(MODULE_KEY_PREFIX) && shouldRemove(key.slice(MODULE_KEY_PREFIX.length))) {
      delete settings[key as ModuleKey];
    }
  }
  if (Array.isArray(settings.openTabs)) {
    settings.openTabs = settings.openTabs.filter(moduleId => !shouldRemove(moduleId));
  }
}

/**
 * Deletes the settings for a module that has been deleted.
 * @param storage The storage interface.
 * @param projectId The projectId of the project that contained the module.
 * @param moduleId The moduleId of the deleted module.
 */
export async function deleteModuleSettings(
    storage: commonStorage.Storage, projectId: string, moduleId: string): Promise<void> {
  await updateProjectSettings(storage, projectId, settings => {
    removeModules(settings, id => id === moduleId);
  });
}

/**
 * Deletes the settings for a project that has been deleted.
 * @param storage The storage interface.
 * @param projectId The projectId of the deleted project.
 */
export async function deleteProjectSettings(
    storage: commonStorage.Storage, projectId: string): Promise<void> {
  const entryKey = makeProjectKey(storage, projectId);
  await enqueueUpdate(entryKey, () => storage.deleteEntry(entryKey));
  await deleteMostRecentProjectIdIf(storage, id => id === projectId);
}

/**
 * Removes the settings for modules of a project that no longer exist.
 * @param storage The storage interface.
 * @param projectId The projectId of the project.
 * @param moduleIds The moduleIds of all the modules in the project.
 */
export async function removeStaleModuleSettings(
    storage: commonStorage.Storage, projectId: string, moduleIds: string[]): Promise<void> {
  const existingModuleIds = new Set(moduleIds);
  await updateProjectSettings(storage, projectId, settings => {
    removeModules(settings, moduleId => !existingModuleIds.has(moduleId));
  });
}

/**
 * Removes the settings for projects that no longer exist.
 * @param storage The storage interface.
 * @param projectIds The projectIds of all the projects.
 */
export async function removeStaleProjectSettings(
    storage: commonStorage.Storage, projectIds: string[]): Promise<void> {
  const existingProjectIds = new Set(projectIds);
  const projectKeyPrefix = makeProjectKey(storage, '');
  for (const entryKey of await storage.listEntryKeys()) {
    if (entryKey.startsWith(projectKeyPrefix) &&
        !existingProjectIds.has(entryKey.slice(projectKeyPrefix.length))) {
      await enqueueUpdate(entryKey, () => storage.deleteEntry(entryKey));
    }
  }
  await deleteMostRecentProjectIdIf(storage, id => !existingProjectIds.has(id));
}

/** Keys of the entries that held the user's settings before they were kept in userSettings. */
const LEGACY_KEYS = [
  'userLanguage', 'userTheme', 'userRenderer', 'userShowSimpleClassNames', 'userLastZoom',
  'mostRecentProject', 'tourCompleted', 'shownPythonToolboxCategories', 'hiddenLibraryToolboxKeys',
];
const LEGACY_KEY_PREFIXES = ['user_options_', 'userZoom_', 'userScroll_'];

/**
 * If the user's settings aren't in the userSettings entry yet, moves the general settings from
 * the entries they used to be kept in, and deletes those entries. The settings for projects and
 * modules, which were keyed by project name and module path, aren't moved.
 */
export async function upgradeLegacyEntries(storage: commonStorage.Storage): Promise<void> {
  const entryKeys = await storage.listEntryKeys();
  if (entryKeys.includes(USER_SETTINGS_KEY)) {
    return;
  }

  const legacyKeys = entryKeys.filter(key => LEGACY_KEYS.includes(key) ||
      LEGACY_KEY_PREFIXES.some(prefix => key.startsWith(prefix)));
  const legacyValues: {[key: string]: string} = {};
  for (const key of legacyKeys) {
    legacyValues[key] = await storage.fetchEntry(key, '');
  }
  const parseArray = (json: string | undefined): string[] | undefined => {
    try {
      const value = json ? JSON.parse(json) : undefined;
      return Array.isArray(value) ? value : undefined;
    } catch {
      return undefined;
    }
  };
  const lastZoom = parseFloat(legacyValues['userLastZoom']);
  const settings: UserSettingsData = {
    language: legacyValues['userLanguage'] || undefined,
    theme: legacyValues['userTheme'] || undefined,
    renderer: legacyValues['userRenderer'] || undefined,
    showSimpleClassNames: ('userShowSimpleClassNames' in legacyValues) ?
        legacyValues['userShowSimpleClassNames'].toLowerCase() === 'true' : undefined,
    lastZoom: Number.isNaN(lastZoom) ? undefined : lastZoom,
    tourCompleted: ('tourCompleted' in legacyValues) ?
        legacyValues['tourCompleted'] === 'true' : undefined,
    shownPythonToolboxCategories: parseArray(legacyValues['shownPythonToolboxCategories']),
    hiddenLibraryToolboxKeys: parseArray(legacyValues['hiddenLibraryToolboxKeys']),
  };
  // Save the entry even if there were no settings to move, so this isn't done again. This is
  // called before anything else uses the user's settings, so it doesn't need updateUserSettings.
  // JSON.stringify leaves out properties that are undefined.
  await storage.saveEntry(USER_SETTINGS_KEY, JSON.stringify(settings));
  for (const key of legacyKeys) {
    await storage.deleteEntry(key);
  }
}
