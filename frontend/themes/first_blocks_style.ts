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
 * @fileoverview A custom Blockly renderer with the Zelos look (rounded
 * pill-shaped fields, hexagonal boolean blocks, coloured dropdowns) but with
 * the compact spacing of Blockly's classic renderers.
 *
 * Zelos derives nearly all of its padding, spacing, and shape sizing from
 * ConstantProvider.GRID_UNIT, which defaults to 4. Constructing the provider
 * with a smaller grid unit scales every one of those values down
 * proportionally (e.g. corner radius stays in the same ratio to block
 * height), which shrinks Zelos blocks to roughly the footprint of the Geras
 * ("typical Blockly") renderer without changing Zelos's shapes or colours.
 *
 * Zelos's field text (12pt bold "Helvetica Neue") isn't scaled by
 * GRID_UNIT, so at compact size it no longer fits its field comfortably.
 * Thrasos's field text (11pt normal sans-serif) is sized for exactly the
 * field height this renderer ends up with, so its font settings are used
 * here instead.
 *
 * Likewise, Zelos's block corner radius (CORNER_RADIUS = 1 * GRID_UNIT)
 * shrinks along with GRID_UNIT, giving compact blocks nearly-square
 * corners. Thrasos uses the common ConstantProvider's fixed CORNER_RADIUS
 * of 8, which is exactly proportioned for the block height this renderer
 * ends up with (MIN_BLOCK_HEIGHT = 24 at GRID_UNIT = 2), so that value is
 * used here instead to keep Thrasos's more rounded corners.
 *
 * That CORNER_RADIUS only controls how round each corner *is*; whether a
 * given corner is rounded at all is decided separately, by
 * TopRow/BottomRow.hasRightSquareCorner(). The common (Thrasos/Geras) rows
 * always return true there, squaring off the right side, but Zelos
 * overrides both to return false for ordinary blocks so that all four
 * corners are rounded (part of its "pill" look). Left unchanged, that
 * makes the right side of a first_blocks_style block curve too, which is
 * what looked wrong compared to Thrasos. Subclassing Zelos's
 * TopRow/BottomRow to force hasRightSquareCorner() back to true - and
 * wiring them in via a RenderInfo subclass, since Zelos's RenderInfo
 * constructs its rows directly rather than through an overridable factory
 * method - restores Thrasos's "round left, square right" shape while
 * keeping every other Zelos-specific shape (hex booleans, pill fields,
 * notches, tabs) intact.
 *
 * Field colouring is also Zelos-specific in a way that reads poorly once
 * fields are small and compact: Zelos always renders field text as solid
 * white, and gives dropdown fields a fully transparent (i.e. block-colour)
 * background - text-visible only because default Zelos fields are large
 * enough for a bold white outline to read against any block colour.
 * Thrasos instead gives every field a translucent white background (so it
 * reads as a tinted pill rather than a see-through cutout) with dark text,
 * which stays legible at any size or block colour. getCSS_ here is Zelos's
 * own CSS with just that field styling swapped for Thrasos's.
 *
 * Field corner rounding follows the same "computed once, before our
 * override runs" trap as CORNER_RADIUS above: Zelos sets
 * FIELD_BORDER_RECT_RADIUS = CORNER_RADIUS inside its own constructor
 * (i.e. during super()), so it captures the compact 2px radius rather than
 * the 8px value this class assigns afterwards. Thrasos uses a fixed 4px
 * radius regardless of block size, so that value is set explicitly here
 * too, rather than re-deriving it from CORNER_RADIUS.
 *
 * Zelos's FULL_BLOCK_FIELDS = true goes a step further for "simple
 * reporter" blocks - ones with only a single field and an output
 * connection, e.g. a bare number or string - by skipping the field's
 * border rect entirely (FieldInput.isFullBlockField()) and instead
 * overwriting the *block's own* path fill with FIELD_BORDER_RECT_COLOUR
 * (white; see FieldInput.applyColour() and .render_()), so the whole block
 * goes solid white - losing the category colour Thrasos always keeps -
 * instead of just tinting the field within it. Setting
 * FULL_BLOCK_FIELDS = false disables that codepath, so these fields fall
 * back to an ordinary border rect - tinted and dark-on-light via the
 * getCSS_ override above, like every other field - while the block itself
 * keeps its normal category colour, matching Thrasos.
 */

import * as Blockly from 'blockly/core';

export const FIRST_BLOCKS_STYLE_RENDERER_NAME = 'first_blocks_style';

/** Grid unit (in px) used to size Zelos blocks. Zelos's default is 4. */
const COMPACT_GRID_UNIT = 2;

class FirstBlocksStyleConstantProvider extends Blockly.zelos.ConstantProvider {
  constructor() {
    super(COMPACT_GRID_UNIT);
    this.FIELD_TEXT_FONTSIZE = 11;
    this.FIELD_TEXT_FONTWEIGHT = 'normal';
    this.FIELD_TEXT_FONTFAMILY = 'sans-serif';
    this.CORNER_RADIUS = 8;
    this.FIELD_BORDER_RECT_RADIUS = 4;
    this.FULL_BLOCK_FIELDS = false;
  }

