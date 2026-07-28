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
 * @fileoverview A block for adding a captioned, colored line of data to the
 * driver station display.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import { Order, PythonGenerator } from 'blockly/python';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';

export const BLOCK_NAME = 'mrc_driver_station_display';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput('CAPTION')
          .setCheck('String')
          .appendField(Blockly.Msg.DISPLAY_ADD_DATA_TITLE)
          .appendField(Blockly.Msg.CAPTION);
      this.appendValueInput('COLOR')
          .setCheck('wpiutil.Color')
          .appendField(Blockly.Msg.COLOR);
      this.appendValueInput('LINE')
          .setCheck('String')
          .appendField(Blockly.Msg.LINE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(MRC_STYLE_DRIVER_STATION);
      this.setTooltip(Blockly.Msg.DISPLAY_ADD_DATA_TOOLTIP);
    },
  };
};

/**
 * If a color is given, returns the line prefixed with the ANSI escape code
 * for that color (on its own line, for readability). If no color is given,
 * the line is returned unchanged.
 */
export function buildColorPrefixedLineArg(
    generator: PythonGenerator,
    color: string | null,
    line: string): string {
  return color
      ? 'f\'\\x1b[38;2;{int(' + color + '.red*255)};' +
          '{int(' + color + '.green*255)};{int(' + color + '.blue*255)}m\' +\n' +
          generator.INDENT + generator.INDENT + line
      : line;
}

/**
 * Comments out every line of the given code, because self.display doesn't
 * exist on the backend yet.
 */
export function commentOutCode(code: string): string {
  return code
      .split('\n')
      .map(line => line.length ? '# ' + line : line)
      .join('\n');
}

/**
 * Generates the python code that calls self.display.addData. self.display.addData
 * resets the ANSI color code on its own, so we don't need to.
 */
export function generateAddDataCode(
    generator: PythonGenerator,
    caption: string,
    color: string | null,
    line: string): string {
  const lineArg = buildColorPrefixedLineArg(generator, color, line);
  const code = 'self.display.addData(\n' +
      generator.INDENT + caption + ',\n' +
      generator.INDENT + lineArg + ')\n';
  return commentOutCode(code);
}

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const caption = generator.valueToCode(block, 'CAPTION', Order.NONE) || '\'\'';
  const color = generator.valueToCode(block, 'COLOR', Order.MEMBER) || null;
  const line = generator.valueToCode(block, 'LINE', Order.NONE) || '\'\'';
  return generateAddDataCode(generator, caption, color, line);
};
