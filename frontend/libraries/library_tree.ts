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
 * @fileoverview The tree of libraries, components, and toolbox categories that the user can show
 * or hide, and the checked/half checked/unchecked state of each node in it.
 *
 * What is hidden is stored as a set of keys (see blocks_lib.getToolboxKey). A node is hidden if
 * its key or the key of one of its ancestors is in the set.
 */

import * as toolboxItems from '../toolbox/items';
import * as blocksLib from './blocks_lib';

export enum LibraryTreeNodeKind {
  LIBRARY,
  COMPONENTS,
  COMPONENT,
  CATEGORY,
}

export interface LibraryTreeNode {
  key: string;
  kind: LibraryTreeNodeKind;
  library: blocksLib.Library;
  /** The category name for a CATEGORY node, or the class name for a COMPONENT node. */
  name: string;
  parent: LibraryTreeNode | null;
  children: LibraryTreeNode[];
  /**
   * True if showing the node shows something even when all its children are hidden. That is the
   * case for a category that contains blocks, not just subcategories, and for a library that has
   * flyout toolboxes.
   */
  hasOwnContent: boolean;
}

export enum CheckState {
  CHECKED,
  HALF_CHECKED,
  UNCHECKED,
}

export interface LibraryTree {
  roots: LibraryTreeNode[];
  nodes: Map<string, LibraryTreeNode>;
}

export function buildLibraryTree(libraries: blocksLib.Library[]): LibraryTree {
  const nodes = new Map<string, LibraryTreeNode>();

  const addNode = (
      key: string, kind: LibraryTreeNodeKind, library: blocksLib.Library, name: string,
      parent: LibraryTreeNode | null, hasOwnContent: boolean): LibraryTreeNode => {
    const node: LibraryTreeNode = { key, kind, library, name, parent, children: [], hasOwnContent };
    nodes.set(key, node);
    if (parent) {
      parent.children.push(node);
    }
    return node;
  };

  const addCategory = (
      category: toolboxItems.Category, library: blocksLib.Library, filename: string,
      parentNames: string[], parent: LibraryTreeNode) => {
    const names = [...parentNames, category.name];
    const contents = category.contents || [];
    const node = addNode(
        blocksLib.getToolboxKey(library.metadata.name, filename, names),
        LibraryTreeNodeKind.CATEGORY, library, category.name, parent,
        contents.some(item => item.kind !== 'category'));
    contents
        .filter(item => item.kind === 'category')
        .forEach(item => addCategory(item as toolboxItems.Category, library, filename, names, node));
  };

  const roots = libraries.map((library) => {
    const libraryName = library.metadata.name;
    const libraryNode = addNode(
        blocksLib.getToolboxKey(libraryName), LibraryTreeNodeKind.LIBRARY, library,
        blocksLib.getDisplayName(library.metadata), null, false);

    const components = library.components || {};
    const componentFilenames = Object.keys(components).sort();
    if (componentFilenames.length) {
      const componentsNode = addNode(
          blocksLib.getComponentsGroupKey(libraryName), LibraryTreeNodeKind.COMPONENTS, library,
          '', libraryNode, false);
      componentFilenames.forEach(filename => addNode(
          blocksLib.getComponentKey(libraryName, filename), LibraryTreeNodeKind.COMPONENT, library,
          components[filename].className, componentsNode, true));
    }

    Object.keys(library.toolboxes).sort().forEach((filename) => {
      const toolbox = library.toolboxes[filename];
      if (blocksLib.isFlyoutToolbox(toolbox)) {
        // The blocks go directly in the library's category, so they don't have their own node.
        if (toolbox.contents.length) {
          libraryNode.hasOwnContent = true;
        }
      } else {
        addCategory(toolbox, library, filename, [], libraryNode);
      }
    });
    return libraryNode;
  });

  return { roots, nodes };
}

/** Returns the check state of every node in the tree. */
export function getCheckStates(tree: LibraryTree, hiddenKeys: Set<string>): Map<string, CheckState> {
  const states = new Map<string, CheckState>();
  const visit = (node: LibraryTreeNode, ancestorHidden: boolean): CheckState => {
    const hidden = ancestorHidden || hiddenKeys.has(node.key);
    const childStates = node.children.map(child => visit(child, hidden));
    let state: CheckState;
    if (hidden) {
      state = CheckState.UNCHECKED;
    } else if (childStates.every(s => s === CheckState.CHECKED)) {
      state = CheckState.CHECKED;
    } else if (!node.hasOwnContent && childStates.every(s => s === CheckState.UNCHECKED)) {
      // Nothing under this node is shown.
      state = CheckState.UNCHECKED;
    } else {
      state = CheckState.HALF_CHECKED;
    }
    states.set(node.key, state);
    return state;
  };
  tree.roots.forEach(root => visit(root, false));
  return states;
}

/**
 * Returns the hidden keys after the user clicks the check box of the node with the given key.
 * Clicking a checked node hides it and everything under it. Clicking a half checked or unchecked
 * node shows it and everything under it, without showing any of its siblings.
 */
export function toggleNode(tree: LibraryTree, hiddenKeys: Set<string>, key: string): Set<string> {
  const node = tree.nodes.get(key);
  if (!node) {
    return hiddenKeys;
  }
  const newHiddenKeys = new Set(hiddenKeys);
  const removeDescendants = (n: LibraryTreeNode) => {
    n.children.forEach((child) => {
      newHiddenKeys.delete(child.key);
      removeDescendants(child);
    });
  };

  if (getCheckStates(tree, hiddenKeys).get(key) === CheckState.CHECKED) {
    newHiddenKeys.add(key);
    removeDescendants(node);
    return newHiddenKeys;
  }

  // Show the node and everything under it.
  newHiddenKeys.delete(key);
  removeDescendants(node);

  // If an ancestor is hidden, show the ancestors, but hide the siblings along the way so that only
  // this node is shown.
  const path: LibraryTreeNode[] = [];
  for (let n = node.parent; n; n = n.parent) {
    path.unshift(n);
  }
  const topmostHidden = path.findIndex(n => hiddenKeys.has(n.key));
  if (topmostHidden !== -1) {
    const shownPath = [...path.slice(topmostHidden), node];
    for (let i = 0; i < shownPath.length - 1; i++) {
      newHiddenKeys.delete(shownPath[i].key);
      shownPath[i].children
          .filter(child => child !== shownPath[i + 1])
          .forEach(child => newHiddenKeys.add(child.key));
    }
  }
  return newHiddenKeys;
}
