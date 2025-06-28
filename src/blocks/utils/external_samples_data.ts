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

import { PythonData, ClassData } from './python_json_types';
import generatedExternalSamplesData from './generated/external_samples_data.json';

export const externalSamplesData = generatedExternalSamplesData as PythonData;

export function getClassData(className: string): ClassData | null {
  for (const classData of externalSamplesData.classes) {
    if (classData.className === className) {
      return classData;
    }
  }
  return null;
}
