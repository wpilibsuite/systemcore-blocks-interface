import * as Blockly from 'blockly';

import * as CallPythonFunction from './mrc_call_python_function';
import * as GetPythonEnumValue from './mrc_get_python_enum_value';
import * as GetPythonVariable from './mrc_get_python_variable';
import * as ListAddItem from './mrc_list_add_item';
import * as MathMinMax from './mrc_math_min_max';
import * as MiscComment from './mrc_misc_comment';
import * as MiscEvaluateButIgnoreResult from './mrc_misc_evaluate_but_ignore_result';
import * as SetPythonVariable from './mrc_set_python_variable';
import * as ClassMethodDef from './mrc_class_method_def';

const customBlocks = [
  CallPythonFunction,
  ClassMethodDef,
  GetPythonEnumValue,
  GetPythonVariable,
  ListAddItem,
  MathMinMax,
  MiscComment,
  MiscEvaluateButIgnoreResult,
  SetPythonVariable,
];

export const setup = function(forBlock: any) {
  customBlocks.forEach(block => {
    block.setup();
    forBlock[block.BLOCK_NAME] = block.pythonFromBlock;
  });
};
