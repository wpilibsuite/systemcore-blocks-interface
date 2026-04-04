import * as Blockly from 'blockly/core';

export const getCategory = () => ({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_LOOPS'],
    categorystyle: 'loop_category',
    contents: [
      {
        kind: 'block',
        type: 'controls_repeat_ext',
        inputs: {
          TIMES: {
            shadow: {
              type: 'math_number',
              fields: {
                NUM: 10,
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'controls_whileUntil',
      },
      {
        kind: 'block',
        type: 'controls_for',
        inputs: {
          FROM: {
            shadow: {
              type: 'math_number',
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            shadow: {
              type: 'math_number',
              fields: {
                NUM: 10,
              },
            },
          },
          BY: {
            shadow: {
              type: 'math_number',
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'controls_forEach',
      },
      {
        kind: 'block',
        type: 'controls_flow_statements',
      },
    ],
  });