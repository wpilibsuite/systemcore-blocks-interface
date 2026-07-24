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
 * @fileoverview Grid and zoom configuration shared by every Blockly workspace in the app
 * (BlocklyComponent and ReadOnlyBlocklyPreview), so they stay visually consistent.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly/core';

/** Grid spacing for the Blockly workspace. */
export const GRID_SPACING = 20;

/** Grid line length for the Blockly workspace. */
export const GRID_LENGTH = 3;

/** Fallback grid color, used only if the theme does not define one. */
export const DEFAULT_GRID_COLOR = '#ccc';

/** Maximum zoom scale. */
export const MAX_ZOOM_SCALE = 3;

/** Minimum zoom scale. */
export const MIN_ZOOM_SCALE = 0.3;

/** Zoom scale speed multiplier. */
export const ZOOM_SCALE_SPEED = 1.2;

/** Gets the grid color defined by the given theme, falling back to a default. */
export function getGridColour(theme: Blockly.Theme | undefined): string {
  return theme?.getComponentStyle('gridColour') ?? DEFAULT_GRID_COLOR;
}

/** Builds the grid config shared by all Blockly workspaces in this app. */
export function getGridConfig(
    theme: Blockly.Theme | undefined, snap: boolean): Blockly.BlocklyOptions['grid'] {
  return {
    spacing: GRID_SPACING,
    length: GRID_LENGTH,
    colour: getGridColour(theme),
    snap,
  };
}

/** Builds the zoom config shared by all Blockly workspaces in this app. */
export function getZoomConfig(interactive: boolean, startScale: number): Blockly.BlocklyOptions['zoom'] {
  return {
    controls: interactive,
    wheel: interactive,
    startScale,
    maxScale: MAX_ZOOM_SCALE,
    minScale: MIN_ZOOM_SCALE,
    scaleSpeed: ZOOM_SCALE_SPEED,
  };
}
