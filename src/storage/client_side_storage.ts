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

import * as commonStorage from './common_storage';

// Functions for saving blocks modules to client side storage.

export type BooleanCallback = (success: boolean, error: string) => void;
export type StringCallback = (value: string | null, error: string) => void;
export type ModulesCallback = (modules: commonStorage.Workspace[] | null, error: string) => void;


const databaseName = 'systemcore-blocks-interface';
let db: IDBDatabase | null = null;

function openDatabase(callback: BooleanCallback): void {
  const openRequest = window.indexedDB.open(databaseName, 1);
  openRequest.onerror = (event: Event) => {
    console.log('IndexedDB open request failed:');
    console.log(openRequest.error);
    callback(false, 'openRequest error');
  };
  openRequest.onupgradeneeded = (event: Event) => {
    const db1 = openRequest.result;

    var stores = db1.objectStoreNames;

    if (!stores.contains('modules')) {
      // Create the object store for modules.
      db1.createObjectStore('modules', { keyPath: 'path' });
    }

    if (!stores.contains('entries')) {
      // Create an object store for key/value entries.
      db1.createObjectStore('entries', { keyPath: 'key' });
    }
  };
  openRequest.onsuccess = (event: Event) => {
    db = openRequest.result;
    callback(true, '');
  };
}

export function saveEntry(
    entryKey: string, entryValue: string,
    callback: BooleanCallback | null = null): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        saveEntry(entryKey, entryValue, callback);
      } else {
        if (callback) {
          callback(false, 'Save entry failed. (' + errorReason + ')');
        }
      }
    });
    return;
  }
  const transaction = db.transaction(['entries'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    if (callback) {
      callback(true, '');
    }
  };
  const entriesObjectStore = transaction.objectStore('entries');
  const getRequest = entriesObjectStore.get(entryKey);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    if (callback) {
      callback(false, 'Save entry failed. (getRequest error)');
    }
  };
  getRequest.onsuccess = (event: Event) => {
    let value;
    if (getRequest.result === undefined) {
      value = Object.create(null);
      value.key = entryKey;
    } else {
      value = getRequest.result;
    }
    value.value = entryValue;
    const putRequest = entriesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      if (callback) {
        callback(false, 'Save entry failed. (putRequest error)');
      }
    };
  };
}

export function fetchEntry(entryKey: string, callback: StringCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        fetchEntry(entryKey, callback);
      } else {
        callback(null, 'Fetch entry failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const getRequest = db.transaction(['entries'], 'readonly')
      .objectStore('entries').get(entryKey);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(null, 'Fetch entry failed. (getRequest error)');
  };
  getRequest.onsuccess = (event: Event) => {
    if (getRequest.result === undefined) {
      // Entry does not exist.
      callback(null, 'Entry does not exist');
      return;
    }
    const value = getRequest.result;
    callback(value.value, '');
  };
}

export function listModules(callback: ModulesCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        listModules(callback);
      } else {
        callback(null, 'List modules failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspaces: {[key: string]: commonStorage.Workspace} = {}; // key is workspace name, value is Workspace
  const opModes: {[key: string]: commonStorage.OpMode[]} = {}; // key is workspace name, value is list of OpModes
  const openCursorRequest = db.transaction(['modules'], 'readonly')
      .objectStore('modules')
      .openCursor();
  openCursorRequest.onerror = (event: Event) => {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    callback(null, 'List modules failed. Could not open cursor.');
  };
  openCursorRequest.onsuccess = (event: Event) => {
    const cursor = openCursorRequest.result;
    if (cursor) {
      const value = cursor.value;
      const path = value.path;
      const module: commonStorage.Module = {
        modulePath: path,
        moduleType: value.type,
        workspaceName: commonStorage.getWorkspaceName(path),
        moduleName: commonStorage.getModuleName(path),
        dateModifiedMillis: value.dateModifiedMillis,
      }
      if (value.type === commonStorage.MODULE_TYPE_WORKSPACE) {
        const workspace: commonStorage.Workspace = {
          ...module,
          opModes: [],
        };
        workspaces[workspace.workspaceName] = workspace;
        if (workspace.workspaceName in opModes) {
          workspace.opModes = opModes[workspace.workspaceName];
          delete opModes[workspace.workspaceName];
        } else {
          workspace.opModes = [];
        }
      } else if (value.type === commonStorage.MODULE_TYPE_OPMODE) {
        const opMode: commonStorage.OpMode = {
          ...module,
        };
        if (opMode.workspaceName in workspaces) {
          workspaces[opMode.workspaceName].opModes.push(opMode);
        } else if (opMode.workspaceName in opModes) {
          opModes[opMode.workspaceName].push(opMode);
        } else {
          opModes[opMode.workspaceName] = [opMode];
        }
      }
      cursor.continue();
    } else {
      const modules: commonStorage.Workspace[] = [];
      const sortedWorkspaceNames = Object.keys(workspaces).sort();
      sortedWorkspaceNames.forEach((workspaceName) => {
        modules.push(workspaces[workspaceName]);
      });
      callback(modules, '');
    }
  };
}

export function fetchModuleContent(
    modulePath: string,
    callback : (content: string | null, error: string) => void): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        fetchModuleContent(modulePath, callback);
      } else {
        callback(null, 'Fetch module failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const getRequest = db.transaction(['modules'], 'readonly')
      .objectStore('modules').get(modulePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(null, 'Fetch module failed. (getRequest error)');
  };
  getRequest.onsuccess = (event: Event) => {
    if (getRequest.result === undefined) {
      // Module does not exist.
      callback(null, 'Module does not exist');
      return;
    }
    const value = getRequest.result;
    callback(value.content, '');
  };
}

export function createModule(
    moduleType: string, modulePath: string, moduleContent: string,
    callback: BooleanCallback): void {
  _saveModule(moduleType, modulePath, moduleContent, callback);
}

export function saveModule(
    modulePath: string, moduleContent: string,
    callback: BooleanCallback): void {
  _saveModule('', modulePath, moduleContent, callback);
}

function _saveModule(
    moduleType: string, modulePath: string, moduleContent: string,
    callback: BooleanCallback): void {
  // When creating a new module, moduleType must be truthy.
  // When saving an existing module, the moduleType must be falsy.
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        _saveModule(moduleType, modulePath, moduleContent, callback);
      } else {
        callback(false, 'Save module failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(modulePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Save module failed. (getRequest error)');
  };
  getRequest.onsuccess = (event: Event) => {
    let value;
    if (getRequest.result === undefined) {
      if (!moduleType) {
        throw new Error('Module type must be truthy when creating a module.');
      }
      value = Object.create(null);
      value.path = modulePath;
      value.type = moduleType;
    } else {
      if (moduleType) {
        throw new Error('Module type must be falsy when saving an existing module.');
      }
      value = getRequest.result;
    }
    value.content = moduleContent;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Save module failed. (putRequest error)');
    };
  };
}

