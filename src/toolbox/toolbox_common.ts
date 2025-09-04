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
import * as Blockly from 'blockly/core';
import { getCategory as getLogicCategory } from './logic_category';
import { getCategory as getLoopCategory } from './loop_category';
import { getCategory as getMathCategory } from './math_category';
import { getCategory as getTextCategory } from './text_category';
import { getCategory as getListsCategory } from './lists_category';
import { getCategory as getMiscCategory } from './misc_category';
import { getCategory as getMethodsCategory } from './methods_category';
import { getCategory as getTestCategory } from './test_category';
import { Editor } from '../editor/editor';


export function getToolboxItems(
    shownPythonToolboxCategories: Set<string> | null,
    editor: Editor): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];

  const robotPyCategories: toolboxItems.ContentsType[] = robotPyToolbox.getToolboxCategories(shownPythonToolboxCategories);

  if (robotPyCategories.length) {
    contents.push.apply(contents, robotPyCategories);
    contents.push.apply(contents, [
      {
        kind: 'sep',
      },
    ]);
  }
  const testCategory = getTestCategory();
  if (testCategory.contents && testCategory.contents.length > 0) {
    contents.push.apply(contents, [testCategory]);
  }

  contents.push.apply(
    contents,
    [
      getLogicCategory(),
      getLoopCategory(),
      getMathCategory(),
      getTextCategory(),
      getListsCategory(),
      getMiscCategory(),
      {
        kind: 'sep',
      },
      {
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_VARIABLES'],
        categorystyle: 'variable_category',
        custom: 'VARIABLE',
      },
      getMethodsCategory(editor),

    ],
  );
  return contents;
}