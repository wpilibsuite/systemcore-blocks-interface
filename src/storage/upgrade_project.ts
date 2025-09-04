/**
 * @license
 * Copyright 2025 Google LLC
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

import * as semver from 'semver';

import * as commonStorage from './common_storage';
import * as storageProject from './project';


export async function upgradeProjectIfNecessary(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const projectInfo = await storageProject.fetchProjectInfo(storage, projectName);
  if (semver.lt(projectInfo.version, storageProject.CURRENT_VERSION)) {
    switch (projectInfo.version) {
      case '0.0.0':
        // Project was saved without a project.info.json file.
        // Nothing needs to be done to upgrade to '0.0.1';
        projectInfo.version = '0.0.1';
        break;
    }
    await storageProject.saveProjectInfo(storage, projectName);
  }
}
