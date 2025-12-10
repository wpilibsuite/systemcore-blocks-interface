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
import { upgrade_001_to_002 } from '../blocks/mrc_mechanism_component_holder';
import { upgrade_002_to_003, upgrade_004_to_005, upgrade_006_to_007, upgrade_007_to_008 } from '../blocks/mrc_class_method_def';
import { upgrade_005_to_006 } from '../blocks/mrc_component';
import * as workspaces from '../blocks/utils/workspaces';

export const NO_VERSION = '0.0.0';
export const CURRENT_VERSION = '0.0.8';

export async function upgradeProjectIfNecessary(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const projectInfo = await storageProject.fetchProjectInfo(storage, projectName);
  if (semver.lt(projectInfo.version, CURRENT_VERSION)) {
    switch (projectInfo.version) {
      default:
        throw new Error('Unrecognized project version: ' + projectInfo.version);

      // Intentional fallthrough after case '0.0.0'
      // @ts-ignore
      case '0.0.0':
        upgradeFrom_000_to_001(storage, projectName, projectInfo)

      // Intentional fallthrough after case '0.0.1'
      // @ts-ignore
      case '0.0.1':
        upgradeFrom_001_to_002(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.2'
      // @ts-ignore
      case '0.0.2':
        upgradeFrom_002_to_003(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.3'
      // @ts-ignore
      case '0.0.3':
        upgradeFrom_003_to_004(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.4'
      // @ts-ignore
      case '0.0.4':
        upgradeFrom_004_to_005(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.5'
      // @ts-ignore
      case '0.0.5':
        upgradeFrom_005_to_006(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.6'
      // @ts-ignore
      case '0.0.6':
        upgradeFrom_006_to_007(storage, projectName, projectInfo);

      // Intentional fallthrough after case '0.0.7'
      // @ts-ignore
      case '0.0.7':
        upgradeFrom_007_to_008(storage, projectName, projectInfo);
    }
    await storageProject.saveProjectInfo(storage, projectName);
  }
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

/**
 * Predicate function that can be passed to upgradeBlocksFiles indicating that all modules should be
 * affected.
 */
function anyModuleType(_moduleType: storageModule.ModuleType): boolean {
  return true;
}

/**
 * Predicate function that can be passed to upgradeBlocksFiles indicating that only OpMode modules
 * should be affected.
 */
function isOpMode(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.OPMODE;
}

/**
 * Predicate function that can be passed to upgradeBlocksFiles indicating that only Mechanism
 * modules should be affected.
 */
function isMechanism(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.MECHANISM;
}

/**
 * Predicate function that can be passed to upgradeBlocksFiles indicating that only Robot modules
 * should be affected.
 */
function isRobot(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.ROBOT;
}

/**
 * Predicate function that can be passed to upgradeBlocksFiles indicating that no modules should be
 * affected.
 */
function noModuleTypes(_moduleType: storageModule.ModuleType): boolean {
  return false;
}

/**
 * Preupgrade function that makes no changes to moduleContentText.
 */
function noPreupgrade(moduleContentText: string): string {
  return moduleContentText;
}

async function upgradeFrom_000_to_001(
    _storage: commonStorage.Storage,
    _projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // Project was saved without a project.info.json file.
  // Nothing needs to be done to upgrade to '0.0.1';
  projectInfo.version = '0.0.1';
}

async function upgradeFrom_001_to_002(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // Modules were saved without private components.
  // The Robot's mrc_mechanism_component_holder block was saved without hidePrivateComponents.
  await upgradeBlocksFiles(
      storage, projectName,
      anyModuleType, storageModuleContent.preupgrade_001_to_002,
      isRobot, upgrade_001_to_002);
  projectInfo.version = '0.0.2';
}

async function upgradeFrom_002_to_003(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // OpModes had robot as a parameter to init method.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      isOpMode, upgrade_002_to_003);
  projectInfo.version = '0.0.3';
}

async function upgradeFrom_003_to_004(
    _storage: commonStorage.Storage,
    _projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // The only change in this version are some new blocks.  This keeps you
  // from loading a project with an older version of software.
  projectInfo.version = '0.0.4';
}

async function upgradeFrom_004_to_005(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // mrc_class_method_def blocks that return a value need to have returnType changed from 'Any' to ''.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      anyModuleType, upgrade_004_to_005);
  projectInfo.version = '0.0.5';
}

async function upgradeFrom_005_to_006(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // mrc_component blocks parameter types need to be fixed.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      anyModuleType, upgrade_005_to_006);
  projectInfo.version = '0.0.6';
}

async function upgradeFrom_006_to_007(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // mrc_class_method_def blocks for opmode loop method need to be changed to 'Periodic'.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      isOpMode, upgrade_006_to_007);
  projectInfo.version = '0.0.7';
}

async function upgradeFrom_007_to_008(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // mrc_class_method_def blocks for mechanism update method need to be changed to 'opmode_periodic'.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      isMechanism, upgrade_007_to_008);
  projectInfo.version = '0.0.8';
}
