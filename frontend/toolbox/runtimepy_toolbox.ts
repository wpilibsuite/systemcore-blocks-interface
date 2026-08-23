/**
 * @license
 * Copyright 2026 Google LLC
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

import { runtimePyData } from '../blocks/utils/python';
import * as pythonDataToolbox from './python_data_toolbox';
import * as toolboxItems from './items';


export function getToolboxCategories(): toolboxItems.Category[] {
  const shownCategories: Set<string> = new Set();
  shownCategories.add("wpilib_blocks.color");
  const showSimpleClassNames = true;
  
  const categories: toolboxItems.Category[] = [];

  // Move the categories under wpilib_blocks up to the top level.
  for (const category of pythonDataToolbox.getToolboxCategories(runtimePyData, shownCategories, showSimpleClassNames)) {
    if (category.name == 'wpilib_blocks') {
      if (category.contents) {
        for (const child of category.contents) {
          if (child.kind === 'category') {
            categories.push(child as toolboxItems.Category);
          }
        }
      }
    } else {
      categories.push(category);
    }
  }
  return categories;
}
