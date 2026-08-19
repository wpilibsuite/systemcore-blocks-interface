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
 * makes the right side of a compact_zelos block curve too, which is what
 * looked wrong compared to Thrasos. Subclassing Zelos's TopRow/BottomRow
 * to force hasRightSquareCorner() back to true - and wiring them in via a
 * RenderInfo subclass, since Zelos's RenderInfo constructs its rows
 * directly rather than through an overridable factory method - restores
 * Thrasos's "round left, square right" shape while keeping every other
 * Zelos-specific shape (hex booleans, pill fields, notches, tabs) intact.
 */

import * as Blockly from 'blockly/core';

export const COMPACT_ZELOS_RENDERER_NAME = 'compact_zelos';

/** Grid unit (in px) used to size Zelos blocks. Zelos's default is 4. */
const COMPACT_GRID_UNIT = 2;

class CompactZelosConstantProvider extends Blockly.zelos.ConstantProvider {
  constructor() {
    super(COMPACT_GRID_UNIT);
    this.FIELD_TEXT_FONTSIZE = 11;
    this.FIELD_TEXT_FONTWEIGHT = 'normal';
    this.FIELD_TEXT_FONTFAMILY = 'sans-serif';
    this.CORNER_RADIUS = 8;
  }
}

class CompactZelosTopRow extends Blockly.zelos.TopRow {
  override hasRightSquareCorner(_block: Blockly.BlockSvg): boolean {
    return true;
  }
}

class CompactZelosBottomRow extends Blockly.zelos.BottomRow {
  override hasRightSquareCorner(_block: Blockly.BlockSvg): boolean {
    return true;
  }
}

class CompactZelosRenderInfo extends Blockly.zelos.RenderInfo {
  constructor(renderer: Blockly.zelos.Renderer, block: Blockly.BlockSvg) {
    super(renderer, block);
    this.topRow = new CompactZelosTopRow(this.constants_);
    this.bottomRow = new CompactZelosBottomRow(this.constants_);
  }
}

class CompactZelosRenderer extends Blockly.zelos.Renderer {
  protected makeConstants_(): CompactZelosConstantProvider {
    return new CompactZelosConstantProvider();
  }

  protected makeRenderInfo_(block: Blockly.BlockSvg): CompactZelosRenderInfo {
    return new CompactZelosRenderInfo(this, block);
  }
}

Blockly.blockRendering.register(COMPACT_ZELOS_RENDERER_NAME, CompactZelosRenderer);
