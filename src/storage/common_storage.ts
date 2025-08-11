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

import * as storageModuleContent from './module_content';

export interface Storage {
  saveEntry(entryKey: string, entryValue: string): Promise<void>;
  fetchEntry(entryKey: string, defaultValue: string): Promise<string>;
  listModules(): Promise<{[path: string]: storageModuleContent.ModuleContent}>;
  fetchModuleDateModifiedMillis(modulePath: string): Promise<number>;
  fetchModuleContentText(modulePath: string): Promise<string>;
  saveModule(modulePath: string, moduleContentText: string): Promise<void>;
  renameProject(oldProjectName: string, newProjectName: string): Promise<void>;
  copyProject(oldProjectName: string, newProjectName: string): Promise<void>;
  renameModule(moduleType: string, projectName: string, oldClassName: string, newClassName: string): Promise<void>;
  copyModule(moduleType: string, projectName: string, oldClassName: string, newClassName: string): Promise<void>;
  deleteProject(projectName: string): Promise<void>;
  deleteModule(moduleType: string, modulePath: string): Promise<void>;
  downloadProject(projectName: string): Promise<string>;
  uploadProject(projectName: string, blobUrl: string): Promise<void>;
}
