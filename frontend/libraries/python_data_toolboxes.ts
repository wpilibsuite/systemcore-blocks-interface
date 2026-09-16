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
 * @fileoverview Makes the toolbox files of a third party library from its python data and
 * components, with categories for the python modules and classes that the library chooses to
 * show, like the ones that can be chosen in the toolbox settings for the built in RobotPy modules.
 *
 * This is used when a library is built (see example_libraries/generate_python_toolboxes.mjs), not while
 * Blocks is running. Python data from libraries is never shown with the built in RobotPy modules.
 */

import * as Blockly from 'blockly/core';
import { getLibraryPythonData, setLibraryPythonData } from '../blocks/utils/python';
import { PythonData } from '../blocks/utils/python_json_types';
import { pascalCaseToSnakeCase } from '../storage/names';
import * as pythonDataToolbox from '../toolbox/python_data_toolbox';
import * as toolboxItems from '../toolbox/items';
import { Library } from './blocks_lib';
import { collectPythonData } from './library_registry';

/**
 * The key of the message used for the label between the common blocks and the rest of the blocks
 * in a category. The library's locale files have to have this message.
 */
export const MORE_BLOCKS_MESSAGE_KEY = 'MORE_BLOCKS';

/**
 * Returns the toolbox files for the given python modules and classes of the library, keyed by
 * filename. shownCategories has the full names of the modules and classes to show, like
 * "rev.A301". Each category directly under a module gets its own file. The blocks of a module
 * itself, like its enums, are put in a file named after the module.
 */
export function makePythonDataToolboxes(
    library: Library, shownCategories: string[]): {[filename: string]: toolboxItems.Category} {
  const libraryPyData = getLibraryPythonData();
  const previousPythonData: PythonData = {...libraryPyData};
  const previousMoreBlocksLabel = Blockly.Msg['MORE_BLOCKS_LABEL'];
  // The library's python data has to be registered, because the default values of the arguments
  // of the blocks depend on it, for example for enum arguments.
  const pythonData = collectPythonData([library]);
  setLibraryPythonData(pythonData);
  Blockly.Msg['MORE_BLOCKS_LABEL'] = `%{${MORE_BLOCKS_MESSAGE_KEY}}`;
  try {
    const toolboxes: {[filename: string]: toolboxItems.Category} = {};
    const moduleCategories = pythonDataToolbox.getToolboxCategories(
        pythonData, new Set(shownCategories), true);
    for (const moduleCategory of moduleCategories) {
      const moduleBlocks: toolboxItems.ContentsType[] = [];
      for (const item of moduleCategory.contents || []) {
        if (item.kind === 'category') {
          const category = toLibraryCategory(item as toolboxItems.Category);
          toolboxes[`${pascalCaseToSnakeCase(category.name)}.json`] = category;
        } else {
          moduleBlocks.push(item);
        }
      }
      if (moduleBlocks.length) {
        const moduleName = (moduleCategory as toolboxItems.PythonModuleCategory).moduleName;
        toolboxes[`${moduleName.replace(/\./g, '_')}.json`] =
            toLibraryCategory({...moduleCategory, contents: moduleBlocks});
      }
    }
    return toolboxes;
  } finally {
    setLibraryPythonData(previousPythonData);
    if (previousMoreBlocksLabel === undefined) {
      delete Blockly.Msg['MORE_BLOCKS_LABEL'];
    } else {
      Blockly.Msg['MORE_BLOCKS_LABEL'] = previousMoreBlocksLabel;
    }
  }
}

/**
 * Returns a copy of the category with only the properties of a Blockly toolbox category, leaving
 * out the moduleName and className that the built in RobotPy categories have.
 */
function toLibraryCategory(category: toolboxItems.Category): toolboxItems.Category {
  return {
    kind: 'category',
    name: category.name,
    contents: (category.contents || []).map(item =>
        item.kind === 'category' ? toLibraryCategory(item as toolboxItems.Category) : item),
  };
}
