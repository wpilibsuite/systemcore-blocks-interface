/**
 * @license
 * Copyright 2024 Google LLC
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
 * @fileoverview Miscellaneous blocks.
 * @author lizlooney@google.com (Liz Looney)
 */


import * as Blockly from 'blockly';
import { PythonGenerator } from 'blockly/python';
import { MRC_STYLE_COMMENTS } from '../themes/styles';


// TODO(lizlooney): Use style instead of color.
const miscColor = 240;        // blue

export const BLOCK_NAME = 'mrc_misc_comment';

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput(''), 'COMMENT');
      this.getField('COMMENT').maxDisplayLength = 140;
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle(MRC_STYLE_COMMENTS);
    },
  };
};

export const pythonFromBlock = function(
    block: Blockly.Block,
    generator: PythonGenerator,
) {
  return '# ' + block.getFieldValue('COMMENT') + '\n';
};
