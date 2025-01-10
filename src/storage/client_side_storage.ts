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

const databaseName = 'systemcore-blocks-interface';
let db = false;

function openDatabase(callback) {
  const openRequest = window.indexedDB.open(databaseName, 1);
  openRequest.onerror = function(event) {
    console.log('IndexedDB open request failed:');
    console.log(openRequest.error);
    callback(false, 'openRequest error');
  };
  openRequest.onupgradeneeded = function(event) {
    const db1 = event.target.result;

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
  openRequest.onsuccess = function(event) {
    db = event.target.result;
    callback(true, '');
  };
}

export function saveEntry(entryKey, entryValue, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
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
  transaction.oncomplete = function(event) {
    if (callback) {
      callback(true, '');
    }
  };
  const entriesObjectStore = transaction.objectStore('entries');
  const getRequest = entriesObjectStore.get(entryKey);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    if (callback) {
      callback(false, 'Save entry failed. (getRequest error)');
    }
  };
  getRequest.onsuccess = function(event) {
    let value;
    if (event.target.result === undefined) {
      value = Object.create(null);
      value.key = entryKey;
    } else {
      value = event.target.result;
    }
    value.value = entryValue;
    const putRequest = entriesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      if (callback) {
        callback(false, 'Save entry failed. (putRequest error)');
      }
    };
  };
}

export function fetchEntry(entryKey, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
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
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(null, 'Fetch entry failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      // Entry does not exist.
      callback(null, 'Entry does not exist');
      return;
    }
    const value = event.target.result;
    callback(value.value, '');
  };
}

export function listModules(callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        listModules(callback);
      } else {
        callback(null, 'List modules failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspaces = {}; // key is workspace name, value is Workspace item
  const opModes = {}; // key is workspace name, value is list of OpMode items
  const openCursorRequest = db.transaction(['modules'], 'readonly')
      .objectStore('modules')
      .openCursor();
  openCursorRequest.onerror = function(event) {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    callback(null, 'List modules failed. Could not open cursor.');
  };
  openCursorRequest.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      const value = cursor.value;
      const path = value.path;
      const item = {
        modulePath: path,
        moduleType: value.type,
        workspaceName: commonStorage.getWorkspaceName(path),
        moduleName: commonStorage.getModuleName(path),
        dateModifiedMillis: value.dateModifiedMillis,
      }
      if (value.type === commonStorage.MODULE_TYPE_WORKSPACE) {
        workspaces[item.workspaceName] = item;
        if (item.workspaceName in opModes) {
          item.opModes = opModes[item.workspaceName];
          delete opModes[item.workspaceName];
        } else {
          item.opModes = [];
        }
      } else if (value.type === commonStorage.MODULE_TYPE_OPMODE) {
        if (item.workspaceName in workspaces) {
          workspaces[item.workspaceName].opModes.push(item);
        } else if (item.workspaceName in opModes) {
          opModes[item.workspaceName].push(item);
        } else {
          opModes[item.workspaceName] = [item];
        }
      }
      cursor.continue();
    } else {
      const modules = [];
      const sortedWorkspaceNames = Object.keys(workspaces).sort();
      sortedWorkspaceNames.forEach((workspaceName) => {
        modules.push(workspaces[workspaceName]);
      });
      callback(modules, '');
    }
  };
}

export function fetchModuleContent(modulePath, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
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
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(null, 'Fetch module failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      // Module does not exist.
      callback(null, 'Module does not exist');
      return;
    }
    const value = event.target.result;
    callback(value.content, '');
  };
}

export function createModule(moduleType, modulePath, moduleContent, callback) {
  _saveModule(moduleType, modulePath, moduleContent, callback);
}

export function saveModule(modulePath, moduleContent, callback) {
  _saveModule('', modulePath, moduleContent, callback);
}

function _saveModule(moduleType, modulePath, moduleContent, callback) {
  // When creating a new module, moduleType must be truthy.
  // When saving an existing module, the moduleType must be falsy.
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        _saveModule(moduleType, modulePath, moduleContent, callback);
      } else {
        callback(false, 'Save module failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(modulePath);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Save module failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    let value;
    if (event.target.result === undefined) {
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
      value = event.target.result;
    }
    value.content = moduleContent;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Save module failed. (putRequest error)');
    };
  };
}

export function renameWorkspace(oldWorkspaceName, newWorkspaceName, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
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
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(oldWorkspacePath);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Rename workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      callback(false, 'Rename workspace failed. (workspace not found)');
      return;
    }
    const value = event.target.result;
    value.path = newWorkspacePath;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Rename workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      const deleteRequest = modulesObjectStore.delete(oldWorkspacePath);
      deleteRequest.onerror = function(event) {
        console.log('IndexedDB delete request failed:');
        console.log(deleteRequest.error);
        callback(false, 'Rename workspace failed. (deleteRequest error)');
      };
      deleteRequest.onsuccess = function(event) {
        // TODO(lizlooney): Rename all OpModes in the workspace.
      };
    };
  };
}

export function copyWorkspace(oldWorkspaceName, newWorkspaceName, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
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
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(oldWorkspacePath);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Copy workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      callback(false, 'Copy workspace failed. (workspace not found)');
      return;
    }
    const value = event.target.result;
    value.path = newWorkspacePath;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Copy workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      // TODO(lizlooney): Copy all OpModes in the workspace.
    };
  };
}

export function deleteWorkspaces(workspaceNames, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        deleteWorkspaces(workspaceNames, callback);
      } else {
        callback(false, 'Delete workspaces failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const errorReasons = [];
  const successes = [];
  const callback1 = function(success, errorReason) {
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

export function deleteOneWorkspace(workspaceName, callback) {
  const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const deleteRequest = modulesObjectStore.delete(workspacePath);
  deleteRequest.onerror = function(event) {
    console.log('IndexedDB delete request failed:');
    console.log(deleteRequest.error);
    callback(false, 'deleteRequest error');
  };
  deleteRequest.onsuccess = function(event) {
    // TODO(lizlooney): Delete all the OpModes in the workspace directory.
  };
}
