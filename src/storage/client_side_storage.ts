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
    openRequest.onerror = () => {
      console.log('IndexedDB open request failed. openRequest.error is...');
      console.log(openRequest.error);
      reject(new Error('IndexedDB open request failed.'));
    };
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;

      const stores = db.objectStoreNames;

      if (!stores.contains('entries')) {
        // Create an object store for key/value entries.
        db.createObjectStore('entries', { keyPath: 'key' });
      }

      if (!stores.contains('modules')) {
        // Create the object store for modules.
        db.createObjectStore('modules', { keyPath: 'path' });
      }
    };
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      resolve(ClientSideStorage.create(db));
    };
  });
}

class ClientSideStorage implements commonStorage.Storage {
  db: IDBDatabase;

  static create(db: IDBDatabase) {
    return new ClientSideStorage(db)
  }

  private constructor(db: IDBDatabase) {
    this.db = db;
  }

  async saveEntry(entryKey: string, entryValue: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['entries'], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const entriesObjectStore = transaction.objectStore('entries');
      const getRequest = entriesObjectStore.get(entryKey);
      getRequest.onerror = () => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
      };
      getRequest.onsuccess = () => {
        let value;
        if (getRequest.result === undefined) {
          value = Object.create(null);
          value.key = entryKey;
        } else {
          value = getRequest.result;
        }
        value.value = entryValue;
        const putRequest = entriesObjectStore.put(value);
        putRequest.onerror = () => {
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
      getRequest.onerror = () => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        reject(new Error('IndexedDB get request failed.'));
      };
      getRequest.onsuccess = () => {
        const value = (getRequest.result === undefined) ? defaultValue : getRequest.result.value;
        resolve(value);
      };
    });
  }

  async listProjects(): Promise<commonStorage.Project[]> {
    return new Promise((resolve, reject) => {
      const projects: {[key: string]: commonStorage.Project} = {}; // key is project name, value is Project
      // The mechanisms and opModes variables hold any Mechanisms and OpModes that
      // are read before the Project to which they belong is read.
      const mechanisms: {[key: string]: commonStorage.Mechanism[]} = {}; // key is project name, value is list of Mechanisms
      const opModes: {[key: string]: commonStorage.OpMode[]} = {}; // key is project name, value is list of OpModes
      const openCursorRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules')
          .openCursor();
      openCursorRequest.onerror = () => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        reject(new Error('IndexedDB openCursor request failed.'));
      };
      openCursorRequest.onsuccess = () => {
        const cursor = openCursorRequest.result;
        if (cursor) {
          const value = cursor.value;
          const path = value.path;
          const moduleType = value.type;
          const moduleName = commonStorage.getModuleName(path);
          const module: commonStorage.Module = {
            modulePath: path,
            moduleType: moduleType,
            projectName: commonStorage.getProjectName(path),
            moduleName: moduleName,
            dateModifiedMillis: value.dateModifiedMillis,
            className: commonStorage.getClassNameForModule(moduleType, moduleName),
          }
          if (moduleType === commonStorage.MODULE_TYPE_ROBOT) {
            const robot: commonStorage.Robot = {
              ...module,
            };
            const project: commonStorage.Project = {
              projectName: module.projectName,
              userVisibleName: commonStorage.snakeCaseToPascalCase(module.projectName),
              robot: robot,
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
          const projectsToReturn: commonStorage.Project[] = [];
          const sortedProjectNames = Object.keys(projects).sort();
          sortedProjectNames.forEach((projectName) => {
            projectsToReturn.push(projects[projectName]);
          });
          resolve(projectsToReturn);
        }
      };
    });
  }

  async fetchModuleContentText(modulePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const getRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules').get(modulePath);
      getRequest.onerror = () => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        reject(new Error('IndexedDB get request failed.'));
      };
      getRequest.onsuccess = () => {
        if (getRequest.result === undefined) {
          // Module does not exist.
          reject(new Error('IndexedDB get request succeeded, but the module does not exist.'));
          return;
        }
        resolve(getRequest.result.content);
      };
    });
  }

  async createProject(projectName: string, robotContent: string, opmodeContent : string): Promise<void> {
    const modulePath = commonStorage.makeRobotPath(projectName);
    const opmodePath = commonStorage.makeModulePath(projectName, 'teleop');

    await this._saveModule(commonStorage.MODULE_TYPE_ROBOT, modulePath, robotContent);
    await this._saveModule(commonStorage.MODULE_TYPE_OPMODE, opmodePath, opmodeContent);
  }

  async createModule(moduleType: string, modulePath: string, moduleContentText: string): Promise<void> {
    return this._saveModule(moduleType, modulePath, moduleContentText);
  }

  async saveModule(modulePath: string, moduleContentText: string): Promise<void> {
    return this._saveModule('', modulePath, moduleContentText);
  }

  private async _saveModule(moduleType: string, modulePath: string, moduleContentText: string)
      : Promise<void> {
    // When creating a new module, moduleType must be truthy.
    // When saving an existing module, the moduleType must be falsy.
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      const getRequest = modulesObjectStore.get(modulePath);
      getRequest.onerror = () => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
      };
      getRequest.onsuccess = () => {
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
        value.content = moduleContentText;
        value.dateModifiedMillis = Date.now();
        const putRequest = modulesObjectStore.put(value);
        putRequest.onerror = () => {
          console.log('IndexedDB put request failed. putRequest.error is...');
          console.log(putRequest.error);
          throw new Error('IndexedDB put request failed.');
        };
      };
    });
  }

  private async _renameOrCopyProject(oldProjectName: string, newProjectName: string, copy: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
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
      openCursorRequest.onerror = () => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        throw new Error('IndexedDB openCursor request failed.');
      };
      openCursorRequest.onsuccess = () => {
        const cursor = openCursorRequest.result;
        if (cursor) {
          const value = cursor.value;
          const path = value.path;
          // Before PR #143, robot modules were stored with the type 'project'.
          const moduleType = (value.type == 'project') ? commonStorage.MODULE_TYPE_ROBOT : value.type;
          if (commonStorage.getProjectName(path) === oldProjectName) {
            let newPath;
            if (moduleType === commonStorage.MODULE_TYPE_ROBOT) {
              newPath = commonStorage.makeRobotPath(newProjectName);
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
            getRequest.onerror = () => {
              console.log('IndexedDB get request failed. getRequest.error is...');
              console.log(getRequest.error);
              throw new Error('IndexedDB get request failed.');
            };
            getRequest.onsuccess = () => {
              if (getRequest.result === undefined) {
                console.log('IndexedDB get request succeeded, but the module does not exist.');
                throw new Error('IndexedDB get request succeeded, but the module does not exist.');
              }
              const value = getRequest.result;
              value.path = newModulePath;
              value.dateModifiedMillis = Date.now();
              const putRequest = modulesObjectStore.put(value);
              putRequest.onerror = () => {
                console.log('IndexedDB put request failed. putRequest.error is...');
                console.log(putRequest.error);
                throw new Error('IndexedDB put request failed.');
              };
              putRequest.onsuccess = () => {
                if (!copy) {
                  const deleteRequest = modulesObjectStore.delete(oldModulePath);
                  deleteRequest.onerror = () => {
                    console.log('IndexedDB delete request failed. deleteRequest.error is...');
                    console.log(deleteRequest.error);
                    throw new Error('IndexedDB delete request failed.');
                  };
                }
              };
            };
          });
        }
      };
    });
  }

  async renameProject(oldProjectName: string, newProjectName: string): Promise<void> {
    return this._renameOrCopyProject(oldProjectName, newProjectName, false);
  }

  async copyProject(oldProjectName: string, newProjectName: string): Promise<void> {
    return this._renameOrCopyProject(oldProjectName, newProjectName, true);
  }

  async renameModule(
      moduleType: string, projectName: string,
      oldModuleName: string, newModuleName: string): Promise<void> {
    if (moduleType == commonStorage.MODULE_TYPE_ROBOT) {
      throw new Error('Renaming the robot module is not allowed. Call renameProject to rename the project.');
    }
    return this._renameOrCopyModule(
        projectName, oldModuleName, newModuleName, false);
  }

  async copyModule(
      moduleType: string, projectName: string,
      oldModuleName: string, newModuleName: string): Promise<void> {
    if (moduleType == commonStorage.MODULE_TYPE_ROBOT) {
      throw new Error('Copying the robot module is not allowed. Call copyProject to rename the project.');
    }
    return this._renameOrCopyModule(
        projectName, oldModuleName, newModuleName, true);
  }

  private async _renameOrCopyModule(
      projectName: string,
      oldModuleName: string, newModuleName: string, copy: boolean): Promise<void> {

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
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
      getRequest.onerror = () => {
        console.log('IndexedDB get request failed. getRequest.error is...');
        console.log(getRequest.error);
        throw new Error('IndexedDB get request failed.');
      };
      getRequest.onsuccess = () => {
        if (getRequest.result === undefined) {
          console.log('IndexedDB get request succeeded, but the module does not exist.');
          throw new Error('IndexedDB get request succeeded, but the module does not exist.');
          return;
        }
        const value = getRequest.result;
        value.path = newModulePath;
        value.dateModifiedMillis = Date.now();
        const putRequest = modulesObjectStore.put(value);
        putRequest.onerror = () => {
          console.log('IndexedDB put request failed. putRequest.error is...');
          console.log(putRequest.error);
          throw new Error('IndexedDB put request failed.');
        };
        putRequest.onsuccess = () => {
          if (!copy) {
            const deleteRequest = modulesObjectStore.delete(oldModulePath);
            deleteRequest.onerror = () => {
              console.log('IndexedDB delete request failed. deleteRequest.error is...');
              console.log(deleteRequest.error);
              throw new Error('IndexedDB delete request failed.');
            };
            deleteRequest.onsuccess = () => {
            };
          }
        };
      };
    });
  }

  async deleteProject(projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
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
      openCursorRequest.onerror = () => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        throw new Error('IndexedDB openCursor request failed.');
      };
      openCursorRequest.onsuccess = () => {
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
            deleteRequest.onerror = () => {
              console.log('IndexedDB delete request failed. deleteRequest.error is...');
              console.log(deleteRequest.error);
              throw new Error('IndexedDB delete request failed.');
            };
            deleteRequest.onsuccess = () => {
            };
          });
        }
      };
    });
  }

  async deleteModule(moduleType: string, modulePath: string): Promise<void> {
    if (moduleType == commonStorage.MODULE_TYPE_ROBOT) {
      throw new Error('Deleting the robot module is not allowed. Call deleteProject to delete the project.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');
      const deleteRequest = modulesObjectStore.delete(modulePath);
      deleteRequest.onerror = () => {
        console.log('IndexedDB delete request failed. deleteRequest.error is...');
        console.log(deleteRequest.error);
        throw new Error('IndexedDB delete request failed.');
      };
      deleteRequest.onsuccess = () => {
      };
    });
  }

  async downloadProject(projectName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Collect all the modules in the project.
      const moduleNameToContentText: {[key: string]: string} = {}; // key is module name, value is module content
      const openCursorRequest = this.db.transaction(['modules'], 'readonly')
          .objectStore('modules')
          .openCursor();
      openCursorRequest.onerror = () => {
        console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
        console.log(openCursorRequest.error);
        reject(new Error('IndexedDB openCursor request failed.'));
      };
      openCursorRequest.onsuccess = async () => {
        const cursor = openCursorRequest.result;
        if (cursor) {
          const value = cursor.value;
          if (commonStorage.getProjectName(value.path) === projectName) {
            const moduleName = commonStorage.getModuleName(value.path);
            moduleNameToContentText[moduleName] = value.content;
          }
          cursor.continue();
        } else {
          // The cursor is done. We have finished collecting all the modules in the project.
          // Now create the blob for download.
          const blobUrl = await commonStorage.produceDownloadProjectBlob(moduleNameToContentText);
          resolve(blobUrl);
        }
      };
    });
  }

  async uploadProject(projectName: string, blobUrl: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Process the uploaded blob to get the module types and contents.
      let moduleNameToType: {[key: string]: string}; // key is module name, value is module content
      let moduleNameToContentText: {[key: string]: string}; // key is module name, value is module content
      try {
        [moduleNameToType, moduleNameToContentText] = await commonStorage.processUploadedBlob(
            blobUrl);
      } catch (e) {
        console.log('commonStorage.processUploadedBlob failed.');
        reject(new Error('commonStorage.processUploadedBlob failed.'));
        return;
      }

      // Save each module.
      const transaction = this.db.transaction(['modules'], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore('modules');

      for (const moduleName in moduleNameToType) {
        const moduleType = moduleNameToType[moduleName];
        const moduleContentText = moduleNameToContentText[moduleName];
        const modulePath = commonStorage.makeModulePath(projectName, moduleName);
        const getRequest = modulesObjectStore.get(modulePath);
        getRequest.onerror = () => {
          console.log('IndexedDB get request failed. getRequest.error is...');
          console.log(getRequest.error);
          throw new Error('IndexedDB get request failed.');
        };
        getRequest.onsuccess = () => {
          if (getRequest.result !== undefined) {
            // The module already exists. That is not expected!
            console.log('IndexedDB get request succeeded, but the module already exists.');
            throw new Error('IndexedDB get request succeeded, but the module already exists.');
          }
          const value = Object.create(null);
          value.path = modulePath;
          value.type = moduleType;
          value.content = moduleContentText;
          value.dateModifiedMillis = Date.now();
          const putRequest = modulesObjectStore.put(value);
          putRequest.onerror = () => {
            console.log('IndexedDB put request failed. putRequest.error is...');
            console.log(putRequest.error);
            throw new Error('IndexedDB put request failed.');
          };
        };
      }
    });
  }
}
