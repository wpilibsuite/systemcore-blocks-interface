// Copyright (c) FIRST and other WPILib contributors.

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
