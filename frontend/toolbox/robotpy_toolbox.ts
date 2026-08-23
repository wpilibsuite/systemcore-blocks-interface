/**
 * @license
 * Copyright 2025 Google LLC
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

import { robotPyData } from '../blocks/utils/python';
import * as pythonDataToolbox from './python_data_toolbox';
import * as toolboxItems from './items';


export function getToolboxCategories(
    shownPythonToolboxCategories: Set<string> | null,
    showSimpleClassNames: boolean): toolboxItems.Category[] {
  return pythonDataToolbox.getToolboxCategories(
      robotPyData,
      shownPythonToolboxCategories,
      showSimpleClassNames);
}
