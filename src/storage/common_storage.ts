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

export interface Storage {
  // Functions for storing key/value entries.

  saveEntry(entryKey: string, entryValue: string): Promise<void>;

  fetchEntry(entryKey: string, defaultValue: string): Promise<string>;

  // Functions for storing files.
  
  list(path: string): Promise<string[]>;

  rename(oldPath: string, newPath: string): Promise<void>;

  fetchFileContentText(filePath: string): Promise<string>;

  saveFile(filePath: string, fileContentText: string): Promise<void>;

  delete(path: string): Promise<void>;
}
