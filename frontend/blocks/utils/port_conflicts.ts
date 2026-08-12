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
 * @fileoverview Finds hardware ports that are used by more than one component or mechanism.
 * @author alan@randomsmiths.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import * as commonStorage from '../../storage/common_storage';
import * as componentBlock from '../mrc_component';
import * as mechanismBlock from '../mrc_mechanism';
import * as mechanismComponentHolder from '../mrc_mechanism_component_holder';
import * as portBlock from '../mrc_port';
import * as storageModuleContent from '../../storage/module_content';
import * as storageProject from '../../storage/project';
import { Editor } from '../../editor/editor';
import { PortBlock } from '../mrc_port';

const WARNING_ID_DUPLICATE_PORT = 'duplicate port';

const INPUT_ARG_PREFIX = 'ARG';

/** One use of a hardware port by a component or by a mechanism's component. */
export type PortUsage = {
  /**
   * Identifies the physical port. Two usages are on the same physical port if and only if
   * their keys are equal.
   */
  key: string,
  /** The port as shown to the user, for example 'can MC00, device 3'. */
  portLabel: string,
  /** The component using the port, for example 'frontLeft' or 'drive.left_motor'. */
  owner: string,
  /** The id of the mrc_port block. Only present when collected from a live workspace. */
  blockId?: string,
};

/** A single port that is used by more than one component. */
export type PortConflict = {
  portLabel: string,
  owners: string[],
  blockIds: string[],
};

/**
 * Returns the ports that are used by more than one component, in the order they were
 * first seen.
 */
export function findConflicts(usages: PortUsage[]): PortConflict[] {
  const keyToUsages: {[key: string]: PortUsage[]} = {};
  const listKeys: string[] = [];
  usages.forEach(usage => {
    if (!(usage.key in keyToUsages)) {
      keyToUsages[usage.key] = [];
      listKeys.push(usage.key);
    }
    keyToUsages[usage.key].push(usage);
  });

  const conflicts: PortConflict[] = [];
  listKeys.forEach(key => {
    const usagesForKey = keyToUsages[key];
    if (usagesForKey.length > 1) {
      conflicts.push({
        portLabel: usagesForKey[0].portLabel,
        owners: usagesForKey.map(usage => usage.owner),
        blockIds: usagesForKey
            .map(usage => usage.blockId)
            .filter((blockId): blockId is string => blockId !== undefined),
      });
    }
  });
  return conflicts;
}

/**
 * Returns the zero-based index of the ARG input that the given port block is plugged into,
 * or -1 if it isn't plugged into an ARG input.
 */
function getArgIndex(block: Blockly.Block): number {
  const targetConnection = block.outputConnection
      ? block.outputConnection.targetConnection : null;
  if (!targetConnection) {
    return -1;
  }
  const input = targetConnection.getParentInput();
  if (!input || !input.name.startsWith(INPUT_ARG_PREFIX)) {
    return -1;
  }
  const index = Number(input.name.substring(INPUT_ARG_PREFIX.length));
  return Number.isInteger(index) ? index : -1;
}

/**
 * Returns the name of the component that uses the port that the given port block provides,
 * or '' if the port block isn't plugged into a component or mechanism.  If the 
 * component is inside a mechanism, the name of the mechanism is prepended to the 
 * component's name with a period in between.  For example, if the component is 
 * named 'left_motor' and the mechanism is named 'drive', the returned name is 
 * 'drive.left_motor'.
 */
function getOwnerFromWorkspace(block: Blockly.Block): string {
  const parent = block.getParent();
  if (!parent) {
    return '';
  }
  // A disabled component or mechanism doesn't produce any code, so it isn't using its ports.
  if (!parent.isEnabled()) {
    return '';
  }
  if (parent.type === componentBlock.BLOCK_NAME) {
    return parent.getFieldValue(componentBlock.FIELD_NAME);
  }
  if (parent.type === mechanismBlock.BLOCK_NAME) {
    const mechanismName = parent.getFieldValue(mechanismBlock.FIELD_NAME);
    const argIndex = getArgIndex(block);
    const parameters = (parent as mechanismBlock.MechanismBlock).mrcParameters;
    if (argIndex >= 0 && parameters && argIndex < parameters.length) {
      return mechanismName + '.' + parameters[argIndex].componentName;
    }
    return mechanismName;  // This should not happen, but if it does, at least return the mechanism's name.
  }
  return '';
}

/**
 * Returns the ports used by the components and mechanisms in the given live workspace.
 */
export function collectPortUsagesFromWorkspace(workspace: Blockly.Workspace): PortUsage[] {
  const usages: PortUsage[] = [];
  workspace.getBlocksByType(portBlock.BLOCK_NAME, false).forEach(block => {
    // Ignore a port block that isn't plugged in, or that is part of a component that has
    // been dragged out of the mechanism and component holder. Those ports aren't used.
    if (!block.outputConnection || !block.outputConnection.isConnected()) {
      return;
    }
    const rootBlock = block.getRootBlock();
    if (!rootBlock || rootBlock.type !== mechanismComponentHolder.BLOCK_NAME) {
      return;
    }
    const owner = getOwnerFromWorkspace(block);
    if (!owner) {
      return;
    }

    usages.push({
      ...portBlock.describePortBlock(block as PortBlock),
      owner: owner,
      blockId: block.id,
    });
  });
  return usages;
}

