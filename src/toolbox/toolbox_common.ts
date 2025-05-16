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
import { category as logicCategory } from './logic_category';
import { category as loopCategory } from './loop_category';
import { category as mathCategory } from './math_category';
import { category as textCategory } from './text_category';
import { category as listsCategory } from './lists_category';
import { category as miscCategory } from './misc_category';
import { category as methodsCategory } from './methods_category';

export function getToolboxItems(
  shownPythonToolboxCategories: Set<string> | null) {
  const contents: toolboxItems.ContentsType[] = [];

  const robotPyCategories: toolboxItems.ContentsType[] = robotPyToolbox.getToolboxCategories(shownPythonToolboxCategories);

  if (robotPyCategories.length) {
    contents.push.apply(contents, robotPyCategories);
    contents.push.apply(contents, [
      {
        kind: 'sep',
      },]
    );
  }

  contents.push.apply(
    contents,
    [
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
    ],
  );
  return contents;
}