  override getCSS_(selector: string): string[] {
    return [
      // Text.
      `${selector} .blocklyText,`,
      `${selector} .blocklyFlyoutLabelText {`,
      `font: ${this.FIELD_TEXT_FONTWEIGHT} ${this.FIELD_TEXT_FONTSIZE}` +
        `pt ${this.FIELD_TEXT_FONTFAMILY};`,
      `}`,

      `${selector} .blocklyTextInputBubble textarea {`,
      `font-weight: normal;`,
      `}`,

      // Fields.
      `${selector} .blocklyText {`,
      `fill: #fff;`,
      `}`,
      // Unlike Zelos (which excludes dropdown rects here, leaving them fully
      // transparent), style every field's border rect the same translucent
      // way, so dropdowns read as a tinted pill instead of a cutout showing
      // the block's own colour through.
      `${selector} .blocklyNonEditableField>rect,`,
      `${selector} .blocklyEditableField>rect {`,
      `fill: ${this.FIELD_BORDER_RECT_COLOUR};`,
      `fill-opacity: .6;`,
      `stroke: none;`,
      `}`,
      `${selector} .blocklyNonEditableField>text,`,
      `${selector} .blocklyEditableField>text,`,
      `${selector} .blocklyNonEditableField>g>text,`,
      `${selector} .blocklyEditableField>g>text {`,
      `fill: #575E75;`,
      `}`,

      // Flyout labels.
      `${selector} .blocklyFlyoutLabelText {`,
      `fill: #575E75;`,
      `}`,

      // Bubbles.
      `${selector} .blocklyText.blocklyBubbleText {`,
      `fill: #575E75;`,
      `}`,

      // Editable field hover.
      `${selector} .blocklyDraggable:not(.blocklyDisabled)`,
      ` .blocklyEditableField:not(.blocklyEditing):hover>rect,`,
      `${selector} .blocklyDraggable:not(.blocklyDisabled)`,
      ` .blocklyEditableField:not(.blocklyEditing):hover>.blocklyPath {`,
      `stroke: #fff;`,
      `stroke-width: 2;`,
      `}`,

      // Text field input.
      `${selector} .blocklyHtmlInput {`,
      `font-family: ${this.FIELD_TEXT_FONTFAMILY};`,
      `font-weight: ${this.FIELD_TEXT_FONTWEIGHT};`,
      `color: #575E75;`,
      `}`,

      // Widget and Dropdown Div
      `${selector}.blocklyWidgetDiv .blocklyMenuItem,`,
      `${selector}.blocklyDropDownDiv .blocklyMenuItem {`,
      `font-family: ${this.FIELD_TEXT_FONTFAMILY};`,
      `}`,
      `${selector}.blocklyDropDownDiv .blocklyMenuItemContent {`,
      `color: #fff;`,
      `}`,

      // Connection highlight.
      `${selector} .blocklyHighlightedConnectionPathVisible {`,
      `stroke: ${this.SELECTED_GLOW_COLOUR};`,
      `}`,

      // Disabled outline paths.
      `${selector} .blocklyDisabledPattern > .blocklyOutlinePath {`,
      `fill: var(--blocklyDisabledPattern)`,
      `}`,

      // Insertion marker.
      `${selector} .blocklyInsertionMarker>.blocklyPath {`,
      `fill-opacity: ${this.INSERTION_MARKER_OPACITY};`,
      `stroke: none;`,
      `}`,

      `${selector} .blocklySelected>.blocklyPath.blocklyPathSelected {`,
      `fill: none;`,
      `filter: var(--blocklySelectedGlowFilter);`,
      `}`,
    ];
  }
}

class FirstBlocksStyleTopRow extends Blockly.zelos.TopRow {
  override hasRightSquareCorner(_block: Blockly.BlockSvg): boolean {
    return true;
  }
}

class FirstBlocksStyleBottomRow extends Blockly.zelos.BottomRow {
  override hasRightSquareCorner(_block: Blockly.BlockSvg): boolean {
    return true;
  }
}

class FirstBlocksStyleRenderInfo extends Blockly.zelos.RenderInfo {
  constructor(renderer: Blockly.zelos.Renderer, block: Blockly.BlockSvg) {
    super(renderer, block);
    this.topRow = new FirstBlocksStyleTopRow(this.constants_);
    this.bottomRow = new FirstBlocksStyleBottomRow(this.constants_);
  }
}

class FirstBlocksStyleRenderer extends Blockly.zelos.Renderer {
  protected makeConstants_(): FirstBlocksStyleConstantProvider {
    return new FirstBlocksStyleConstantProvider();
  }

  protected makeRenderInfo_(block: Blockly.BlockSvg): FirstBlocksStyleRenderInfo {
    return new FirstBlocksStyleRenderInfo(this, block);
  }
}

Blockly.blockRendering.register(FIRST_BLOCKS_STYLE_RENDERER_NAME, FirstBlocksStyleRenderer);
