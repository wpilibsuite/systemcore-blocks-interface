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
 *
 * Zelos also draws every value input inline (RenderInfo.isInline is always
 * true, whatever block.getInputsInline() says), so, for example, a port
 * block plugged into a component looks like one of the component's own
 * fields. Like Thrasos, this renderer only draws a block's value inputs
 * inline when the block's inputs are inline; otherwise they are external
 * connectors, with a socket in the right edge of the block shaped to fit the
 * connected block's left end. Blockly's ExternalValueInput and its connection
 * position assume the classic puzzle tab, so
 * FirstBlocksStyleExternalValueInput and FirstBlocksStyleDrawer size, draw,
 * and position the socket for Zelos's dynamic shapes.
 *
 * Zelos draws the whole right side of a reporter block (one with an output
 * connection) as a copy of its output shape, so it has nowhere to put an
 * external input. A reporter block with external inputs keeps Zelos's output
 * shape on its left side but gets a straight right side with the sockets in
 * it, drawn row by row like the classic renderers.
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

/**
 * An external value input for a Zelos dynamic connection shape. Blockly's
 * ExternalValueInput expects the numeric shape sizes of the classic puzzle
 * tab, but Zelos shapes size themselves from the height of the connected
 * block, so the sizes are worked out here instead. The socket has the shape of
 * the connected block's output (round, hexagonal, or square), is as tall as
 * that block, and is as wide as that block's left end, which fits into it.
 */
class FirstBlocksStyleExternalValueInput extends Blockly.blockRendering.ExternalValueInput {
  constructor(constants: FirstBlocksStyleConstantProvider, input: Blockly.Input) {
    super(constants, input);
    const insertionMarker =
        (input.connection as Blockly.RenderedConnection).getInsertionMarker();
    if (this.connectedBlock && this.connectedBlock.outputConnection) {
      this.shape = constants.shapeFor(this.connectedBlock.outputConnection);
    }
    let height = constants.MIN_BLOCK_HEIGHT;
    if (insertionMarker) {
      height = insertionMarker.getHeightWidth().height;
    } else if (this.connectedBlock) {
      height = this.connectedBlock.getHeightWidth().height;
    }
    const shape = this.shape as Blockly.blockRendering.DynamicShape;
    this.height = height;
    this.connectionHeight = height;
    this.connectionWidth = shape.width(height);
    this.width = this.connectionWidth;
  }
}

class FirstBlocksStyleRenderInfo extends Blockly.zelos.RenderInfo {
  /** Whether any row of the block has an external value input. */
  hasExternalInputs = false;

  constructor(renderer: Blockly.zelos.Renderer, block: Blockly.BlockSvg) {
    super(renderer, block);
    this.topRow = new FirstBlocksStyleTopRow(this.constants_);
    this.bottomRow = new FirstBlocksStyleBottomRow(this.constants_);
    // Zelos always sets isInline to true. Use the block's setting instead, as
    // the common RenderInfo (and so Thrasos) does.
    this.isInline = block.getInputsInline() && !block.isCollapsed();
  }

  override addInput_(input: Blockly.Input, activeRow: Blockly.blockRendering.Row): void {
    if (!this.isInline && input instanceof Blockly.inputs.ValueInput) {
      activeRow.elements.push(new FirstBlocksStyleExternalValueInput(
          this.constants_ as FirstBlocksStyleConstantProvider, input));
      activeRow.hasExternalInput = true;
      this.hasExternalInputs = true;
      return;
    }
    super.addInput_(input, activeRow);
  }

  override getInRowSpacing_(
      prev: Blockly.blockRendering.Measurable | null,
      next: Blockly.blockRendering.Measurable | null): number {
    // Zelos leaves no padding at the end of a reporter block's rows, because
    // its output shape on the right side provides it. A reporter block with
    // external inputs has a straight right side, so keep the padding there.
    if (this.hasExternalInputs && prev && !next &&
        !Blockly.blockRendering.Types.isExternalInput(prev)) {
      return this.constants_.MEDIUM_PADDING;
    }
    return super.getInRowSpacing_(prev, next);
  }

