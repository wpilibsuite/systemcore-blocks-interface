/**
 * @license
 * Copyright 2024 Google LLC
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

import * as generatedToolbox from './generated/toolbox';
import * as toolboxItems from './items';
import {category as logicCategory} from './logic_category';
import {category as loopCategory} from './loop_category';
import {category as mathCategory} from './math_category';
import {category as textCategory} from './text_category';
import {category as listsCategory} from './lists_category';
import {category as miscCategory} from './misc_category';
import {category as methodsCategory} from './methods_category';

export function getToolboxJSON(
    opt_includeExportedBlocksFromProject: toolboxItems.ContentsType[],
    shownPythonToolboxCategories: Set<string>) {
  const contents: toolboxItems.ContentsType[] = generatedToolbox.getToolboxCategories();
  filterGeneratedCategories(contents, shownPythonToolboxCategories);

  if (opt_includeExportedBlocksFromProject.length) {
    contents.push.apply(
      contents,
      [
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'Project',
          contents: opt_includeExportedBlocksFromProject,
        },
      ]);
  }

  contents.push.apply(
    contents,
    [
      {
        kind: 'sep',
      },
      miscCategory,
      logicCategory,
      loopCategory,
      mathCategory,
      textCategory,
      listsCategory,
      {
        kind: 'sep',
      },
      {
        kind: 'category',
        name: 'Variables',
        categorystyle: 'variable_category',
        custom: 'VARIABLE',
      },
      methodsCategory,
    ]);

  return {
    kind: 'categoryToolbox',
    contents: contents
  };
}

function filterGeneratedCategories(
    contents: toolboxItems.ContentsType[], shownPythonToolboxCategories: Set<string>) {
  contents.forEach((item) => {
    if (item.kind === 'category') {
      const category = item as toolboxItems.Category;
      // Traverse the tree depth-first so we can easily identify and remove empty categories.
      if (category.contents) {
        filterGeneratedCategories(category.contents, shownPythonToolboxCategories);
      }
      if ((category as toolboxItems.PythonModuleCategory).moduleName) {
        const moduleName = (item as toolboxItems.PythonModuleCategory).moduleName;
        if (!shownPythonToolboxCategories.has(moduleName)) {
          if (category.contents) {
            removeBlocksAndSeparators(category.contents);
          }
        }
      }
      if ((category as toolboxItems.PythonClassCategory).className) {
        const className = (item as toolboxItems.PythonClassCategory).className;
        if (!shownPythonToolboxCategories.has(className)) {
          if (category.contents) {
            removeBlocksAndSeparators(category.contents);
          }
        }
      }
    }
  });
  removeEmptyCategories(contents, shownPythonToolboxCategories);
}

function removeBlocksAndSeparators(contents: toolboxItems.ContentsType[]) {
  let i = 0;
  while (i < contents.length) {
    const remove = (contents[i].kind === 'block' || contents[i].kind === 'sep');
    if (remove) {
      contents.splice(i, 1);
      continue;
    }
    i++;
  }
}

function removeEmptyCategories(
    contents: toolboxItems.ContentsType[], shownPythonToolboxCategories: Set<string>) {
  let i = 0;
  while (i < contents.length) {
    let remove = false;
    if (contents[i].kind === 'category') {
      const category = contents[i] as toolboxItems.Category;
      let fullCategoryName = '';
      if ((category as toolboxItems.PythonModuleCategory).moduleName) {
        fullCategoryName = (category as toolboxItems.PythonModuleCategory).moduleName
      } else if ((category as toolboxItems.PythonClassCategory).className) {
        fullCategoryName = (category as toolboxItems.PythonClassCategory).className;
      }
      if (category.contents &&
          category.contents.length == 0 &&
          !shownPythonToolboxCategories.has(fullCategoryName)) {
        remove = true;
      }
    }
    if (remove) {
      contents.splice(i, 1);
      continue;
    }
    i++;
  }
}
