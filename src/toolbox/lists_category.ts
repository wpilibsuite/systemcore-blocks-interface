import * as Blockly from 'blockly/core';

export const getCategory = () => ({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_LISTS'],
    categorystyle: 'list_category',
    contents: [
      {
        kind: 'block',
        type: 'lists_create_empty',
      },
      {
        kind: 'block',
        type: 'lists_create_with',
        extraState: {
          itemCount: 3,
        },
      },
      {
        kind: 'block',
        type: 'lists_repeat',
        inputs: {
          NUM: {
            shadow: {
              type: 'math_number',
              fields: {
                NUM: 5,
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_length',
      },
      {
        kind: 'block',
        type: 'lists_isEmpty',
      },
      {
        kind: 'block',
        type: 'mrc_list_add_item',
        inputs: {
          LIST: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_indexOf',
        inputs: {
          VALUE: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_getIndex',
        inputs: {
          VALUE: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_setIndex',
        inputs: {
          LIST: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_getSublist',
        inputs: {
          LIST: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_split',
        inputs: {
          DELIM: {
            shadow: {
              type: 'text',
              fields: {
                TEXT: ',',
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_sort',
        inputs: {
          LIST: {
            block: {
              type: 'variables_get',
              fields: {
                VAR: {
                  name: 'myList',
                },
              },
            },
          },
        },
      },
      {
        kind: 'block',
        type: 'lists_reverse',
      },
    ],
  });