  protected override finalizeOutputConnection_(): void {
    super.finalizeOutputConnection_();
    // A reporter block with external inputs doesn't have Zelos's output shape
    // on its right side, so take away the width Zelos added for it.
    if (this.hasExternalInputs && this.rightSide && this.rightSide.width) {
      this.width -= this.rightSide.width;
      this.widthWithChildren -= this.rightSide.width;
      this.rightSide.width = 0;
    }
  }

  protected override finalizeHorizontalAlignment_(): void {
    // This pulls the ends of each row into Zelos's output shapes on both sides
    // of a reporter block, which doesn't fit a straight right side.
    if (this.hasExternalInputs) {
      return;
    }
    super.finalizeHorizontalAlignment_();
  }
}

class FirstBlocksStyleDrawer extends Blockly.zelos.Drawer {
  declare info_: FirstBlocksStyleRenderInfo;

  override drawOutline_(): void {
    if (this.info_.hasExternalInputs) {
      // Zelos draws a reporter block's outline without looking at its rows,
      // which would leave out the sockets. Draw it row by row like the common
      // drawer does. drawLeft_ still draws Zelos's output shape on the left.
      Blockly.blockRendering.Drawer.prototype['drawOutline_'].call(this);
      return;
    }
    super.drawOutline_();
  }

  // Draws the socket for an external input as the reverse of the connected
  // block's left end, so that end nests into the right edge of this block.
  // The socket is centred on the row.
  protected override drawValueInput_(row: Blockly.blockRendering.Row): void {
    const input = row.getLastInput() as FirstBlocksStyleExternalValueInput;
    const shape = input.shape as Blockly.blockRendering.DynamicShape;
    this.positionExternalValueConnection_(row);
    this.outlinePath_ +=
        Blockly.utils.svgPaths.lineOnAxis('H', input.xPos + input.width) +
        Blockly.utils.svgPaths.lineOnAxis('V', input.centerline - input.height / 2) +
        shape.pathDown(input.height) +
        Blockly.utils.svgPaths.lineOnAxis('V', row.yPos + row.height);
  }

  // The connection is at the deepest point of the socket, which is where the
  // tip of the connected block's left end (its output connection) goes.
  protected override positionExternalValueConnection_(row: Blockly.blockRendering.Row): void {
    const input = row.getLastInput();
    if (input && input.connectionModel) {
      const connX = this.info_.RTL ? -input.xPos : input.xPos;
      input.connectionModel.setOffsetInBlock(connX, input.centerline);
    }
  }

  override drawConnectionHighlightPath(
      measurable: Blockly.blockRendering.Connection): SVGElement | undefined {
    if (!Blockly.blockRendering.Types.isExternalInput(measurable)) {
      return super.drawConnectionHighlightPath(measurable);
    }
    const input = measurable as FirstBlocksStyleExternalValueInput;
    const shape = input.shape as Blockly.blockRendering.DynamicShape;
    const path =
        Blockly.utils.svgPaths.moveTo(input.connectionWidth, -input.height / 2) +
        shape.pathDown(input.height);
    const conn = input.connectionModel;
    const block = conn.getSourceBlock();
    return block.pathObject.addConnectionHighlight?.(
        conn, path, conn.getOffsetInBlock(), block.RTL);
  }
}

class FirstBlocksStyleRenderer extends Blockly.zelos.Renderer {
  protected makeConstants_(): FirstBlocksStyleConstantProvider {
    return new FirstBlocksStyleConstantProvider();
  }

  protected makeRenderInfo_(block: Blockly.BlockSvg): FirstBlocksStyleRenderInfo {
    return new FirstBlocksStyleRenderInfo(this, block);
  }

  protected makeDrawer_(
      block: Blockly.BlockSvg,
      info: Blockly.blockRendering.RenderInfo): FirstBlocksStyleDrawer {
    return new FirstBlocksStyleDrawer(block, info as FirstBlocksStyleRenderInfo);
  }
}

Blockly.blockRendering.register(FIRST_BLOCKS_STYLE_RENDERER_NAME, FirstBlocksStyleRenderer);
