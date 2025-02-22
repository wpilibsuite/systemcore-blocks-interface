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

const DATABASE_NAME = 'systemcore-blocks-interface';

export async function openClientSideStorage(): Promise<commonStorage.Storage> {
  return new Promise((resolve, reject) => {
    const openRequest = window.indexedDB.open(DATABASE_NAME, 1);
    openRequest.onerror = (event: Event) => {
      console.log('IndexedDB open request failed. openRequest.error is...');
      console.log(openRequest.error);
      reject(new Error('IndexedDB open request failed.'));
    };
    openRequest.onupgradeneeded = (event: Event) => {
      const db = openRequest.result;

      var stores = db.objectStoreNames;

      if (!stores.contains('entries')) {
        // Create an object store for key/value entries.
        db.createObjectStore('entries', { keyPath: 'key' });
      }

      if (!stores.contains('modules')) {
        // Create the object store for modules.
        db.createObjectStore('modules', { keyPath: 'path' });
      }
    };
    openRequest.onsuccess = (event: Event) => {
      const db = openRequest.result;
      resolve(new ClientSideStorage(db));
    };
  });
}

class ClientSideStorage implements commonStorage.Storage {
  db: IDBDatabase;

  private constructor(db: IDBDatabase) {
    this.db = db;
  }

