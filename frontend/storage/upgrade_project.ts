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
import * as Blockly from 'blockly/core';

import * as commonStorage from './common_storage';
import * as storageModule from './module';
import * as storageModuleContent from './module_content';
import * as storageNames from './names';
import * as storageProject from './project';
import {
    upgrade_0_1_x_to_0_2_0 as upgrade_class_method_def_0_1_x_to_0_2_0
    } from '../blocks/mrc_class_method_def';
import * as workspaces from '../blocks/utils/workspaces';

declare const __APP_VERSION__: string;

export const CURRENT_VERSION: string = __APP_VERSION__;

export async function upgradeProjectIfNecessary(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const projectInfo = await storageProject.fetchProjectInfo(storage, projectName);

  // If only the patch version changed (same major.minor), no migration needed.
  const sameMajorMinor =
      semver.major(projectInfo.version) === semver.major(CURRENT_VERSION) &&
      semver.minor(projectInfo.version) === semver.minor(CURRENT_VERSION);
  
  if (sameMajorMinor) {
    return;
  }

  // Major or minor version changes.

  if (semver.lt(projectInfo.version, '0.2.0')) {
     await upgradeFrom_0_1_x_to_0_2_0(storage, projectName, projectInfo);
  }

  // Add more migration functions here for future transitions.
  // Example:
  //   if (semver.lt(projectInfo.version, '0.3.0')) {
  //     await upgradeFrom_0_2_0_to_0_3_0(storage, projectName, projectInfo);
  //   }
  

  projectInfo.version = CURRENT_VERSION;
  await storageProject.saveProjectInfo(storage, projectName, projectInfo);
}

async function upgradeBlocksFiles(
    storage: commonStorage.Storage,
    projectName: string,
    preupgradePredicate: (moduleType: storageModule.ModuleType) => boolean,
    preupgradeFunc: (moduleContentText: string) => string,
    upgradePredicate: (moduleType: storageModule.ModuleType) => boolean,
    upgradeFunc: (w: Blockly.Workspace) => void
): Promise<void> {
  const projectFileNames: string[] = await storage.list(
    storageNames.makeProjectDirectoryPath(projectName));
  for (const projectFileName of projectFileNames) {
    if (!storageNames.isValidModuleFileName(projectFileName)) {
      continue;
    }
    const modulePath = storageNames.makeFilePath(projectName, projectFileName);
    const moduleType = storageNames.getModuleType(modulePath);
    const originalModuleContentText = await storage.fetchFileContentText(modulePath);
    let moduleContentText = originalModuleContentText;

    if (preupgradePredicate(moduleType)) {
      moduleContentText = preupgradeFunc(moduleContentText);
    }

    if (upgradePredicate(moduleType)) {
      const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
      let blocks = moduleContent.getBlocks();

      // Create a temporary workspace to upgrade the blocks.
      const headlessWorkspace = workspaces.createHeadlessWorkspace(moduleType);

      try {
        Blockly.serialization.workspaces.load(blocks, headlessWorkspace);
        upgradeFunc(headlessWorkspace);
        blocks = Blockly.serialization.workspaces.save(headlessWorkspace);
      } finally {
        workspaces.destroyHeadlessWorkspace(headlessWorkspace);
      }

      moduleContent.setBlocks(blocks);
      moduleContentText = moduleContent.getModuleContentText();
    }

    if (moduleContentText !== originalModuleContentText) {
      await storage.saveFile(modulePath, moduleContentText);
    }
  }
}

/** Predicate: all module types are affected. */
// @ts-expect-error: declared but not used
function anyModuleType(_moduleType: storageModule.ModuleType): boolean {
  return true;
}

/** Predicate: only OpMode modules are affected. */
// @ts-expect-error: declared but not used
function isOpMode(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.OPMODE;
}

/** Predicate: only Mechanism modules are affected. */
function isMechanism(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.MECHANISM;
}

/** Predicate: only Robot modules are affected. */
// @ts-expect-error: declared but not used
function isRobot(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.ROBOT;
}

/** Predicate: no modules are affected. */
function noModuleTypes(_moduleType: storageModule.ModuleType): boolean {
  return false;
}

/** Pre-upgrade passthrough: makes no changes to moduleContentText. */
function noPreupgrade(moduleContentText: string): string {
  return moduleContentText;
}

/** Upgrade passthrough: makes no changes to the workspace. */
// @ts-expect-error: declared but not used
function noUpgrade(_workspace: Blockly.Workspace): void {
}

async function upgradeFrom_0_1_x_to_0_2_0(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // mrc_class_method_def blocks for mechanism 'opmodeStart' method need to be changed to 'opmode_start'.
  // mrc_class_method_def blocks for mechanism 'opmodePeriodic' method need to be changed to 'opmode_periodic'.
  // mrc_class_method_def blocks for mechanism 'opmodeEnd' method need to be changed to 'opmode_end'.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      isMechanism, upgrade_class_method_def_0_1_x_to_0_2_0);
}
