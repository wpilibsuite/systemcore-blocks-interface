import * as Blockly from 'blockly/core';
export const getCategory = () => ({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_TEST'],
    contents: [
        {
            kind: 'block',
            type: 'mrc_print',
        },
    ],
});