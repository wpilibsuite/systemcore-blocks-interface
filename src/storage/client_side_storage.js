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

import * as commonStorage from './common_storage.js'

// Functions for saving blocks files to client side storage.

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

    if (!stores.contains('files')) {
      // Create the object store for files.
      db1.createObjectStore('files', { keyPath: 'filePath' });
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
      value['key'] = entryKey;
    } else {
      value = event.target.result;
    }
    value['value'] = entryValue;
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
    callback(value['value'], '');
  };
}

export function listWorkspaces(callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        listWorkspaces(callback);
      } else {
        callback(null, 'List workspaces failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspaces = [];
  const openCursorRequest = db.transaction(['files'], 'readonly')
      .objectStore('files')
      .openCursor();
  openCursorRequest.onerror = function(event) {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    callback(null, 'Fetch workspaces failed. Could not open cursor.');
  };
  openCursorRequest.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      const value = cursor.value;
      const filePath = value['filePath']
      if (value['type'] === commonStorage.MODULE_TYPE_WORKSPACE) {
        workspaces.push({
          name: commonStorage.getModuleName(filePath),
          dateModifiedMillis: value['dateModifiedMillis']
        });
      }
      cursor.continue();
    } else {
      callback(workspaces, '');
    }
  };
}

export function fetchModuleFileContent(moduleFilePath, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        fetchModuleFileContent(moduleFilePath, callback);
      } else {
        callback(null, 'Fetch module file failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const getRequest = db.transaction(['files'], 'readonly')
      .objectStore('files').get(moduleFilePath);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(null, 'Fetch module file failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      // File does not exist.
      callback(null, 'Module does not exist');
      return;
    }
    const value = event.target.result;
    callback(value['content'], '');
  };
}

export function saveModule(moduleType, moduleFilePath, moduleFileContent, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        saveModule(moduleType, moduleFilePath, moduleFileContent, callback);
      } else {
        callback(false, 'Save module failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const transaction = db.transaction(['files'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const filesObjectStore = transaction.objectStore('files');
  const getRequest = filesObjectStore.get(moduleFilePath);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Save module failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    let value;
    if (event.target.result === undefined) {
      value = Object.create(null);
      value['filePath'] = moduleFilePath;
      value['type'] = moduleType;
    } else {
      value = event.target.result;
    }
    value['content'] = moduleFileContent;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
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
  const oldWorkspaceFilePath = commonStorage.makeModuleFilePath(oldWorkspaceName, oldWorkspaceName);
  const newWorkspaceFilePath = commonStorage.makeModuleFilePath(newWorkspaceName, newWorkspaceName);
  const transaction = db.transaction(['files'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const filesObjectStore = transaction.objectStore('files');
  const getRequest = filesObjectStore.get(oldWorkspaceFilePath);
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
    value['filePath'] = newWorkspaceFilePath;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Rename workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      const deleteRequest = filesObjectStore.delete(oldWorkspaceFilePath);
      deleteRequest.onerror = function(event) {
        console.log('IndexedDB delete request failed:');
        console.log(deleteRequest.error);
        callback(false, 'Rename workspace failed. (deleteRequest error)');
      };
      deleteRequest.onsuccess = function(event) {
        // TODO(lizlooney): Rename all opmodes in the workspace.
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
  const oldWorkspaceFilePath = commonStorage.makeModuleFilePath(oldWorkspaceName, oldWorkspaceName);
  const newWorkspaceFilePath = commonStorage.makeModuleFilePath(newWorkspaceName, newWorkspaceName);
  const transaction = db.transaction(['files'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const filesObjectStore = transaction.objectStore('files');
  const getRequest = filesObjectStore.get(oldWorkspaceFilePath);
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
    value['filePath'] = newWorkspaceFilePath;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Copy workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      // TODO(lizlooney): Copy all opmodes in the workspace.
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
  for (let i = 0; i < workspaceNames.length; i++) {
    deleteOneWorkspace(workspaceNames[i], callback1);
  }
}

export function deleteOneWorkspace(workspaceName, callback) {
  const workspaceFilePath = commonStorage.makeModuleFilePath(workspaceName, workspaceName);
  const transaction = db.transaction(['files'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const filesObjectStore = transaction.objectStore('files');
  const deleteRequest = filesObjectStore.delete(workspaceFilePath);
  deleteRequest.onerror = function(event) {
    console.log('IndexedDB delete request failed:');
    console.log(deleteRequest.error);
    callback(false, 'deleteRequest error');
  };
  deleteRequest.onsuccess = function(event) {
    // TODO(lizlooney): Delete all the opmodes in the workspace directory.
  };
}
