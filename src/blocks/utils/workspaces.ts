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

import * as Blockly from 'blockly/core';
import * as storageModule from '../../storage/module';

const workspaceIdToModuleType: { [workspaceId: string]: storageModule.ModuleType } = {};

export function addWorkspace(workspace: Blockly.Workspace, moduleType: storageModule.ModuleType): void {
  workspaceIdToModuleType[workspace.id] = moduleType;
}

export function removeWorkspace(workspace: Blockly.Workspace): void {
  if (workspace.id in workspaceIdToModuleType) {
    delete workspaceIdToModuleType[workspace.id];
  }
}

export function getModuleTypeForWorkspace(workspace: Blockly.Workspace): storageModule.ModuleType {
  if (workspace.id in workspaceIdToModuleType) {
    return workspaceIdToModuleType[workspace.id];
  }
  // If the workspace id was not found, it might be because the workspace is associated with a
  // block mutator's flyout. Try this workspaces's root workspace.
  const rootWorkspace = workspace.getRootWorkspace();
  if (rootWorkspace &&
      rootWorkspace.id in workspaceIdToModuleType) {
    return workspaceIdToModuleType[rootWorkspace.id];
  }

  throw new Error('getModuleTypeForWorkspace: workspaceId not found: ' + workspace.id);
}

export function createHeadlessWorkspace(moduleType: storageModule.ModuleType): Blockly.Workspace {
  const workspace = new Blockly.Workspace();
  addWorkspace(workspace, moduleType);
  return workspace;
}

export function destroyHeadlessWorkspace(workspace: Blockly.Workspace): void {
  removeWorkspace(workspace);
  workspace.dispose();
}
