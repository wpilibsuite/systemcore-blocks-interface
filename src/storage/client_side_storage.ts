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
import * as storageModule from './module';
import * as storageNames from './names';
import * as storageProject from './project';

// Functions for saving blocks modules to client side storage.

const DATABASE_NAME = 'systemcore-blocks-interface';

const ENTRIES_STORE_NAME = 'entries';
const ENTRIES_KEY = 'key';

const MODULES_STORE_NAME = 'modules';
const MODULES_KEY = 'path';

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

      if (!stores.contains(ENTRIES_STORE_NAME)) {
        // Create an object store for key/value entries.
        db.createObjectStore(ENTRIES_STORE_NAME, { keyPath: ENTRIES_KEY });
      }

      if (!stores.contains(MODULES_STORE_NAME)) {
        // Create the object store for modules.
        db.createObjectStore(MODULES_STORE_NAME, { keyPath: MODULES_KEY });
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
      const transaction = this.db.transaction([ENTRIES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const entriesObjectStore = transaction.objectStore(ENTRIES_STORE_NAME);
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
      const getRequest = this.db.transaction([ENTRIES_STORE_NAME], 'readonly')
          .objectStore(ENTRIES_STORE_NAME).get(entryKey);
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

  async listProjects(): Promise<storageProject.Project[]> {
    return new Promise((resolve, reject) => {
      const projects: {[key: string]: storageProject.Project} = {}; // key is project name, value is Project
      // The mechanisms and opModes variables hold any Mechanisms and OpModes that
      // are read before the Project to which they belong is read.
      const mechanisms: {[key: string]: storageModule.Mechanism[]} = {}; // key is project name, value is list of Mechanisms
      const opModes: {[key: string]: storageModule.OpMode[]} = {}; // key is project name, value is list of OpModes
      const openCursorRequest = this.db.transaction([MODULES_STORE_NAME], 'readonly')
          .objectStore(MODULES_STORE_NAME)
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
          const module: storageModule.Module = {
            modulePath: path,
            moduleType: moduleType,
            projectName: storageNames.getProjectName(path),
            className: storageNames.getClassName(path),
            dateModifiedMillis: value.dateModifiedMillis,
          }
          if (moduleType === storageModule.MODULE_TYPE_ROBOT) {
            const robot: storageModule.Robot = {
              ...module,
            };
            const project: storageProject.Project = {
              projectName: module.projectName,
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
          } else if (moduleType === storageModule.MODULE_TYPE_MECHANISM) {
            const mechanism: storageModule.Mechanism = {
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
          } else if (moduleType === storageModule.MODULE_TYPE_OPMODE) {
            const opMode: storageModule.OpMode = {
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
          const projectsToReturn: storageProject.Project[] = [];
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
      const getRequest = this.db.transaction([MODULES_STORE_NAME], 'readonly')
          .objectStore(MODULES_STORE_NAME).get(modulePath);
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
    const modulePath = storageNames.makeRobotPath(projectName);
    const opmodePath = storageNames.makeModulePath(projectName, storageNames.CLASS_NAME_TELEOP);

    await this._saveModule(storageModule.MODULE_TYPE_ROBOT, modulePath, robotContent);
    await this._saveModule(storageModule.MODULE_TYPE_OPMODE, opmodePath, opmodeContent);
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
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
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
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
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
          const moduleType = value.type;
          if (storageNames.getProjectName(path) === oldProjectName) {
            let newPath;
            if (moduleType === storageModule.MODULE_TYPE_ROBOT) {
              newPath = storageNames.makeRobotPath(newProjectName);
            } else {
              const className = storageNames.getClassName(path);
              newPath = storageNames.makeModulePath(newProjectName, className);
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
      oldClassName: string, newClassName: string): Promise<void> {
    if (moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Renaming the robot module is not allowed. Call renameProject to rename the project.');
    }
    return this._renameOrCopyModule(
        projectName, oldClassName, newClassName, false);
  }

  async copyModule(
      moduleType: string, projectName: string,
      oldClassName: string, newClassName: string): Promise<void> {
    if (moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Copying the robot module is not allowed. Call copyProject to rename the project.');
    }
    return this._renameOrCopyModule(
        projectName, oldClassName, newClassName, true);
  }

  private async _renameOrCopyModule(
      projectName: string,
      oldClassName: string, newClassName: string, copy: boolean): Promise<void> {

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
      const oldModulePath = storageNames.makeModulePath(projectName, oldClassName);
      const newModulePath = storageNames.makeModulePath(projectName, newClassName);
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
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
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
          if (storageNames.getProjectName(path) === projectName) {
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
    if (moduleType == storageModule.MODULE_TYPE_ROBOT) {
      throw new Error('Deleting the robot module is not allowed. Call deleteProject to delete the project.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
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
      const classNameToModuleContentText: {[className: string]: string} = {}; // key is class name, value is module content
      const openCursorRequest = this.db.transaction([MODULES_STORE_NAME], 'readonly')
          .objectStore(MODULES_STORE_NAME)
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
          if (storageNames.getProjectName(value.path) === projectName) {
            const className = storageNames.getClassName(value.path);
            classNameToModuleContentText[className] = value.content;
          }
          cursor.continue();
        } else {
          // The cursor is done. We have finished collecting all the modules in the project.
          // Now create the blob for download.
          const blobUrl = await storageProject.produceDownloadProjectBlob(classNameToModuleContentText);
          resolve(blobUrl);
        }
      };
    });
  }

  async uploadProject(projectName: string, blobUrl: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Process the uploaded blob to get the module types and contents.
      let classNameToModuleType: {[className: string]: string}; // key is class name, value is module type
      let classNameToModuleContentText: {[className: string]: string}; // key is class name, value is module content
      try {
        [classNameToModuleType, classNameToModuleContentText] = await storageProject.processUploadedBlob(
            blobUrl);
      } catch (e) {
        console.log('storageProject.processUploadedBlob failed.');
        reject(new Error('storageProject.processUploadedBlob failed.'));
        return;
      }

      // Save each module.
      const transaction = this.db.transaction([MODULES_STORE_NAME], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onabort = () => {
        console.log('IndexedDB transaction aborted.');
        reject(new Error('IndexedDB transaction aborted.'));
      };
      const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);

      for (const className in classNameToModuleType) {
        const moduleType = classNameToModuleType[className];
        const moduleContentText = classNameToModuleContentText[className];
        const modulePath = storageNames.makeModulePath(projectName, className);
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
