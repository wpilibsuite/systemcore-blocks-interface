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
 * @fileoverview Finds the differences between a version of a project and the current project.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as storageModule from './module';
import * as storageModuleContent from './module_content';
import * as storageNames from './names';

export enum ModuleChange {
  ADDED = 'added',
  REMOVED = 'removed',
  CHANGED = 'changed',
  UNCHANGED = 'unchanged',
}

export type BlockDiff = {
  added: Set<string>, // ids of blocks only in the current module
  removed: Set<string>, // ids of blocks only in the version's module
  changed: Set<string>, // ids of blocks in both whose own content differs
  moved: Set<string>, // ids of top-level blocks in both that are at a different position
};

export type ModuleDiff = {
  moduleId: string,
  moduleType: storageModule.ModuleType,
  oldClassName: string | null, // null if the module was added after the version
  currentClassName: string | null, // null if the module was removed after the version
  oldContentText: string | null,
  currentContentText: string | null,
  change: ModuleChange,
  blockDiff: BlockDiff,
};

type ModuleFile = {
  className: string,
  moduleType: storageModule.ModuleType,
  contentText: string,
  content: storageModuleContent.ModuleContent,
};

/** The order modules are listed in: the robot, then mechanisms, then opmodes. */
const MODULE_TYPE_ORDER = [
  storageModule.ModuleType.ROBOT,
  storageModule.ModuleType.MECHANISM,
  storageModule.ModuleType.OPMODE,
];

/** The order changes are listed in, so the modules that changed are first. */
const CHANGE_ORDER = [
  ModuleChange.CHANGED,
  ModuleChange.ADDED,
  ModuleChange.REMOVED,
  ModuleChange.UNCHANGED,
];

/**
 * Compares the modules in two sets of project files (maps of fileName → content). Modules are
 * matched by moduleId, so a module that was renamed is still compared with its earlier self.
 */
export function diffModules(
    oldFiles: {[fileName: string]: string},
    currentFiles: {[fileName: string]: string}): ModuleDiff[] {
  const oldModules = indexModules(oldFiles);
  const currentModules = indexModules(currentFiles);
  const moduleIds = new Set([...oldModules.keys(), ...currentModules.keys()]);

  const diffs: ModuleDiff[] = [];
  for (const moduleId of moduleIds) {
    const oldModule = oldModules.get(moduleId) ?? null;
    const currentModule = currentModules.get(moduleId) ?? null;
    const blockDiff = diffBlocks(
        oldModule ? oldModule.content.getBlocks() : {},
        currentModule ? currentModule.content.getBlocks() : {});
    let change: ModuleChange;
    if (!oldModule) {
      change = ModuleChange.ADDED;
    } else if (!currentModule) {
      change = ModuleChange.REMOVED;
    } else if (blockDiff.added.size || blockDiff.removed.size || blockDiff.changed.size ||
        blockDiff.moved.size || oldModule.className !== currentModule.className) {
      change = ModuleChange.CHANGED;
    } else {
      change = ModuleChange.UNCHANGED;
    }
    diffs.push({
      moduleId: moduleId,
      moduleType: (currentModule ?? oldModule)!.moduleType,
      oldClassName: oldModule?.className ?? null,
      currentClassName: currentModule?.className ?? null,
      oldContentText: oldModule?.contentText ?? null,
      currentContentText: currentModule?.contentText ?? null,
      change: change,
      blockDiff: blockDiff,
    });
  }

  diffs.sort((a, b) =>
      (CHANGE_ORDER.indexOf(a.change) - CHANGE_ORDER.indexOf(b.change)) ||
      (MODULE_TYPE_ORDER.indexOf(a.moduleType) - MODULE_TYPE_ORDER.indexOf(b.moduleType)) ||
      (a.currentClassName ?? a.oldClassName!).localeCompare(b.currentClassName ?? b.oldClassName!));
  return diffs;
}

function indexModules(files: {[fileName: string]: string}): Map<string, ModuleFile> {
  const modules = new Map<string, ModuleFile>();
  for (const fileName in files) {
    if (!storageNames.isValidModuleFileName(fileName)) {
      continue;
    }
    const content = storageModuleContent.parseModuleContentText(files[fileName]);
    modules.set(content.getModuleId(), {
      className: storageNames.getClassName(fileName),
      moduleType: storageNames.getModuleType(fileName),
      contentText: files[fileName],
      content: content,
    });
  }
  return modules;
}

