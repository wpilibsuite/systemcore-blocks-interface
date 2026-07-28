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
 * @fileoverview A block for adding a colored line of data, without a
 * caption, to the driver station display.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import { Order, PythonGenerator } from 'blockly/python';
import { MRC_STYLE_DRIVER_STATION } from '../themes/styles';
import { buildColorPrefixedLineArg, commentOutCode } from './mrc_driver_station_display';

export const BLOCK_NAME = 'mrc_driver_station_display_line';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendValueInput('COLOR')
          .setCheck('wpiutil.Color')
          .appendField(Blockly.Msg.DISPLAY_ADD_LINE_TITLE)
          .appendField(Blockly.Msg.COLOR);
      this.appendValueInput('LINE')
          .setCheck('String')
          .appendField(Blockly.Msg.LINE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(MRC_STYLE_DRIVER_STATION);
      this.setTooltip(Blockly.Msg.DISPLAY_ADD_LINE_TOOLTIP);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  const color = generator.valueToCode(block, 'COLOR', Order.MEMBER) || null;
  const line = generator.valueToCode(block, 'LINE', Order.NONE) || '\'\'';
  const lineArg = buildColorPrefixedLineArg(generator, color, line);
  const code = 'self.display.addLine(\n' +
      generator.INDENT + lineArg + ')\n';
  return commentOutCode(code);
};