  async saveEntry(entryKey: string, entryValue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['entries'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const entriesObjectStore = transaction.objectStore('entries');
      const getRequest = entriesObjectStore.get(entryKey);
      getRequest.onerror = (event: Event) => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
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
          console.log('IndexedDB put request failed. putRequest.error is...');
          console.log(putRequest.error);
          throw new Error('IndexedDB put request failed.');
        };
      };
    });
  }

  async fetchEntry(entryKey: string, defaultValue: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const getRequest = this.db.transaction(['entries'], 'readonly')
          .objectStore('entries').get(entryKey);
      getRequest.onerror = (event: Event) => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        reject(new Error('IndexedDB get request failed.'));
      };
      getRequest.onsuccess = (event: Event) => {
        const value = (getRequest.result === undefined) ? defaultValue : getRequest.result.value;
        resolve(value);
      };
    });
  }
  
  async listModules(): Promise<commonStorage.Project[]> {
    return new Promise((resolve, reject) => {
      const projects: {[key: string]: commonStorage.Project} = {}; // key is project name, value is Project
      // The mechanisms and opModes variables hold any Mechanisms and OpModes that
      // are read before the Project to which they belong is read.
      const mechanisms: {[key: string]: commonStorage.Mechanism[]} = {}; // key is project name, value is list of Mechanisms
      const opModes: {[key: string]: commonStorage.OpMode[]} = {}; // key is project name, value is list of OpModes
      const openCursorRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules')
          .openCursor();
      openCursorRequest.onerror = (event: Event) => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        reject(new Error('IndexedDB openCursor request failed.'));
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
          resolve(modules);
        }
      };
    });
  }

  async fetchModuleContent(modulePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const getRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules').get(modulePath);
      getRequest.onerror = (event: Event) => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        reject(new Error('IndexedDB get request failed.'));
      };
      getRequest.onsuccess = (event: Event) => {
        if (getRequest.result === undefined) {
          // Module does not exist.
          reject(new Error('IndexedDB get request succeeded, but the module does not exist.'));
          return;
        }
        resolve(getRequest.result.content);
      };
    });
  }

  async createModule(moduleType: string, modulePath: string, moduleContent: string): Promise<void> {
    return this._saveModule(moduleType, modulePath, moduleContent);
  }

  async saveModule(modulePath: string, moduleContent: string): Promise<void> {
    return this._saveModule('', modulePath, moduleContent);
  }

  private async _saveModule(moduleType: string, modulePath: string, moduleContent: string)
      : Promise<void> {
    // When creating a new module, moduleType must be truthy.
    // When saving an existing module, the moduleType must be falsy.
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      const getRequest = modulesObjectStore.get(modulePath);
      getRequest.onerror = (event: Event) => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
      };
      getRequest.onsuccess = (event: Event) => {
        let value;
        if (getRequest.result === undefined) {
          // The module does not exist.
          // Let's make sure that's what we expected.
          if (!moduleType) {
            // If moduleType is not truthy, we are trying to save an existing module.
            // It is unexpected that the module does not exist.
            console.log('IndexedDB get request succeeded, but the module does not exist.');
            throw new Error('IndexedDB get request succeeded, but the module does not exist.');
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
            console.log('IndexedDB get request succeeded, but the module already exist.');
            throw new Error('IndexedDB get request succeeded, but the module already exists.');
          }
          value = getRequest.result;
        }
        value.content = moduleContent;
        value.dateModifiedMillis = Date.now();
        const putRequest = modulesObjectStore.put(value);
        putRequest.onerror = (event: Event) => {
          console.log('IndexedDB put request failed. putRequest.error is...');
          console.log(putRequest.error);
          throw new Error('IndexedDB put request failed.');
        };
      };
    });
  }

  private async _renameOrCopyProject(oldProjectName: string, newProjectName: string, copy: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const errorMessage = copy
          ? 'Copy Project failed.'
          : 'Rename Project failed.'

      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      // First get the list of modules in the project.
      const oldToNewModulePaths: {[key: string]: string} = {};
      const openCursorRequest = modulesObjectStore.openCursor();
      openCursorRequest.onerror = (event: Event) => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        throw new Error('IndexedDB openCursor request failed.');
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
              console.log('IndexedDB get request failed. getRequest.error is...');
              console.log(getRequest.error);
              throw new Error('IndexedDB get request failed.');
            };
            getRequest.onsuccess = (event: Event) => {
              if (getRequest.result === undefined) {
                console.log('IndexedDB get request succeeded, but the module does not exist.');
                throw new Error('IndexedDB get request succeeded, but the module does not exist.');
              }
              const value = getRequest.result;
              value.path = newModulePath;
              value.dateModifiedMillis = Date.now();
              const putRequest = modulesObjectStore.put(value);
              putRequest.onerror = (event: Event) => {
                console.log('IndexedDB put request failed. putRequest.error is...');
                console.log(putRequest.error);
                throw new Error('IndexedDB put request failed.');
              };
              putRequest.onsuccess = (event: Event) => {
                if (!copy) {
                  const deleteRequest = modulesObjectStore.delete(oldModulePath);
                  deleteRequest.onerror = (event: Event) => {
                    console.log('IndexedDB delete request failed. deleteRequest.error is...');
                    console.log(deleteRequest.error);
                    throw new Error('IndexedDB delete request failed.');
                  };
                  deleteRequest.onsuccess = (event: Event) => {
                  };
                }
              };
            };
          });
        }
      };
    });
  }

  async renameModule(
      moduleType: string, projectName: string,
      oldModuleName: string, newModuleName: string): Promise<void> {
    return this._renameOrCopyModule(
        moduleType, projectName, oldModuleName, newModuleName, false);
  }

  async copyModule(
      moduleType: string, projectName: string,
      oldModuleName: string, newModuleName: string): Promise<void> {
    return this._renameOrCopyModule(
        moduleType, projectName, oldModuleName, newModuleName, true);
  }

  private async _renameOrCopyModule(
      moduleType: string, projectName: string,
      oldModuleName: string, newModuleName: string, copy: boolean): Promise<void> {

    if (moduleType == commonStorage.MODULE_TYPE_PROJECT) {
      return this._renameOrCopyProject(oldModuleName, newModuleName, copy);
    }

    return new Promise((resolve, reject) => {
      const errorMessage = copy
          ? 'Copy module failed.'
          : 'Rename module failed.'

      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      const oldModulePath = commonStorage.makeModulePath(projectName, oldModuleName);
      const newModulePath = commonStorage.makeModulePath(projectName, newModuleName);
      const getRequest = modulesObjectStore.get(oldModulePath);
      getRequest.onerror = (event: Event) => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
      };
      getRequest.onsuccess = (event: Event) => {
        if (getRequest.result === undefined) {
          console.log('IndexedDB get request succeeded, but the module does not exist.');
          throw new Error('IndexedDB get request succeeded, but the module does not exist.');
          return;
        }
        const value = getRequest.result;
        value.path = newModulePath;
        value.dateModifiedMillis = Date.now();
        const putRequest = modulesObjectStore.put(value);
        putRequest.onerror = (event: Event) => {
          console.log('IndexedDB put request failed. putRequest.error is...');
          console.log(putRequest.error);
          throw new Error('IndexedDB put request failed.');
        };
        putRequest.onsuccess = (event: Event) => {
          if (!copy) {
            const deleteRequest = modulesObjectStore.delete(oldModulePath);
            deleteRequest.onerror = (event: Event) => {
              console.log('IndexedDB delete request failed. deleteRequest.error is...');
              console.log(deleteRequest.error);
              throw new Error('IndexedDB delete request failed.');
            };
            deleteRequest.onsuccess = (event: Event) => {
            };
          }
        };
      };
    });
  }

  private async _deleteProject(projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      // First get the list of modulePaths in the project.
      const modulePaths: string[] = [];
      const openCursorRequest = modulesObjectStore.openCursor();
      openCursorRequest.onerror = (event: Event) => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        throw new Error('IndexedDB openCursor request failed.');
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
              console.log('IndexedDB delete request failed. deleteRequest.error is...');
              console.log(deleteRequest.error);
              throw new Error('IndexedDB delete request failed.');
            };
            deleteRequest.onsuccess = (event: Event) => {
            };
          });
        }
      };
    });
  }

  async deleteModule(moduleType: string, modulePath: string): Promise<void> {
    if (moduleType == commonStorage.MODULE_TYPE_PROJECT) {
      const projectName = commonStorage.getProjectName(modulePath);
      return this._deleteProject(projectName);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      const deleteRequest = modulesObjectStore.delete(modulePath);
      deleteRequest.onerror = (event: Event) => {
        console.log('IndexedDB delete request failed. deleteRequest.error is...');
        console.log(deleteRequest.error);
        throw new Error('IndexedDB delete request failed.');
      };
      deleteRequest.onsuccess = (event: Event) => {
      };
    });
  }

  async downloadProject(projectName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Collect all the modules in the project.
      const moduleContents: {[key: string]: string} = {}; // key is module name, value is module content
      const openCursorRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules')
          .openCursor();
      openCursorRequest.onerror = (event: Event) => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        reject(new Error('IndexedDB openCursor request failed.'));
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
          resolve(blobUrl);
        }
      };
    });
  }

  async uploadProject(projectName: string, blobUrl: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Process the uploaded blob to get the module types and contents.
      let moduleTypes: {[key: string]: string}; // key is module name, value is module content
      let moduleContents: {[key: string]: string}; // key is module name, value is module content
      try {
        [moduleTypes, moduleContents] = await commonStorage.processUploadedBlob(
            projectName, blobUrl);
      } catch (e) {
        console.log('commonStorage.processUploadedBlob failed.');
        reject(new Error('commonStorage.processUploadedBlob failed.'));
        return;
      }
  
      // Save each module.
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = (event: Event) => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
  
      for (let moduleName in moduleTypes) {
        const moduleType = moduleTypes[moduleName];
        const moduleContent = moduleContents[moduleName];
        const modulePath = commonStorage.makeModulePath(projectName, moduleName);
        const getRequest = modulesObjectStore.get(modulePath);
        getRequest.onerror = (event: Event) => {
          console.log('IndexedDB get request failed. getRequest.error is...');
          console.log(getRequest.error);
          throw new Error('IndexedDB get request failed.');
        };
        getRequest.onsuccess = (event: Event) => {
          if (getRequest.result !== undefined) {
            // The module already exists. That is not expected!
            console.log('IndexedDB get request succeeded, but the module already exists.');
            throw new Error('IndexedDB get request succeeded, but the module already exists.');
          }
          const value = Object.create(null);
          value.path = modulePath;
          value.type = moduleType;
          value.content = moduleContent;
          value.dateModifiedMillis = Date.now();
          const putRequest = modulesObjectStore.put(value);
          putRequest.onerror = (event: Event) => {
            console.log('IndexedDB put request failed. putRequest.error is...');
            console.log(putRequest.error);
            throw new Error('IndexedDB put request failed.');
          };
        };
      }
    });
  }
}
