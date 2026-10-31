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
 * position assume the classic puzzle tab and the classic renderers' spacing,
 * so FirstBlocksStyleExternalValueInput and FirstBlocksStyleDrawer size, draw,
 * and position the socket to fit Zelos's dynamic shapes and spacing.
 *
 * Zelos draws the whole right side of a reporter block (one with an output
 * connection) as a copy of its output shape, so it has nowhere to put an
 * external input. A reporter block with external inputs keeps Zelos's output
 * shape on its left side but gets a straight right side with the sockets in
 * it, drawn row by row like the classic renderers.
 *
 * Zelos makes booleans hexagonal and everything else round. This renderer
 * gives each kind of value its own shape (see shapeFor), so it is easy to see
 * what kind of value goes where: booleans are hexagonal, numbers are round,
 * text has a tab shaped like a plug, objects (such as components and lists)
 * have the classic puzzle tab, like Thrasos, and ports are square. A
 * connection that takes any value also has the puzzle tab, until a block with
 * a type is connected to it, when it takes that block's shape instead. A
 * reporter block with a tab output is drawn like a Thrasos one, with square
 * corners and a straight right side.
 *
 * Zelos outlines each block with a 1px line in the style's colourTertiary,
 * which at compact size (and with our styles, some of whose colourTertiary is
 * lighter than the block) makes it hard to see where one block ends and the
 * next of the same colour starts. This renderer outlines each block with a
 * thicker line in a darker shade of the block's own colour instead. It also
 * draws a faint white line just inside the top edge of each block (like
 * Geras's highlight, but only along the top), so that where two blocks meet
 * there is a light line below the dark one.
 */

import * as Blockly from 'blockly/core';
import { isPortType } from '../blocks/utils/python_json_types';

export const FIRST_BLOCKS_STYLE_RENDERER_NAME = 'first_blocks_style';

/** Grid unit (in px) used to size Zelos blocks. Zelos's default is 4. */
const COMPACT_GRID_UNIT = 2;

/** The shape type of the plug tab, after the ones in ConstantProvider.SHAPES. */
const PLUG_SHAPE_TYPE = 6;

/**
 * Corner radius of the square shape for ports. Zelos uses CORNER_RADIUS, which
 * at this block height makes it look too much like the round shape.
 */
const SQUARED_CORNER_RADIUS = 4;

/** How far the slanted ends of the plug tab go along the block's edge. */
const PLUG_TAB_SLANT_HEIGHT = 4;

/**
 * How much black is mixed into a block's colour for its outline. Zelos mixes
 * in 0.25 for its generated colourTertiary.
 */
const OUTLINE_DARKEN_FACTOR = 0.3;

/** Width of a block's outline. The default of 1 is hard to see at this size. */
const OUTLINE_WIDTH = 1.5;

/** CSS class of the light line inside the top edge of each block. */
const TOP_HIGHLIGHT_CLASS = 'firstBlocksStyleTopHighlight';

/** Width of the light line inside the top edge of each block. */
const TOP_HIGHLIGHT_WIDTH = 1;

/** Opacity of the light line inside the top edge of each block. */
const TOP_HIGHLIGHT_OPACITY = 0.35;

/**
 * Moves the light line down from the top edge of the block, so that it is
 * just inside the outline rather than on top of it.
 */
const TOP_HIGHLIGHT_TRANSFORM =
    `translate(0 ${(OUTLINE_WIDTH + TOP_HIGHLIGHT_WIDTH) / 2})`;

/** Returns whether the given shape is one of Zelos's dynamic shapes. */
function isDynamicShape(shape: object): boolean {
  return (shape as {isDynamic?: boolean}).isDynamic === true;
}

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

  /** The shape of a text connection: a tab that narrows to its end, like a plug. */
  PLUG_TAB: Blockly.blockRendering.PuzzleTab | null = null;

  override init(): void {
    super.init();
    this.PLUG_TAB = this.makePlugTab_();
  }

  protected override makeSquared() {
    const cornerRadius = this.CORNER_RADIUS;
    this.CORNER_RADIUS = SQUARED_CORNER_RADIUS;
    const shape = super.makeSquared();
    this.CORNER_RADIUS = cornerRadius;
    return shape;
  }

  private makePlugTab_(): Blockly.blockRendering.PuzzleTab {
    const width = this.TAB_WIDTH;
    const height = this.TAB_HEIGHT;
    const straightHeight = height - 2 * PLUG_TAB_SLANT_HEIGHT;
    const makePath = (dir: number) =>
        Blockly.utils.svgPaths.line([
          Blockly.utils.svgPaths.point(-width, dir * PLUG_TAB_SLANT_HEIGHT)]) +
        Blockly.utils.svgPaths.lineOnAxis('v', dir * straightHeight) +
        Blockly.utils.svgPaths.line([
          Blockly.utils.svgPaths.point(width, dir * PLUG_TAB_SLANT_HEIGHT)]);
    return {
      type: PLUG_SHAPE_TYPE,
      width,
      height,
      pathDown: makePath(1),
      pathUp: makePath(-1),
    };
  }

  override shapeFor(connection: Blockly.RenderedConnection) {
    if (connection.type === Blockly.ConnectionType.INPUT_VALUE ||
        connection.type === Blockly.ConnectionType.OUTPUT_VALUE) {
      // Like Zelos, use the checks of the connected connection if this one
      // doesn't have any.
      let checks = connection.getCheck();
      if (!checks && connection.targetConnection) {
        checks = connection.targetConnection.getCheck();
      }
      // A connection that takes any value (no checks) has a puzzle tab, like
      // one that takes an object.
      if (!checks || checks.length === 0) {
        return this.PUZZLE_TAB;
      }
      if (checks.includes('Boolean')) {
        return this.HEXAGONAL!;
      }
      if (checks.includes('Number')) {
        return this.ROUNDED!;
      }
      if (checks.includes('String')) {
        return this.PLUG_TAB!;
      }
      if (checks.some(check => isPortType(check))) {
        return this.SQUARED!;
      }
      return this.PUZZLE_TAB;
    }
    return super.shapeFor(connection);
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

      // Block outlines, so that blocks of the same colour next to each other
      // are easy to tell apart.
      `${selector} .blocklyPath {`,
      `stroke-width: ${OUTLINE_WIDTH};`,
      `}`,
      `${selector} .${TOP_HIGHLIGHT_CLASS} {`,
      `fill: none;`,
      `stroke: #fff;`,
      `stroke-width: ${TOP_HIGHLIGHT_WIDTH};`,
      `stroke-opacity: ${TOP_HIGHLIGHT_OPACITY};`,
      `pointer-events: none;`,
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

/**
 * Draws each block's outline in a darker shade of the block's own colour.
 * Zelos uses the style's colourTertiary, but our styles (see styles.ts) set
 * colourTertiary for Geras's highlight, so for some of them it is lighter
 * than the block and the outline is hard to see.
 *
 * Also draws a light line just inside the top edge of the block, so that
 * where one block meets another there is a light line below the dark one.
 */
class FirstBlocksStylePathObject extends Blockly.zelos.PathObject {
  /** The light line inside the top edge of the block. */
  private readonly svgPathTopHighlight: SVGElement;

  constructor(
      root: SVGElement, style: Blockly.Theme.BlockStyle,
      constants: FirstBlocksStyleConstantProvider) {
    super(root, style, constants);
    this.svgPathTopHighlight = Blockly.utils.dom.createSvgElement(
        Blockly.utils.Svg.PATH, {'class': TOP_HIGHLIGHT_CLASS}, root);
  }

  /** Sets the path of the light line inside the top edge of the block. */
  setTopHighlightPath(pathString: string): void {
    this.svgPathTopHighlight.setAttribute('d', pathString);
  }

  override beginDrawing(): void {
    super.beginDrawing();
    this.svgPathTopHighlight.setAttribute('transform', TOP_HIGHLIGHT_TRANSFORM);
  }

  override flipRTL(): void {
    super.flipRTL();
    this.svgPathTopHighlight.setAttribute(
        'transform', `scale(-1 1) ${TOP_HIGHLIGHT_TRANSFORM}`);
  }

  override applyColour(block: Blockly.BlockSvg): void {
    super.applyColour(block);
    // Like Zelos, outline a shadow block in its parent's colour.
    const parent = block.getParent();
    const colour = block.isShadow() && parent ? parent.getColour() : this.style.colourPrimary;
    this.svgPath.setAttribute('stroke', outlineColourFor(colour));
  }
}

/** Returns the outline colour for a block with the given colour. */
function outlineColourFor(colour: string): string {
  return Blockly.utils.colour.blend('#000', colour, OUTLINE_DARKEN_FACTOR) || colour;
}

/**
 * Returns the given path without its final vertical line, if it ends with
 * one. The common drawer ends the top of a block with a line down the right
 * side of the top row, which isn't part of the top edge.
 */
function withoutFinalVerticalLine(pathString: string): string {
  return pathString.replace(/\s*v\s*[-+.\deE]+\s*$/, '');
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
 * An external value input sized to fit the connected block. Blockly's
 * ExternalValueInput expects the classic renderers' spacing, where the
 * connected block sticks out above and below the input's row, and the numeric
 * shape sizes of a tab, but Zelos shapes size themselves from the height of
 * the connected block. So the sizes are worked out here instead. The socket
 * has the shape of the connected block's output, is as tall as that block (so
 * the block fits within the row), and is as wide as that block's left end,
 * which fits into it. A puzzle or plug tab socket is as far from the top of
 * the input as the tab is from the top of a block.
 */
class FirstBlocksStyleExternalValueInput extends Blockly.blockRendering.ExternalValueInput {
  constructor(constants: FirstBlocksStyleConstantProvider, input: Blockly.Input) {
    super(constants, input);
    const insertionMarker =
        (input.connection as Blockly.RenderedConnection).getInsertionMarker();
    if (this.connectedBlock && this.connectedBlock.outputConnection) {
      const connectedShape = constants.shapeFor(this.connectedBlock.outputConnection);
      if (isDynamicShape(connectedShape) === this.isDynamicShape) {
        this.shape = connectedShape;
      }
    }
    let height = constants.MIN_BLOCK_HEIGHT;
    if (insertionMarker) {
      height = insertionMarker.getHeightWidth().height;
    } else if (this.connectedBlock) {
      height = this.connectedBlock.getHeightWidth().height;
    }
    this.height = height;
    if (this.isDynamicShape) {
      const shape = this.shape as Blockly.blockRendering.DynamicShape;
      this.connectionHeight = height;
      this.connectionWidth = shape.width(height);
      this.connectionOffsetY = 0;
    } else {
      const tab = this.shape as Blockly.blockRendering.PuzzleTab;
      this.connectionHeight = tab.height;
      this.connectionWidth = tab.width;
      this.connectionOffsetY = constants.TAB_OFFSET_FROM_TOP;
    }
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
    // Zelos's empty inline inputs are shorter than a puzzle or plug tab and the
    // space above it, and only leave room for one padding beside a tab (where
    // they leave room for two dynamic shapes), so make an empty one with a tab
    // as tall as a block and as wide as the dynamic ones.
    const elem = activeRow.elements[activeRow.elements.length - 1];
    if (Blockly.blockRendering.Types.isInlineInput(elem) && !elem.isDynamicShape &&
        !elem.connectedBlock) {
      elem.height = Math.max(elem.height, this.constants_.MIN_BLOCK_HEIGHT);
      elem.width = elem.connectionWidth + 2 * this.constants_.EMPTY_INLINE_INPUT_PADDING;
    }
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
    // of a reporter block, which doesn't fit a straight right side or a tab
    // output.
    if (this.hasExternalInputs ||
        (this.outputConnection && !this.outputConnection.isDynamicShape)) {
      return;
    }
    super.finalizeHorizontalAlignment_();
  }

  protected override finalizeVerticalAlignment_(): void {
    super.finalizeVerticalAlignment_();
    // Leave as much room below the tab of a puzzle or plug tab output as
    // there is above it, by making the first input row taller if needed.
    if (this.outputConnection && !this.outputConnection.isDynamicShape &&
        this.inputRows.length > 0) {
      const minHeight = 2 * this.constants_.TAB_OFFSET_FROM_TOP + this.constants_.TAB_HEIGHT;
      const height = this.rows.reduce((sum, row) => sum + row.height, 0);
      if (height < minHeight) {
        this.inputRows[0].height += minHeight - height;
      }
    }
  }

  protected override getNegativeSpacing_(elem: Blockly.blockRendering.Measurable): number {
    // Zelos doesn't know how much space to leave around a puzzle or plug tab
    // inside its output shapes, so don't pull an inline input with one into
    // them.
    if (elem && Blockly.blockRendering.Types.isInlineInput(elem)) {
      const connectedBlock = elem.connectedBlock;
      const innerShape = connectedBlock ?
          (connectedBlock.pathObject as Blockly.zelos.PathObject).outputShapeType :
          elem.shape.type;
      if (innerShape === this.constants_.SHAPES.PUZZLE || innerShape === PLUG_SHAPE_TYPE) {
        return 0;
      }
    }
    return super.getNegativeSpacing_(elem);
  }
}

class FirstBlocksStyleDrawer extends Blockly.zelos.Drawer {
  declare info_: FirstBlocksStyleRenderInfo;

  /** The top edge of the block's outline, for the light line inside it. */
  private topHighlightPath_ = '';

  override draw(): void {
    super.draw();
    (this.block_.pathObject as FirstBlocksStylePathObject).setTopHighlightPath(
        this.info_.isInsertionMarker ? '' : this.topHighlightPath_);
  }

  protected override drawTop_(): void {
    const start = this.outlinePath_.length;
    super.drawTop_();
    this.topHighlightPath_ = withoutFinalVerticalLine(this.outlinePath_.substring(start));
  }

  protected override drawFlatTop_(): void {
    const start = this.outlinePath_.length;
    super.drawFlatTop_();
    this.topHighlightPath_ = withoutFinalVerticalLine(this.outlinePath_.substring(start));
  }

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

  // Zelos draws an empty inline input as an outline of its dynamic shape. Draw
  // one with a puzzle or plug tab the same way.
  override drawInlineInput_(input: Blockly.blockRendering.InlineInput): void {
    if (input.isDynamicShape) {
      super.drawInlineInput_(input);
      return;
    }
    this.positionInlineInputConnection_(input);
    if (input.connectedBlock || this.info_.isInsertionMarker) {
      return;
    }
    const yPos = input.centerline - input.height / 2;
    const path = Blockly.utils.svgPaths.moveTo(input.xPos + input.connectionWidth, yPos) +
        this.getTabInlineInputPath_(input);
    (this.block_.pathObject as Blockly.zelos.PathObject).setOutlinePath(input.input.name, path);
  }

  // Returns the outline of an inline input with a puzzle or plug tab, starting
  // at its top left corner, to the right of the tab.
  private getTabInlineInputPath_(input: Blockly.blockRendering.InlineInput): string {
    const width = input.width - input.connectionWidth;
    const tabBottom = input.connectionOffsetY + input.connectionHeight;
    return Blockly.utils.svgPaths.lineOnAxis('h', width) +
        Blockly.utils.svgPaths.lineOnAxis('v', input.height) +
        Blockly.utils.svgPaths.lineOnAxis('h', -width) +
        Blockly.utils.svgPaths.lineOnAxis('v', tabBottom - input.height) +
        (input.shape as Blockly.blockRendering.PuzzleTab).pathUp +
        'z';
  }

  // Draws the socket for an external input as the reverse of the connected
  // block's left end, so that end nests into the right edge of this block.
  // The input is centred on the row.
  protected override drawValueInput_(row: Blockly.blockRendering.Row): void {
    const input = row.getLastInput() as FirstBlocksStyleExternalValueInput;
    this.positionExternalValueConnection_(row);
    const socketPath = input.isDynamicShape ?
        (input.shape as Blockly.blockRendering.DynamicShape).pathDown(input.height) :
        (input.shape as Blockly.blockRendering.PuzzleTab).pathDown;
    const top = input.centerline - input.height / 2;
    this.outlinePath_ +=
        Blockly.utils.svgPaths.lineOnAxis('H', input.xPos + input.width) +
        Blockly.utils.svgPaths.lineOnAxis('V', top + input.connectionOffsetY) +
        socketPath +
        Blockly.utils.svgPaths.lineOnAxis('V', row.yPos + row.height);
  }

  // The connection is where the connected block's output connection goes: the
  // deepest point of a dynamic socket, which the tip of the block's left end
  // fits into, or the top of a tab socket, on the right edge of this block.
  protected override positionExternalValueConnection_(row: Blockly.blockRendering.Row): void {
    const input = row.getLastInput() as FirstBlocksStyleExternalValueInput | null;
    if (input && input.connectionModel) {
      let connX = input.xPos;
      let connY = input.centerline;
      if (!input.isDynamicShape) {
        connX += input.width;
        connY += input.connectionOffsetY - input.height / 2;
      }
      input.connectionModel.setOffsetInBlock(this.info_.RTL ? -connX : connX, connY);
    }
  }

  override drawConnectionHighlightPath(
      measurable: Blockly.blockRendering.Connection): SVGElement | undefined {
    if (measurable.connectionModel.type === Blockly.ConnectionType.INPUT_VALUE &&
        !measurable.isDynamicShape) {
      if (Blockly.blockRendering.Types.isInlineInput(measurable)) {
        // Highlight the whole inline input, like Zelos does.
        const input = measurable as Blockly.blockRendering.InlineInput;
        const path = Blockly.utils.svgPaths.moveTo(0, -input.connectionOffsetY) +
            this.getTabInlineInputPath_(input);
        const conn = input.connectionModel;
        const block = conn.getSourceBlock();
        return block.pathObject.addConnectionHighlight?.(
            conn, path, conn.getOffsetInBlock(), block.RTL);
      }
      // Zelos's drawer assumes a dynamic shape, so use the common drawer's
      // tab highlight.
      return Blockly.blockRendering.Drawer.prototype.drawConnectionHighlightPath.call(
          this, measurable);
    }
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

  override makePathObject(root: SVGElement, style: Blockly.Theme.BlockStyle): FirstBlocksStylePathObject {
    return new FirstBlocksStylePathObject(
        root, style, this.getConstants() as FirstBlocksStyleConstantProvider);
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
