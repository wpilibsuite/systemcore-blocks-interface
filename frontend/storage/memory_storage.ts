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
 * @fileoverview A storage that keeps files in memory.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as commonStorage from './common_storage';

/**
 * Keeps files in memory, so that functions that work on a storage (such as upgrading a project)
 * can be used on files without changing them where they are actually stored. Entries are not kept.
 */
export class MemoryStorage implements commonStorage.Storage {
  readonly entryKeyPrefix = 'memory/';
  private readonly files = new Map<string, string>();

  async saveEntry(_entryKey: string, _entryValue: string): Promise<void> {}

  async fetchEntry(_entryKey: string, defaultValue: string): Promise<string> {
    return defaultValue;
  }

  async deleteEntry(_entryKey: string): Promise<void> {}

  async listEntryKeys(): Promise<string[]> {
    return [];
  }

  async list(path: string): Promise<string[]> {
    if (!path.endsWith('/')) {
      path += '/';
    }
    const results = new Set<string>();
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path)) {
        const relativePath = filePath.substring(path.length);
        const slash = relativePath.indexOf('/');
        // Include the trailing slash for directories.
        results.add((slash != -1) ? relativePath.substring(0, slash + 1) : relativePath);
      }
    }
    return [...results];
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    if (oldPath.endsWith('/')) {
      for (const [filePath, content] of [...this.files.entries()]) {
        if (filePath.startsWith(oldPath)) {
          this.files.delete(filePath);
          this.files.set(newPath + filePath.substring(oldPath.length), content);
        }
      }
      return;
    }
    const content = this.files.get(oldPath);
    if (content === undefined) {
      throw new Error(`File not found: ${oldPath}`);
    }
    this.files.delete(oldPath);
    this.files.set(newPath, content);
  }

  async fetchFileContentText(filePath: string): Promise<string> {
    const content = this.files.get(filePath);
    if (content === undefined) {
      throw new Error(`File not found: ${filePath}`);
    }
    return content;
  }

  async saveFile(filePath: string, fileContentText: string): Promise<void> {
    this.files.set(filePath, fileContentText);
  }

  async delete(path: string): Promise<void> {
    if (path.endsWith('/')) {
      for (const filePath of [...this.files.keys()]) {
        if (filePath.startsWith(path)) {
          this.files.delete(filePath);
        }
      }
      return;
    }
    this.files.delete(path);
  }
}