/**
 * Returns the ports used by the components and mechanisms in the given blocks, which are in
 * the Blockly serialization format. This is used when the module isn't open in an editor.
 */
export function collectPortUsagesFromBlocksJson(blocks: {[key: string]: any}): PortUsage[] {
  const usages: PortUsage[] = [];

  const collectFromPortBlock = (blockJson: any, owner: string): void => {
    if (!owner) {
      return;
    }
    const description = portBlock.describePortBlockJson(blockJson);
    if (!description) {
      return;
    }
    usages.push({
      ...description,
      owner: owner,
    });
  };

  /**
   * Walks the block and everything below it, remembering the component or mechanism that
   * encloses each port block.
   */
  const walk = (blockJson: any, owner: string): void => {
    if (!blockJson || typeof blockJson !== 'object') {
      return;
    }
    if (blockJson.type === portBlock.BLOCK_NAME) {
      collectFromPortBlock(blockJson, owner);
    }

    if (blockJson.inputs) {
      for (const inputName in blockJson.inputs) {
        const input = blockJson.inputs[inputName];
        if (!input || !input.block) {
          continue;
        }
        walk(input.block, getOwnerFromBlockJson(blockJson, inputName, owner));
      }
    }
    if (blockJson.next && blockJson.next.block) {
      walk(blockJson.next.block, owner);
    }
  };

  storageModuleContent.getTopLevelBlocksJson(blocks).forEach(
      (blockJson: any) => walk(blockJson, ''));
  return usages;
}

/**
 * Returns the name of the component that owns the given input of the given block. If the
 * block isn't a component or a mechanism, the enclosing owner is passed through.
 */
function getOwnerFromBlockJson(blockJson: any, inputName: string, owner: string): string {
  const fields = blockJson.fields ? blockJson.fields : {};
  // A disabled component or mechanism doesn't produce any code, so it isn't using its ports.
  const isDisabled = Array.isArray(blockJson.disabledReasons) &&
      blockJson.disabledReasons.length > 0;
  if (blockJson.type === componentBlock.BLOCK_NAME) {
    if (isDisabled) {
      return '';
    }
    return fields[componentBlock.FIELD_NAME] ?? '';
  }
  if (blockJson.type === mechanismBlock.BLOCK_NAME) {
    if (isDisabled) {
      return '';
    }
    const mechanismName = fields[mechanismBlock.FIELD_NAME] ?? '';
    if (!inputName.startsWith(INPUT_ARG_PREFIX)) {
      return mechanismName;
    }
    const argIndex = Number(inputName.substring(INPUT_ARG_PREFIX.length));
    const parameters = blockJson.extraState ? blockJson.extraState.parameters : null;
    if (Number.isInteger(argIndex) && parameters && argIndex < parameters.length) {
      return mechanismName + '.' + parameters[argIndex].componentName;
    }
    return mechanismName;
  }
  return owner;
}

/**
 * Puts a warning on each port block that is on a port that another component is also using,
 * and removes the warning from every other port block.
 */
export function checkPortConflicts(workspace: Blockly.Workspace): void {
  const usages = collectPortUsagesFromWorkspace(workspace);
  const conflicts = findConflicts(usages);

  // Collect, for each port block that is in a conflict, the names of the other components
  // that are using the same port.
  const blockIdToWarning: {[blockId: string]: string} = {};
  conflicts.forEach(conflict => {
    conflict.blockIds.forEach((blockId, i) => {
      const otherOwners = conflict.owners.filter((_owner, j) => j !== i);
      blockIdToWarning[blockId] = Blockly.Msg.WARNING_DUPLICATE_PORT
          .replace('%1', conflict.portLabel)
          .replace('%2', otherOwners.join(', '));
    });
  });

  workspace.getBlocksByType(portBlock.BLOCK_NAME, false).forEach(block => {
    const port = block as portBlock.PortBlock;
    const warning = blockIdToWarning[port.id] ?? null;
    // Don't set the same warning text twice. Otherwise we can get a detached warning
    // balloon. Note that we deliberately don't make the balloon visible: a conflict always
    // involves at least two blocks and popping open a cluster of balloons every time a port
    // number changes would be too noisy.
    if (port.mrcDuplicatePortWarning === warning) {
      return;
    }
    port.setWarningText(warning, WARNING_ID_DUPLICATE_PORT);
    port.mrcDuplicatePortWarning = warning;
  });
}

/**
 * Returns the ports in the given project's robot module that are used by more than one
 * component. The robot's live workspace is used if the robot module is open in an editor.
 * Otherwise, the robot module is read from storage.
 */
export async function findRobotPortConflicts(
    project: storageProject.Project,
    storage: commonStorage.Storage): Promise<PortConflict[]> {
  const modulePath = project.robot.modulePath;
  const editor = Editor.getEditorForModulePath(modulePath);
  if (editor) {
    return findConflicts(collectPortUsagesFromWorkspace(editor.getBlocklyWorkspace()));
  }
  const moduleContentText = await storage.fetchFileContentText(modulePath);
  const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
  return findConflicts(collectPortUsagesFromBlocksJson(moduleContent.getBlocks()));
}
