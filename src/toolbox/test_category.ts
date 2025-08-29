
import * as Blockly from 'blockly/core';
import * as toolboxItems from './items';
import { FunctionData } from '../blocks/utils/python_json_types';
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
      defaultValue: '""',
    }],
  };

  addBuiltInFunctionBlocks([printFunction], contents);

  contents.push({
    kind: 'block',
    type: 'mrc_port',
    extraState: {
      ports: [
        { portType: 'USB Port', portNumber: 1 },
        { portType: 'Expansion Hub Motor Port', portNumber: 2 },
      ],
    },
  });

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_TEST'],
    contents,
  };
}
