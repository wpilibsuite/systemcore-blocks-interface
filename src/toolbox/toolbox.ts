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

import * as robotPyToolbox from './robotpy_toolbox';
import * as toolboxItems from './items';
import {category as logicCategory} from './logic_category';
import {category as loopCategory} from './loop_category';
import {category as mathCategory} from './math_category';
import {category as textCategory} from './text_category';
import {category as listsCategory} from './lists_category';
import {category as miscCategory} from './misc_category';
import {category as methodsCategory} from './methods_category';
import {category as componentSampleCategory} from './component_samples_category';
import {category as hardwareCategory} from './hardware_category';
import {category as robotCategory} from './robot_category';

export function getToolboxJSON(
    opt_robotBlocks: toolboxItems.ContentsType[],
    shownPythonToolboxCategories: Set<string> | null) {
  const contents: toolboxItems.ContentsType[] = [];

  const robotPyCategories: toolboxItems.ContentsType[] = robotPyToolbox.getToolboxCategories();
  filterRobotPyCategories(robotPyCategories, shownPythonToolboxCategories);
  contents.push.apply(contents, robotPyCategories);

  if (opt_robotBlocks.length) {
    contents.push.apply(
      contents,
      [
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'Project',
          contents: opt_robotBlocks,
        },
      ]);
  }

  contents.push.apply(
    contents,
    [
      {
        kind: 'sep',
      },
      robotCategory,
      {
        kind: 'sep',
      },
      logicCategory,
      loopCategory,
      mathCategory,
      textCategory,
      listsCategory,
      miscCategory,
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
      hardwareCategory,
      //componentSampleCategory,
    ]);

  return {
    kind: 'categoryToolbox',
    contents: contents
  };
}

function filterRobotPyCategories(
    contents: toolboxItems.ContentsType[], shownPythonToolboxCategories: Set<string> | null) {
  contents.forEach((item) => {
    if (item.kind === 'category') {
      const category = item as toolboxItems.Category;
      // Traverse the tree depth-first so we can easily identify and remove empty categories.
      if (category.contents) {
        filterRobotPyCategories(category.contents, shownPythonToolboxCategories);
      }
      if ((category as toolboxItems.PythonModuleCategory).moduleName) {
        const moduleName = (item as toolboxItems.PythonModuleCategory).moduleName;
        if (shownPythonToolboxCategories != null && !shownPythonToolboxCategories.has(moduleName)) {
          if (category.contents) {
            removeBlocksAndSeparators(category.contents);
          }
        }
      }
      if ((category as toolboxItems.PythonClassCategory).className) {
        const className = (item as toolboxItems.PythonClassCategory).className;
        if (shownPythonToolboxCategories != null && !shownPythonToolboxCategories.has(className)) {
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
    contents: toolboxItems.ContentsType[], shownPythonToolboxCategories: Set<string> | null) {
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
          shownPythonToolboxCategories != null && !shownPythonToolboxCategories.has(fullCategoryName)) {
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
