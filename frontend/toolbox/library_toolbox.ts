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

import * as toolboxItems from './items';
import { ClassData } from '../blocks/utils/python_json_types';
import {
    getComponentKey,
    getComponentsGroupKey,
    getToolboxKey,
    isCompatible,
    isFlyoutToolbox,
    Library,
    mapTranslatableStrings,
    normalizeComponentClass,
    qualifyReference } from '../libraries/blocks_lib';
import { getLocalizedDisplayName, localizeLibraryText } from '../libraries/library_i18n';

/** The components from one library that the user can add. */
export interface LibraryComponents {
  /** The name of the library, as shown to the user. */
  displayName: string;
  /** The library's color, if it has one. */
  colour?: string;
  componentClasses: ClassData[];
}

/** What the installed libraries add to the toolbox. */
export interface LibraryToolbox {
  /** Categories added to the toolbox, one for each library, named after the library. */
  categories: toolboxItems.Category[];
  /** Components added to "+ Component", grouped by library. */
  components: LibraryComponents[];
}

export const EMPTY_LIBRARY_TOOLBOX: LibraryToolbox = {
  categories: [],
  components: [],
};

/**
 * Returns what the installed libraries add to the toolbox, in the given language, leaving out
 * incompatible libraries and anything the user has hidden.
 */
export function getLibraryToolbox(
    libraries: Library[], hiddenKeys: Set<string>, language?: string): LibraryToolbox {
  const libraryToolbox: LibraryToolbox = {
    categories: [],
    components: [],
  };
  for (const library of libraries) {
    const libraryName = library.metadata.name;
    if (!isCompatible(library.metadata) || hiddenKeys.has(getToolboxKey(libraryName))) {
      continue;
    }
    // Put the library's blocks and categories under a category named after the library, so it's
    // obvious where they came from. The blocks from flyout toolboxes go directly in that category,
    // before the library's categories.
    const libraryBlocks: toolboxItems.ContentsType[] = [];
    const libraryCategories: toolboxItems.Category[] = [];
    for (const filename of Object.keys(library.toolboxes).sort()) {
      const toolbox = library.toolboxes[filename];
      if (isFlyoutToolbox(toolbox)) {
        libraryBlocks.push(...toolbox.contents);
        continue;
      }
      const category = filterCategory(toolbox, libraryName, filename, [], hiddenKeys);
      if (category) {
        libraryCategories.push(category);
      }
    }
    if (libraryBlocks.length || libraryCategories.length) {
      // Category names and labels are translated now, since the toolbox is rebuilt when the
      // language changes. Tooltips are saved in the blocks, so they are translated when they are
      // shown.
      const contents = mapTranslatableStrings(
          [...libraryBlocks, ...libraryCategories],
          (text, property) => property === 'tooltip' ?
              qualifyReference(libraryName, text) : localizeLibraryText(library, text, language));
      libraryToolbox.categories.push({
        kind: 'category',
        name: getLocalizedDisplayName(library, language),
        contents,
        ...(library.metadata.color ? {colour: library.metadata.color} : {}),
      });
    }
    if (!hiddenKeys.has(getComponentsGroupKey(libraryName))) {
      const components = library.components || {};
      const componentClasses = Object.keys(components).sort()
          .filter(filename => !hiddenKeys.has(getComponentKey(libraryName, filename)))
          .map(filename => normalizeComponentClass(components[filename], libraryName));
      if (componentClasses.length) {
        libraryToolbox.components.push({
          displayName: getLocalizedDisplayName(library, language),
          componentClasses,
          ...(library.metadata.color ? {colour: library.metadata.color} : {}),
        });
      }
    }
  }
  return libraryToolbox;
}

function filterCategory(
    category: toolboxItems.Category,
    libraryName: string,
    filename: string,
    parentNames: string[],
    hiddenKeys: Set<string>): toolboxItems.Category | null {
  const names = [...parentNames, category.name];
  if (hiddenKeys.has(getToolboxKey(libraryName, filename, names))) {
    return null;
  }
  const contents: toolboxItems.ContentsType[] = [];
  for (const item of category.contents || []) {
    if (item.kind === 'category') {
      const child = filterCategory(
          item as toolboxItems.Category, libraryName, filename, names, hiddenKeys);
      if (child) {
        contents.push(child);
      }
    } else {
      contents.push(item);
    }
  }
  if (contents.length === 0 && (category.contents || []).length > 0) {
    // Everything in this category is hidden.
    return null;
  }
  return {...category, contents};
}
