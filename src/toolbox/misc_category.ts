import * as Blockly from 'blockly/core';
export const getCategory = () => ({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_MISC'],
    contents: [
        {
            kind: 'block',
            type: 'mrc_misc_comment',
            fields: {
                COMMENT: 'Enter your comment here!',
            },
        },
        {
            kind: 'block',
            type: 'mrc_misc_evaluate_but_ignore_result',
        },
    ],
});