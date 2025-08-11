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
import * as storageModuleContent from './module_content';
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

  async listModules(
      opt_modulePathFilter?: commonStorage.ModulePathFilter):
      Promise<{[path: string]: storageModuleContent.ModuleContent}> {
    return new Promise((resolve, reject) => {
      const pathToModuleContent: {[path: string]: storageModuleContent.ModuleContent} = {};
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
          // TODO(lizlooney): do we need value.path? Is there another way to get the path?
          const modulePath = value.path;
          if (!opt_modulePathFilter || opt_modulePathFilter(modulePath)) {
            const moduleContent = storageModuleContent.parseModuleContentText(value.content);
            pathToModuleContent[modulePath] = moduleContent;
          }
          cursor.continue();
        } else {
          // The cursor is done. We have finished reading all the modules.
          resolve(pathToModuleContent);
        }
      };
    });
  }

  async fetchModuleDateModifiedMillis(modulePath: string): Promise<number> {
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
        resolve(getRequest.result.dateModifiedMillis);
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

  async saveModule(modulePath: string, moduleContentText: string): Promise<void> {
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
          // The module does not exist. Create it now.
          value = Object.create(null);
          value.path = modulePath;
        } else {
          // The module already exists.
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

  async deleteModule(modulePath: string): Promise<void> {
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
