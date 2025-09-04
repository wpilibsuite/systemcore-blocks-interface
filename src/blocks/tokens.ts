/**
 * @license
 * Copyright 2025 Porpoiseful LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Exposes translatable strings for use as Blockly.Msg tokens.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

/**
 * Creates custom translation tokens for Blockly messages.
 * @param t Translation function that takes a key and returns translated string.
 * @return Object containing translated Blockly message tokens.
 */
export function customTokens(t: (key: string) => string): typeof Blockly.Msg {
  return {
    OF_TYPE: t('BLOCKLY.OF_TYPE'),
    WITH: t('BLOCKLY.WITH'),
    WHEN: t('BLOCKLY.WHEN'),
    PARAMETER: t('BLOCKLY.PARAMETER'),
    PARAMETERS_CAN_ONLY_GO_IN_THEIR_METHODS_BLOCK:
      t('BLOCKLY.PARAMETERS_CAN_ONLY_GO_IN_THEIR_METHODS_BLOCK'),
    MECHANISMS: t('MECHANISMS'),
    OPMODES: t('OPMODES'),
    COMPONENTS: t('BLOCKLY.COMPONENTS'),
    EVENTS: t('BLOCKLY.EVENTS'),
    EVALUATE_BUT_IGNORE_RESULT: t('BLOCKLY.EVALUATE_BUT_IGNORE_RESULT'),
    EVALUATE_BUT_IGNORE_RESULT_TOOLTIP:
      t('BLOCKLY.TOOLTIP.EVALUATE_BUT_IGNORE_RESULT'),
    NONE: t('BLOCKLY.NONE'),
    NONE_TOOLTIP: t('BLOCKLY.TOOLTIP.NONE'),
    AUTO: t('BLOCKLY.AUTO'),
    TELEOP: t('BLOCKLY.TELEOP'),
    TEST: t('BLOCKLY.TEST'),
    TYPE: t('BLOCKLY.TYPE'),
    ENABLED: t('BLOCKLY.ENABLED'),
    DISPLAY_NAME: t('BLOCKLY.DISPLAY_NAME'),
    DISPLAY_GROUP: t('BLOCKLY.DISPLAY_GROUP'),
    NO_MECHANISM_CONTENTS: t('BLOCKLY.NO_MECHANISM_CONTENTS'),
    OPMODE_TYPE_TOOLTIP: t('BLOCKLY.TOOLTIP.OPMODE_TYPE'),
    OPMODE_ENABLED_TOOLTIP: t('BLOCKLY.TOOLTIP.OPMODE_ENABLED'),
    OPMODE_NAME_TOOLTIP: t('BLOCKLY.TOOLTIP.OPMODE_NAME'),
    OPMODE_GROUP_TOOLTIP: t('BLOCKLY.TOOLTIP.OPMODE_GROUP'),
    MRC_CATEGORY_HARDWARE: t('BLOCKLY.CATEGORY.HARDWARE'),
    MRC_CATEGORY_ROBOT: t('BLOCKLY.CATEGORY.ROBOT'),
    MRC_CATEGORY_COMPONENTS: t('BLOCKLY.CATEGORY.COMPONENTS'),
    MRC_CATEGORY_MECHANISMS: t('BLOCKLY.CATEGORY.MECHANISMS'),
    MRC_CATEGORY_LOGIC: t('BLOCKLY.CATEGORY.LOGIC'),
    MRC_CATEGORY_LOOPS: t('BLOCKLY.CATEGORY.LOOPS'),
    MRC_CATEGORY_LISTS: t('BLOCKLY.CATEGORY.LISTS'),
    MRC_CATEGORY_MATH: t('BLOCKLY.CATEGORY.MATH'),
    MRC_CATEGORY_TEXT: t('BLOCKLY.CATEGORY.TEXT'),
    MRC_CATEGORY_MISC: t('BLOCKLY.CATEGORY.MISC'),
    MRC_CATEGORY_VARIABLES: t('BLOCKLY.CATEGORY.VARIABLES'),
    MRC_CATEGORY_METHODS: t('BLOCKLY.CATEGORY.METHODS'),
    MRC_CATEGORY_EVENTS: t('BLOCKLY.CATEGORY.EVENTS'),
    MRC_CATEGORY_ADD_MECHANISM: t('BLOCKLY.CATEGORY.ADD_MECHANISM'),
    MRC_CATEGORY_ADD_COMPONENT: t('BLOCKLY.CATEGORY.ADD_COMPONENT'),
    MRC_CATEGORY_TEST: t('BLOCKLY.CATEGORY.TEST'),
    MRC_PRINT: t('BLOCKLY.PRINT'),
  }
}; 