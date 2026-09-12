
import * as Blockly from 'blockly/core';
import * as toolboxItems from './items';
import { FunctionData } from '../blocks/utils/python_json_types';
import { addBuiltInFunctionBlocks } from '../blocks/mrc_call_python_function';
import { ObjectDefinition, createMultipleMethodsBlock } from '../blocks/mrc_multiple_methods';

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

  const randomObject: ObjectDefinition = {
    pythonObject: 'random',
    importModule: 'random',
    categories: [
      {
        name: 'Numbers',
        methods: [
          {
            name: 'random',
            tooltip: 'Return a random number between 0 and 1',
            returnType: 'float',
          },
          {
            name: 'uniform',
            tooltip: 'Return a random number between a and b',
            parameters: [
              {name: 'a', type: 'float', defaultValue: '0'},
              {name: 'b', type: 'float', defaultValue: '10'},
            ],
            returnType: 'float',
          },
          {
            name: 'randint',
            tooltip: 'Return a random integer between a and b, inclusive',
            parameters: [
              {name: 'a', type: 'int', defaultValue: '1'},
              {name: 'b', type: 'int', defaultValue: '6'},
            ],
            returnType: 'int',
          },
        ],
      },
      {
        name: 'Setup',
        methods: [
          {
            name: 'seed',
            tooltip: 'Initialize the random number generator',
            parameters: [{name: 'a', label: 'seed', type: 'int', field: true, defaultValue: '0'}],
          },
        ],
      },
    ],
  };
  contents.push(createMultipleMethodsBlock(randomObject));

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_TEST'],
    contents,
  };
}