export function renameWorkspace(
    oldWorkspaceName: string, newWorkspaceName: string,
    callback: BooleanCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        renameWorkspace(oldWorkspaceName, newWorkspaceName, callback);
      } else {
        callback(false, 'Rename workspace failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const oldWorkspacePath = commonStorage.makeModulePath(oldWorkspaceName, oldWorkspaceName);
  const newWorkspacePath = commonStorage.makeModulePath(newWorkspaceName, newWorkspaceName);
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(oldWorkspacePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Rename workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = (event: Event) => {
    if (getRequest.result === undefined) {
      callback(false, 'Rename workspace failed. (workspace not found)');
      return;
    }
    const value = getRequest.result;
    value.path = newWorkspacePath;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Rename workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = (event: Event) => {
      const deleteRequest = modulesObjectStore.delete(oldWorkspacePath);
      deleteRequest.onerror = (event: Event) => {
        console.log('IndexedDB delete request failed:');
        console.log(deleteRequest.error);
        callback(false, 'Rename workspace failed. (deleteRequest error)');
      };
      deleteRequest.onsuccess = (event: Event) => {
        // TODO(lizlooney): Rename all OpModes in the workspace.
      };
    };
  };
}

export function copyWorkspace(
    oldWorkspaceName: string, newWorkspaceName: string,
    callback: BooleanCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        copyWorkspace(oldWorkspaceName, newWorkspaceName, callback);
      } else {
        callback(false, 'Copy workspace failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const oldWorkspacePath = commonStorage.makeModulePath(oldWorkspaceName, oldWorkspaceName);
  const newWorkspacePath = commonStorage.makeModulePath(newWorkspaceName, newWorkspaceName);
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(oldWorkspacePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Copy workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = (event: Event) => {
    if (getRequest.result === undefined) {
      callback(false, 'Copy workspace failed. (workspace not found)');
      return;
    }
    const value = getRequest.result;
    value.path = newWorkspacePath;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Copy workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = (event: Event) => {
      // TODO(lizlooney): Copy all OpModes in the workspace.
    };
  };
}

export function deleteWorkspaces(
    workspaceNames: string[],
    callback: BooleanCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        deleteWorkspaces(workspaceNames, callback);
      } else {
        callback(false, 'Delete workspaces failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const errorReasons: string[] = [];
  const successes: boolean[] = [];
  const callback1 = (success: boolean, errorReason: string) => {
    if (success) {
      successes.push(true);
    } else {
      errorReasons.push(errorReason);
    }
    if (successes.length + errorReasons.length === workspaceNames.length) {
      if (errorReasons.length === 0) {
        callback(true, '');
      } else {
        callback(false, 'Delete workspaces failed. (' + errorReasons.join(', ') + ')');
      }
    }
  };
  workspaceNames.forEach((workspaceName) => {
    deleteOneWorkspace(workspaceName, callback1);
  });
}

export function deleteOneWorkspace(
    workspaceName: string,
    callback: BooleanCallback): void {
  if (!db) {
    openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        deleteOneWorkspace(workspaceName, callback);
      } else {
        callback(false, 'Delete workspace failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const deleteRequest = modulesObjectStore.delete(workspacePath);
  deleteRequest.onerror = (event: Event) => {
    console.log('IndexedDB delete request failed:');
    console.log(deleteRequest.error);
    callback(false, 'deleteRequest error');
  };
  deleteRequest.onsuccess = (event: Event) => {
    // TODO(lizlooney): Delete all the OpModes in the workspace directory.
  };
}
