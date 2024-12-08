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

let db = false;

function openDatabase(callback) {
  const openRequest = window.indexedDB.open('systemcore-blocks-interface', 1);
  openRequest.onerror = function(event) {
    callback(false, 'openRequest error');
  };
  openRequest.onupgradeneeded = function(event) {
    const db1 = event.target.result;

    // Create the object store for files.
    db1.createObjectStore('files', { keyPath: 'FileName' })
        .createIndex("name", "name", { unique: true });
  };
  openRequest.onsuccess = function(event) {
    db = event.target.result;
    callback(true, '');
  };
}

function listWorkspaces(callback) {
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
    callback(null, 'Fetch workspaces failed. Could not open cursor.');
  };
  openCursorRequest.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      const value = cursor.value;
      workspaces.push({
        name: value['name'],
        dateModifiedMillis: value['dateModifiedMillis']
      });
      cursor.continue();
    } else {
      callback(workspaces, '');
    }
  };
}

function fetchWorkspaceFileContent(workspaceName, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        fetchWorkspaceFileContent(workspaceName, callback);
      } else {
        callback(null, 'Fetch workspace file failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const getRequest = db.transaction(['files'], 'readonly')
      .objectStore('files').index("name").get(workspaceName);
  getRequest.onerror = function(event) {
    callback(null, 'Fetch workspace file failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      // File does not exist. Create a new workspace.
      newWorkspace(workspaceName, callback);
      return;
    }
    const value = event.target.result;
    callback(value['Content'], '');
  };
}

function newWorkspace(workspaceName, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        newWorkspace(workspaceName, callback);
      } else {
        callback(false, 'New workspace failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const pythonCode = '\n';
  const blocksForExports = '[]';
  const blocksContent = '{}';
  const workspaceFileContent = commonStorage.makeFileContent(pythonCode, blocksForExports, blocksContent);
  saveWorkspace(
    workspaceName, workspaceFileContent,
    function(success, errorMessage) {
      callback(workspaceFileContent, errorMessage);
    }
  );
}

function saveWorkspace(workspaceName, workspaceFileContent, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        saveWorkspace(workspaceName, workspaceFileContent, callback);
      } else {
        callback(false, 'Save workspace failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspaceFileName = workspaceName + '.py';
  const transaction = db.transaction(['files'], 'readwrite');
  transaction.oncomplete = function(event) {
    callback(true, '');
  };
  const filesObjectStore = transaction.objectStore('files');
  const getRequest = filesObjectStore.get(workspaceFileName);
  getRequest.onerror = function(event) {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    callback(false, 'Save workspace failed');
  };
  getRequest.onsuccess = function(event) {
    let value;
    if (event.target.result === undefined) {
      value = Object.create(null);
      value['FileName'] = workspaceFileName;
      value['name'] = workspaceName;
    } else {
      value = event.target.result;
    }
    value['Content'] = workspaceFileContent;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
    putRequest.onerror = function(event) {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      callback(false, 'Save workspace failed');
    };
  };
}

function renameWorkspace(oldWorkspaceName, newWorkspaceName, callback) {
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
  const oldFileName = oldWorkspaceName + '.py';
  const newFileName = newWorkspaceName + '.py';
  const filesObjectStore = db.transaction(['files'], 'readwrite')
      .objectStore('files');
  const getRequest = filesObjectStore.get(oldFileName);
  getRequest.onerror = function(event) {
    callback(false, 'Rename workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      callback(false, 'Rename workspace failed. (workspace not found)');
      return;
    }
    const value = event.target.result;
    value['FileName'] = newFileName;
    value['name'] = newWorkspaceName;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
    putRequest.onerror = function(event) {
      callback(false, 'Rename workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      const deleteRequest = filesObjectStore.delete(oldFileName);
      deleteRequest.onerror = function(event) {
        callback(false, 'Rename workspace failed. (deleteRequest error)');
      };
      deleteRequest.onsuccess = function(event) {
        callback(true, '');
      };
    };
  };
}

function copyWorkspace(oldWorkspaceName, newWorkspaceName, callback) {
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
  const oldFileName = oldWorkspaceName + '.py';
  const newFileName = newWorkspaceName + '.py';
  const filesObjectStore = db.transaction(['files'], 'readwrite')
      .objectStore('files');
  const getRequest = filesObjectStore.get(oldFileName);
  getRequest.onerror = function(event) {
    callback(false, 'Copy workspace failed. (getRequest error)');
  };
  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      callback(false, 'Copy workspace failed. (workspace not found)');
      return;
    }
    const value = event.target.result;
    value['FileName'] = newFileName;
    value['name'] = newWorkspaceName;
    value['dateModifiedMillis'] = Date.now();
    const putRequest = filesObjectStore.put(value);
    putRequest.onerror = function(event) {
      callback(false, 'Copy workspace failed. (putRequest error)');
    };
    putRequest.onsuccess = function(event) {
      callback(true, '');
    };
  };
}

function deleteWorkspaces(starDelimitedWorkspaceNames, callback) {
  if (!db) {
    openDatabase(function(success, errorReason) {
      if (success) {
        deleteWorkspaces(starDelimitedWorkspaceNames, callback);
      } else {
        callback(false, 'Delete workspaces failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const workspaceNames = starDelimitedWorkspaceNames.split('*');
  const errorReasons = [];
  let successCount = 0;

  for (let i = 0; i < workspaceNames.length; i++) {
    deleteOneWorkspace(workspaceNames[i], function(success, errorReason) {
      if (success) {
        successCount++;
      } else {
        errorReasons.push(errorReason);
      }
      if (successCount + errorReasons.length == workspaceNames.length) {
        if (errorReasons.length == 0) {
          callback(true, '');
        } else {
          callback(false, 'Delete workspaces failed. (' + errorReasons.join(', ') + ')');
        }
      }
    });
  }
}

function deleteOneWorkspace(workspaceName, callback) {
  const workspaceFileName = workspaceName + '.py';
  const deleteRequest = db.transaction(['files'], 'readwrite')
      .objectStore('files')
      .delete(workspaceFileName);
  deleteRequest.onerror = function(event) {
    callback(false, 'deleteRequest error');
  };
  deleteRequest.onsuccess = function(event) {
    callback(true, '');
  };
}

export {
  openDatabase,
  listWorkspaces,
  fetchWorkspaceFileContent,
  newWorkspace,
  saveWorkspace,
  renameWorkspace,
  copyWorkspace,
  deleteWorkspaces,
  deleteOneWorkspace
}
