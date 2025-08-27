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
      fixOldModules(db).then(() => {
        resolve(ClientSideStorage.create(db));
      })
    };
  });
}

// The following function allows Alan and Liz to load older projects.
// TODO(lizlooney): Remove this function.
async function fixOldModules(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([MODULES_STORE_NAME], 'readwrite');
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onabort = () => {
      console.log('IndexedDB transaction aborted.');
      reject(new Error('IndexedDB transaction aborted.'));
    };
    const modulesObjectStore = transaction.objectStore(MODULES_STORE_NAME);
    const openCursorRequest = modulesObjectStore.openCursor();
    openCursorRequest.onerror = () => {
      console.log('IndexedDB openCursor request failed. openCursorRequest.error is...');
      console.log(openCursorRequest.error);
      reject(new Error('IndexedDB openCursor request failed.'));
    };
    openCursorRequest.onsuccess = () => {
      const cursor = openCursorRequest.result;
      if (cursor) {
        const value = cursor.value;
        const regexForOldModulePath = new RegExp('^([A-Z][A-Za-z0-9]*)/([A-Z][A-Za-z0-9]*).json$');
        const result = regexForOldModulePath.exec(value.path);
        if (result) {
          const oldModulePath = value.path;
          const projectName = result[1];
          const className = result[2];
          const moduleType = storageModuleContent.parseModuleContentText(value.content).getModuleType();
          value.path = storageNames.makeModulePath(projectName, className, moduleType);
          const putRequest = modulesObjectStore.put(value);
          putRequest.onerror = () => {
           console.log('IndexedDB put request failed. putRequest.error is...');
            console.log(putRequest.error);
            throw new Error('IndexedDB put request failed.');
          };
          const deleteRequest = modulesObjectStore.delete(oldModulePath);
          deleteRequest.onerror = () => {
            console.log('IndexedDB delete request failed. deleteRequest.error is...');
            console.log(deleteRequest.error);
            throw new Error('IndexedDB delete request failed.');
          };
        }
        cursor.continue();
      } else {
        // The cursor is done. We have finished reading all the modules.
        resolve();
      }
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

  async listModulePaths(opt_modulePathRegexPattern?: string): Promise<string[]> {

    const regExp = opt_modulePathRegexPattern
        ? new RegExp(opt_modulePathRegexPattern)
        : null;
    return new Promise((resolve, reject) => {
      const modulePaths: string[] = [];
      const openKeyCursorRequest = this.db.transaction([MODULES_STORE_NAME], 'readonly')
          .objectStore(MODULES_STORE_NAME)
          .openKeyCursor();
      openKeyCursorRequest.onerror = () => {
        console.log('IndexedDB openKeyCursor request failed. openKeyCursorRequest.error is...');
        console.log(openKeyCursorRequest.error);
        reject(new Error('IndexedDB openKeyCursor request failed.'));
      };
      openKeyCursorRequest.onsuccess = () => {
        const cursor = openKeyCursorRequest.result;
        if (cursor && cursor.key) {
          const modulePath: string = cursor.key as string;
          if (!regExp || regExp.test(modulePath)) {
            modulePaths.push(modulePath);
          }
          cursor.continue();
        } else {
          // The cursor is done. We have finished reading all the modules.
          resolve(modulePaths);
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
    });
  }
}
