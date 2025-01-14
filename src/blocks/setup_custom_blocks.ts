import * as Blockly from 'blockly';

import * as ListAddItem from './mrc_list_add_item';
import * as MathMinMax from './mrc_math_min_max';
import * as MiscComment from './mrc_misc_comment';
import * as MiscEvaluateButIgnoreResult from './mrc_misc_evaluate_but_ignore_result';

const customBlocks = [
  ListAddItem,
  MathMinMax,
  MiscComment,
  MiscEvaluateButIgnoreResult,
];

export const setup = function(forBlock: any) {
  customBlocks.forEach(block => {
    block.setup();
    forBlock[block.BLOCK_NAME] = block.pythonFromBlock;
  });
};
