// Copyright (c) FIRST and other WPILib contributors.

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
