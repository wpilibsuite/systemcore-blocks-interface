/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Storage for installed third party libraries.
 */

import * as commonStorage from '../storage/common_storage';
import { ServerSideStorage } from '../storage/server_side_storage';
import { Library, parseBlocksLib } from './blocks_lib';

export interface LibraryStorage {
  list(): Promise<Library[]>;

  /** Installs the library, replacing any installed library with the same name. */
  install(filename: string, data: ArrayBuffer): Promise<Library>;

  remove(libraryName: string): Promise<void>;
}

/**
 * Libraries are installed on the backend so that their wheels are available when deploying.
 */
class ServerLibraryStorage implements LibraryStorage {
  async list(): Promise<Library[]> {
    const response = await fetch('/libraries');
    if (!response.ok) {
      throw new Error(`Failed to list libraries: ${response.statusText}`);
    }
    const data = await response.json();
    return data.libraries || [];
  }

  async install(filename: string, data: ArrayBuffer): Promise<Library> {
    const formData = new FormData();
    formData.append('file', new Blob([data]), filename);
    const response = await fetch('/libraries', {
      method: 'POST',
      body: formData,
    });
    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(responseData.error || `Failed to install library: ${response.statusText}`);
    }
    return responseData.library;
  }

  async remove(libraryName: string): Promise<void> {
    const response = await fetch(`/libraries/${encodeURIComponent(libraryName)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove library: ${response.statusText}`);
    }
  }
}

/** Entry key used when there is no backend. */
const LIBRARIES_ENTRY_KEY = 'installedLibraries';

/**
 * Without a backend, the parsed libraries are kept in a storage entry. The wheels aren't kept
 * because there is no robot to deploy them to.
 */
class ClientLibraryStorage implements LibraryStorage {
  constructor(private readonly storage: commonStorage.Storage) {}

  async list(): Promise<Library[]> {
    return JSON.parse(await this.storage.fetchEntry(LIBRARIES_ENTRY_KEY, '[]'));
  }

  async install(_filename: string, data: ArrayBuffer): Promise<Library> {
    const library = await parseBlocksLib(data);
    const libraries = (await this.list())
        .filter(l => l.metadata.name !== library.metadata.name);
    libraries.push(library);
    await this.save(libraries);
    return library;
  }

  async remove(libraryName: string): Promise<void> {
    const libraries = (await this.list()).filter(l => l.metadata.name !== libraryName);
    await this.save(libraries);
  }

  private async save(libraries: Library[]): Promise<void> {
    libraries.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
    await this.storage.saveEntry(LIBRARIES_ENTRY_KEY, JSON.stringify(libraries));
  }
}

export function createLibraryStorage(storage: commonStorage.Storage): LibraryStorage {
  if (storage instanceof ServerSideStorage) {
    return new ServerLibraryStorage();
  }
  return new ClientLibraryStorage(storage);
}
