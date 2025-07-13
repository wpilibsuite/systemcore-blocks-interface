
import * as Blockly from 'blockly/core';
import * as toolboxItems from './items';
import { addBuiltInFunctionBlocks } from '../blocks/mrc_call_python_function';

export function getCategory(): toolboxItems.Category {
  const contents: toolboxItems.ContentsType[] = [];

  const printFunction: FunctionData = {
    functionName: 'print',
    tooltip: 'Print the given message',
    returnType: 'None',
    args: [{
      name: '',
      type: 'str',
    }],
  };

  addBuiltInFunctionBlocks([printFunction], contents);

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_TEST'],
    contents,
  };
}
