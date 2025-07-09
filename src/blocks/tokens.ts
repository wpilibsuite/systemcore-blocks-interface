import * as Blockly from 'blockly/core';

export const customTokens = (t: (key: string) => string): typeof Blockly.Msg => {
  return {
    ADD_COMMENT: t('BLOCKLY.ADD_COMMENT'),
    REMOVE_COMMENT: t('BLOCKLY.REMOVE_COMMENT'),
    DUPLICATE_COMMENT: t('BLOCKLY.DUPLICATE_COMMENT'),
    OF_TYPE: t('BLOCKLY.OF_TYPE'),
  };
};