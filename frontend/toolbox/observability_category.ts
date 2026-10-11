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
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { Editor } from '../editor/editor';
import { getDriverStationDisplayCategory } from './driver_station_category';
import {
    getAlertsCategory,
    getTelemetryCategory,
    getTunablesCategory } from './telemetry_tunables_category';

// The categories for seeing what the robot is doing while it runs.
export function getObservabilityCategory(editor: Editor): toolboxItems.Category {
  const category = new toolboxItems.Category(
      Blockly.Msg['MRC_CATEGORY_OBSERVABILITY'],
      [
        getDriverStationDisplayCategory(editor),
        getAlertsCategory(editor.getShowSimpleClassNames()),
        getTelemetryCategory(),
        getTunablesCategory(),
      ],
      toolboxItems.ExpandedState.EXPANDED);
  category.tooltip = Blockly.Msg['MRC_CATEGORY_OBSERVABILITY_TOOLTIP'];
  return category;
}
