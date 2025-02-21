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
export type ModulesCallback = (modules: commonStorage.Project[] | null, error: string) => void;


const databaseName = 'systemcore-blocks-interface';
let db: IDBDatabase | null = null;

function _openDatabase(callback: BooleanCallback): void {
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
    _openDatabase((success: boolean, errorReason: string) => {
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
  transaction.onabort = () => {
    if (callback) {
      callback(false, 'Save entry failed.');
    }
  };
  const entriesObjectStore = transaction.objectStore('entries');
  const getRequest = entriesObjectStore.get(entryKey);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    throw new Error('getRequest error');
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
      throw new Error('putRequest error');
    };
  };
}

export function fetchEntry(entryKey: string, defaultValue: string, callback: StringCallback): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        fetchEntry(entryKey, defaultValue, callback);
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
      callback(defaultValue, '');
      return;
    }
    const value = getRequest.result;
    callback(value.value, '');
  };
}

export function listModules(callback: ModulesCallback): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        listModules(callback);
      } else {
        callback(null, 'List modules failed. (' + errorReason + ')');
      }
    });
    return;
  }
  const projects: {[key: string]: commonStorage.Project} = {}; // key is project name, value is Project
  // The mechanisms and opModes variables hold any Mechanisms and OpModes that
  // are read before the Project to which they belong is read.
  const mechanisms: {[key: string]: commonStorage.Mechanism[]} = {}; // key is project name, value is list of Mechanisms
  const opModes: {[key: string]: commonStorage.OpMode[]} = {}; // key is project name, value is list of OpModes
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
      const moduleType = value.type;
      const module: commonStorage.Module = {
        modulePath: path,
        moduleType: moduleType,
        projectName: commonStorage.getProjectName(path),
        moduleName: commonStorage.getModuleName(path),
        dateModifiedMillis: value.dateModifiedMillis,
      }
      if (moduleType === commonStorage.MODULE_TYPE_PROJECT) {
        const project: commonStorage.Project = {
          ...module,
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
      } else if (moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
        const mechanism: commonStorage.Mechanism = {
          ...module,
        };
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
      } else if (moduleType === commonStorage.MODULE_TYPE_OPMODE) {
        const opMode: commonStorage.OpMode = {
          ...module,
        };
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
      cursor.continue();
    } else {
      // The cursor is done. We have finished reading all the modules.
      const modules: commonStorage.Project[] = [];
      const sortedProjectNames = Object.keys(projects).sort();
      sortedProjectNames.forEach((projectName) => {
        modules.push(projects[projectName]);
      });
      callback(modules, '');
    }
  };
}

export function fetchModuleContent(
    modulePath: string,
    callback : (content: string | null, error: string) => void): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
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
    _openDatabase((success: boolean, errorReason: string) => {
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
  transaction.onabort = () => {
    callback(false, 'Save module failed.');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const getRequest = modulesObjectStore.get(modulePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    throw new Error('getRequest error');
  };
  getRequest.onsuccess = (event: Event) => {
    let value;
    if (getRequest.result === undefined) {
      // The module does not exist.
      // Let's make sure that's what we expected.
      if (!moduleType) {
        // If moduleType is not truthy, we are trying to save an existing module.
        // It is unexpected that the module does not exist.
        throw new Error('Unable to save module ' + modulePath + ' because the module does not exist.');
      }
      value = Object.create(null);
      value.path = modulePath;
      value.type = moduleType;
    } else {
      // The module already exists.
      // Let's make sure if that's what we expected.
      if (moduleType) {
        // Since moduleType is truthy, we are trying to create a new module.
        // It is unexpected that the module already exists.
        throw new Error('Unable to create module ' + modulePath + ' because the module already exists.');
      }
      value = getRequest.result;
    }
    value.content = moduleContent;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      throw new Error('putRequest error');
    };
  };
}

function _renameOrCopyProject(
    oldProjectName: string, newProjectName: string,
    callback: BooleanCallback, copy: boolean): void {
  const errorMessage = copy
      ? 'Copy Project failed.'
      : 'Rename Project failed.'
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        _renameOrCopyProject(oldProjectName, newProjectName, callback, copy);
      } else {
        callback(false, errorMessage + ' (' + errorReason + ')');
      }
    });
    return;
  }

  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  transaction.onabort = () => {
    callback(false, errorMessage);
  };
  const modulesObjectStore = transaction.objectStore('modules');
  // First get the list of modules in the project.
  const oldToNewModulePaths: {[key: string]: string} = {};
  const openCursorRequest = modulesObjectStore.openCursor();
  openCursorRequest.onerror = (event: Event) => {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    throw new Error('openCursorRequest error');
  };
  openCursorRequest.onsuccess = (event: Event) => {
    const cursor = openCursorRequest.result;
    if (cursor) {
      const value = cursor.value;
      const path = value.path;
      const moduleType = value.type;
      if (commonStorage.getProjectName(path) === oldProjectName) {
        let newPath;
        if (moduleType === commonStorage.MODULE_TYPE_PROJECT) {
          newPath = commonStorage.makeProjectPath(newProjectName);
        } else {
          const moduleName = commonStorage.getModuleName(path);
          newPath = commonStorage.makeModulePath(newProjectName, moduleName);
        }
        oldToNewModulePaths[path] = newPath;
      }
      cursor.continue();
    } else {
      // Now rename the project for each of the modules.
      Object.entries(oldToNewModulePaths).forEach(([oldModulePath, newModulePath]) => {
        const getRequest = modulesObjectStore.get(oldModulePath);
        getRequest.onerror = (event: Event) => {
          console.log('IndexedDB get request failed:');
          console.log(getRequest.error);
          throw new Error('getRequest error');
        };
        getRequest.onsuccess = (event: Event) => {
          if (getRequest.result === undefined) {
            throw new Error('project not found');
          }
          const value = getRequest.result;
          value.path = newModulePath;
          value.dateModifiedMillis = Date.now();
          const putRequest = modulesObjectStore.put(value);
          putRequest.onerror = (event: Event) => {
            console.log('IndexedDB put request failed:');
            console.log(putRequest.error);
            throw new Error('putRequest error');
          };
          putRequest.onsuccess = (event: Event) => {
            if (!copy) {
              const deleteRequest = modulesObjectStore.delete(oldModulePath);
              deleteRequest.onerror = (event: Event) => {
                console.log('IndexedDB delete request failed:');
                console.log(deleteRequest.error);
                throw new Error('deleteRequest error');
              };
              deleteRequest.onsuccess = (event: Event) => {
              };
            }
          };
        };
      });
    }
  };
}

