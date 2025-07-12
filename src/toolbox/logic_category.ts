import * as Blockly from 'blockly/core';

export const getCategory = () => (
{
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_LOGIC'],
    categorystyle: 'logic_category',
    contents: [
        {
            kind: 'block',
            type: 'controls_if',
        },
        {
            kind: 'block',
            type: 'controls_if',
            extraState: {
              hasElse: 'true',
            },
          },
        {
            kind: 'block',
            type: 'controls_if',
            extraState: {
              hasElse: 'true',
              elseIfCount: 1,
            },
          },
        {
            kind: 'block',
            type: 'logic_compare',
        },
        {
            kind: 'block',
            type: 'logic_operation',
        },
        {
            kind: 'block',
            type: 'logic_negate',
        },
        {
            kind: 'block',
            type: 'logic_boolean',
        },
        {
            kind: 'block',
            type: 'logic_null',
        },
        {
            kind: 'block',
            type: 'logic_ternary',
        },
    ],
});