/**
 * Compares the blocks of two workspaces (in Blockly's JSON serialization format), matching blocks
 * by id.
 * - A block is added or removed if it is only in one of the workspaces. Only the outermost block
 *   is marked, not the blocks inside it, which were added or removed along with it.
 * - A block is changed if its own content (type, fields, and extra state) differs, or if it was
 *   moved: it is in a different input, or a different block comes before it in its stack.
 *   Adding, removing, or moving a block doesn't mark the block it was attached to, or the blocks
 *   around it.
 * - Moving a stack of blocks around the workspace is not a change, but the top-level blocks that
 *   are at a different position are listed in moved.
 */
export function diffBlocks(
    oldBlocks: {[key: string]: any}, currentBlocks: {[key: string]: any}): BlockDiff {
  const oldInfos = indexBlocks(oldBlocks);
  const currentInfos = indexBlocks(currentBlocks);
  const diff: BlockDiff = {added: new Set(), removed: new Set(), changed: new Set(), moved: new Set()};

  for (const [id, currentInfo] of currentInfos) {
    const oldInfo = oldInfos.get(id);
    if (oldInfo?.position && currentInfo.position && oldInfo.position !== currentInfo.position) {
      diff.moved.add(id);
    }
    if (!oldInfo) {
      if (!currentInfo.enclosingId || oldInfos.has(currentInfo.enclosingId)) {
        diff.added.add(id);
      }
    } else if (oldInfo.fingerprint !== currentInfo.fingerprint ||
        oldInfo.location !== currentInfo.location ||
        getPreviousBlockIn(oldInfo, currentInfos) !== getPreviousBlockIn(currentInfo, oldInfos)) {
      diff.changed.add(id);
    }
  }
  for (const [id, oldInfo] of oldInfos) {
    if (!currentInfos.has(id) &&
        (!oldInfo.enclosingId || currentInfos.has(oldInfo.enclosingId))) {
      diff.removed.add(id);
    }
  }
  return diff;
}

type BlockInfo = {
  fingerprint: string, // the block's own content
  enclosingId: string | null, // the block whose input the block's stack is in, if any
  location: string, // the input that the block's stack is in, or '' for a top-level stack
  position: string | null, // the position on the workspace, for a top-level block
  stack: string[], // the ids of the blocks in the block's stack, in order
  indexInStack: number,
};

/** Returns information about each block (including shadow blocks), keyed by block id. */
function indexBlocks(blocks: {[key: string]: any}): Map<string, BlockInfo> {
  const infos = new Map<string, BlockInfo>();
  const walkStack = (
      firstBlockJson: {[key: string]: any}, enclosingId: string | null, location: string): void => {
    const stack: string[] = [];
    for (let blockJson = firstBlockJson; blockJson; blockJson = blockJson.next?.block) {
      if (!blockJson.id) {
        continue;
      }
      stack.push(blockJson.id);
      infos.set(blockJson.id, {
        fingerprint: fingerprintBlock(blockJson),
        enclosingId: enclosingId,
        location: location,
        position: (!enclosingId && blockJson === firstBlockJson)
            ? (blockJson.x ?? 0) + ',' + (blockJson.y ?? 0) : null,
        stack: stack,
        indexInStack: stack.length - 1,
      });
      for (const inputName in blockJson.inputs ?? {}) {
        const input = blockJson.inputs[inputName];
        if (input?.block) {
          walkStack(input.block, blockJson.id, blockJson.id + ':' + inputName);
        }
        if (input?.shadow && input.shadow.id !== input.block?.id) {
          walkStack(input.shadow, blockJson.id, blockJson.id + ':' + inputName + ':shadow');
        }
      }
    }
  };
  storageModuleContent.getTopLevelBlocksJson(blocks).forEach(
      blockJson => walkStack(blockJson, null, ''));
  return infos;
}

/**
 * Returns the id of the closest block before the given block in its stack that is also in the
 * other workspace, or '' if there is none. Blocks that were only in one workspace are skipped, so
 * that adding or removing a block doesn't count as moving the blocks after it.
 */
function getPreviousBlockIn(info: BlockInfo, otherInfos: Map<string, BlockInfo>): string {
  for (let i = info.indexInStack - 1; i >= 0; i--) {
    if (otherInfos.has(info.stack[i])) {
      return info.stack[i];
    }
  }
  return '';
}

function fingerprintBlock(blockJson: {[key: string]: any}): string {
  const {inputs, next, x, y, ...ownContent} = blockJson;
  return stableStringify(ownContent);
}

/** Like JSON.stringify, but with object keys sorted so the result doesn't depend on key order. */
function stableStringify(value: any): string {
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort()
        .map(key => JSON.stringify(key) + ':' + stableStringify(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}