export function renameModule(
    moduleType: string, projectName: string,
    oldModuleName: string, newModuleName: string,
    callback: BooleanCallback): void {
  _renameOrCopyModule(
      moduleType, projectName, oldModuleName, newModuleName,
      callback, false);
}

export function copyModule(
    moduleType: string, projectName: string,
    oldModuleName: string, newModuleName: string,
    callback: BooleanCallback): void {
  _renameOrCopyModule(
      moduleType, projectName, oldModuleName, newModuleName,
      callback, true);
}

function _renameOrCopyModule(
    moduleType: string, projectName: string,
    oldModuleName: string, newModuleName: string,
    callback: BooleanCallback, copy: boolean): void {

  if (moduleType == commonStorage.MODULE_TYPE_PROJECT) {
    _renameOrCopyProject(oldModuleName, newModuleName, callback, copy);
    return;
  }

  const errorMessage = copy
      ? 'Copy module failed.'
      : 'Rename module failed.'

  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        _renameOrCopyModule(
            moduleType, projectName, oldModuleName, newModuleName,
            callback, copy);
      } else {
        callback(false, errorMessage + '(' + errorReason + ')');
      }
    });
    return;
  }

  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  transaction.onabort = () => {
    callback(false, errorMessage);
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const oldModulePath = commonStorage.makeModulePath(projectName, oldModuleName);
  const newModulePath = commonStorage.makeModulePath(projectName, newModuleName);
  const getRequest = modulesObjectStore.get(oldModulePath);
  getRequest.onerror = (event: Event) => {
    console.log('IndexedDB get request failed:');
    console.log(getRequest.error);
    throw new Error('getRequest error');
  };
  getRequest.onsuccess = (event: Event) => {
    if (getRequest.result === undefined) {
      throw new Error('module not found');
      return;
    }
    const value = getRequest.result;
    value.path = newModulePath;
    value.dateModifiedMillis = Date.now();
    const putRequest = modulesObjectStore.put(value);
    putRequest.onerror = (event: Event) => {
      console.log('IndexedDB put request failed:');
      console.log(putRequest.error);
      throw new Error('putRequest error');
    };
    putRequest.onsuccess = (event: Event) => {
      if (!copy) {
        const deleteRequest = modulesObjectStore.delete(oldModulePath);
        deleteRequest.onerror = (event: Event) => {
          console.log('IndexedDB delete request failed:');
          console.log(deleteRequest.error);
          throw new Error('deleteRequest error');
        };
        deleteRequest.onsuccess = (event: Event) => {
        };
      }
    };
  };
}

function _deleteProject(
    projectName: string, callback: BooleanCallback): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        deleteProject(projectName, callback);
      } else {
        callback(false, 'Delete project failed. (' + errorReason + ')');
      }
    });
    return;
  }

  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  transaction.onabort = () => {
    callback(false, 'Delete project failed.');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  // First get the list of modulePaths in the project.
  const modulePaths: string[] = [];
  const openCursorRequest = modulesObjectStore.openCursor();
  openCursorRequest.onerror = (event: Event) => {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    throw new Error('openCursorRequest error');
  };
  openCursorRequest.onsuccess = (event: Event) => {
    const cursor = openCursorRequest.result;
    if (cursor) {
      const value = cursor.value;
      const path = value.path;
      if (commonStorage.getProjectName(path) === projectName) {
        modulePaths.push(path);
      }
      cursor.continue();
    } else {
      // Now delete each of the modules.
      modulePaths.forEach((modulePath) => {
        const deleteRequest = modulesObjectStore.delete(modulePath);
        deleteRequest.onerror = (event: Event) => {
          console.log('IndexedDB delete request failed:');
          console.log(deleteRequest.error);
          throw new Error('deleteRequest error');
        };
        deleteRequest.onsuccess = (event: Event) => {
        };
      });
    }
  };
}

