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

import * as mechanismComponentHolder from '../blocks/mrc_mechanism_component_holder';
import * as commonStorage from './common_storage';
import * as storageModule from './module';
import * as storageModuleContent from './module_content';
import * as storageNames from './names';
import * as storageProject from './project';
import { ClassMethodDefBlock, BLOCK_NAME as MRC_CLASS_METHOD_DEF_BLOCK_NAME } from '../blocks/mrc_class_method_def';

export const NO_VERSION = '0.0.0';
export const CURRENT_VERSION = '0.0.4';

export async function upgradeProjectIfNecessary(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const projectInfo = await storageProject.fetchProjectInfo(storage, projectName);
  if (semver.lt(projectInfo.version, CURRENT_VERSION)) {
    switch (projectInfo.version) {
      // @ts-ignore
      case '0.0.0':
        upgradeFrom_000_to_001(storage, projectName, projectInfo)
      // Intentional fallthrough
      // @ts-ignore
      case '0.0.1':
        upgradeFrom_001_to_002(storage, projectName, projectInfo);
      // Intentional fallthrough
      // @ts-ignore
      case '0.0.2':
        upgradeFrom_002_to_003(storage, projectName, projectInfo);   
      case '0.0.3':
        upgradeFrom_003_to_004(storage, projectName, projectInfo);
        break;
      default:
        throw new Error('Unrecognized project version: ' + projectInfo.version);

    }
    await storageProject.saveProjectInfo(storage, projectName);
  }
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
  const projectFileNames: string[] = await storage.list(
    storageNames.makeProjectDirectoryPath(projectName));
  for (const projectFileName of projectFileNames) {
    const modulePath = storageNames.makeFilePath(projectName, projectFileName);
    let moduleContentText = await storage.fetchFileContentText(modulePath);

    // Add private components to the module content.
    moduleContentText = storageModuleContent.addPrivateComponents(moduleContentText);

    if (storageNames.getModuleType(modulePath) === storageModule.ModuleType.ROBOT) {
      // If this module is the robot, hide the private components part of the
      // mrc_mechanism_component_holder block.
      const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
      let blocks = moduleContent.getBlocks();
      // Create a temporary workspace to upgrade the blocks.
      const headlessWorkspace = new Blockly.Workspace();
      try {
        Blockly.serialization.workspaces.load(blocks, headlessWorkspace);
        mechanismComponentHolder.hidePrivateComponents(headlessWorkspace);
        blocks = Blockly.serialization.workspaces.save(headlessWorkspace);
      } finally {
        headlessWorkspace.dispose();
      }
      moduleContent.setBlocks(blocks);
      moduleContentText = moduleContent.getModuleContentText();
    }

    await storage.saveFile(modulePath, moduleContentText);
  }
  projectInfo.version = '0.0.2';
}

async function upgradeFrom_002_to_003(
    storage: commonStorage.Storage,
    projectName: string,
    projectInfo: storageProject.ProjectInfo): Promise<void> {
  // Opmodes had robot as a parameter to init method
  const projectFileNames: string[] = await storage.list(
    storageNames.makeProjectDirectoryPath(projectName));

  for (const projectFileName of projectFileNames) {
    const modulePath = storageNames.makeFilePath(projectName, projectFileName);

    if (storageNames.getModuleType(modulePath) === storageModule.ModuleType.OPMODE) {
      let moduleContentText = await storage.fetchFileContentText(modulePath);
      const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
      let blocks = moduleContent.getBlocks();

      // Create a temporary workspace to upgrade the blocks
      const headlessWorkspace = new Blockly.Workspace();
      try {
        Blockly.serialization.workspaces.load(blocks, headlessWorkspace);

        // Method blocks need to be upgraded
        headlessWorkspace.getBlocksByType(MRC_CLASS_METHOD_DEF_BLOCK_NAME, false).forEach(block => {
          (block as ClassMethodDefBlock).upgrade_002_to_003();
        });
        blocks = Blockly.serialization.workspaces.save(headlessWorkspace);
      } finally {
        headlessWorkspace.dispose();
      }

      moduleContent.setBlocks(blocks);
      moduleContentText = moduleContent.getModuleContentText();
      await storage.saveFile(modulePath, moduleContentText);
    }
  }
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
