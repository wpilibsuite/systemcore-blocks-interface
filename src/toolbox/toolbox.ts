import * as Blockly from 'blockly/core';
import * as commonStorage from '../storage/common_storage';
import * as common from './toolbox_common'
import { getHardwareCategory } from './hardware_category';
import { getCategory as eventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null,
    currentModule: commonStorage.Module): Blockly.utils.toolbox.ToolboxDefinition {
    switch (currentModule.moduleType) {
        case commonStorage.MODULE_TYPE_ROBOT:
        case commonStorage.MODULE_TYPE_MECHANISM:
            return {
                kind: 'categoryToolbox',
                contents: [
                    getHardwareCategory(currentModule),
                    { kind: 'sep' },
                    ...common.getToolboxItems(shownPythonToolboxCategories),
                    eventCategory(),
                ]
            };
        case commonStorage.MODULE_TYPE_OPMODE:
            return {
                kind: 'categoryToolbox',
                contents: [
                    getHardwareCategory(currentModule),
                    { kind: 'sep' },
                    ...common.getToolboxItems(shownPythonToolboxCategories)
                ]
            };
        default:
            return {
                kind: 'categoryToolbox',
                contents: []
            };
    }
}