export function deleteModule(
    moduleType: string, modulePath: string,
    callback: BooleanCallback): void {

  if (moduleType == commonStorage.MODULE_TYPE_PROJECT) {
    const projectName = commonStorage.getProjectName(modulePath);
    _deleteProject(projectName, callback);
    return;
  }

  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        deleteModule(modulePath, callback);
      } else {
        callback(false, 'Delete module failed. (' + errorReason + ')');
      }
    });
    return;
  }

  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  transaction.onabort = () => {
    callback(false, 'Delete module failed.');
  };
  const modulesObjectStore = transaction.objectStore('modules');
  const deleteRequest = modulesObjectStore.delete(modulePath);
  deleteRequest.onerror = (event: Event) => {
    console.log('IndexedDB delete request failed:');
    console.log(deleteRequest.error);
    throw new Error('deleteRequest error');
  };
  deleteRequest.onsuccess = (event: Event) => {
  };
}

export async function downloadProject(projectName: string, callback: StringCallback): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        downloadProject(projectName, callback);
      } else {
        callback(null, 'Download project failed. (' + errorReason + ')');
      }
    });
    return;
  }

  // Collect all the modules in the project.
  const moduleContents: {[key: string]: string} = {}; // key is module name, value is module content
  const openCursorRequest = db.transaction(['modules'], 'readonly')
      .objectStore('modules')
      .openCursor();
  openCursorRequest.onerror = (event: Event) => {
    console.log('IndexedDB openCursor request failed:');
    console.log(openCursorRequest.error);
    callback(null, 'Download project failed. Could not open cursor.');
  };
  openCursorRequest.onsuccess = async (event: Event) => {
    const cursor = openCursorRequest.result;
    if (cursor) {
      const value = cursor.value;
      if (commonStorage.getProjectName(value.path) === projectName) {
        const moduleName = commonStorage.getModuleName(value.path);
        moduleContents[moduleName] = value.content;
      }
      cursor.continue();
    } else {
      // The cursor is done. We have finished collecting all the modules in the project.
      // Now create the blob for download.
      const blobUrl = await commonStorage.produceDownloadProjectBlob(projectName, moduleContents);
      callback(blobUrl, '');
    }
  };
}

export async function uploadProject(projectName: string, blobUrl: string, callback: BooleanCallback): void {
  if (!db) {
    _openDatabase((success: boolean, errorReason: string) => {
      if (success) {
        uploadProject(projectName, url, callback);
      } else {
        callback(false, 'Upload project failed. (' + errorReason + ')');
      }
    });
    return;
  }

  // Process the uploaded blob to get the module types and contents.
  let moduleTypes: {[key: string]: string}; // key is module name, value is module content
  let moduleContents: {[key: string]: string}; // key is module name, value is module content
  try {
    [moduleTypes, moduleContents] = await commonStorage.processUploadedBlob(
        projectName, blobUrl);
  } catch (e) {
    callback(false, 'Upload project failed. (' + e + ')');
  }

  // Save each module.
  const transaction = db.transaction(['modules'], 'readwrite');
  transaction.oncomplete = (event: Event) => {
    callback(true, '');
  };
  transaction.onabort = () => {
    callback(false, 'Upload project failed.');
  };
  const modulesObjectStore = transaction.objectStore('modules');

  for (let moduleName in moduleTypes) {
    const moduleType = moduleTypes[moduleName];
    const moduleContent = moduleContents[moduleName];
    const modulePath = commonStorage.makeModulePath(projectName, moduleName);
    const getRequest = modulesObjectStore.get(modulePath);
    getRequest.onerror = (event: Event) => {
      console.log('IndexedDB get request failed:');
      console.log(getRequest.error);
      throw new Error('Unable to create module ' + modulePath
          + '. (getRequest error)');
    };
    getRequest.onsuccess = (event: Event) => {
      if (getRequest.result !== undefined) {
        // The module already exists. That is not expected!
        throw new Error('Unable to create module ' + modulePath + ' because the module already exists.');
      }
      const value = Object.create(null);
      value.path = modulePath;
      value.type = moduleType;
      value.content = moduleContent;
      value.dateModifiedMillis = Date.now();
      const putRequest = modulesObjectStore.put(value);
      putRequest.onerror = (event: Event) => {
        console.log('IndexedDB put request failed:');
        console.log(putRequest.error);
        throw new Error('Unable to create module. (putRequest error)');
      };
    };
  }
}
