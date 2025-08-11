import * as Blockly from 'blockly/core';
import * as storageModule from '../storage/module';
import * as common from './toolbox_common'
import { getHardwareCategory } from './hardware_category';
import { getCategory as eventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null,
    currentModule: storageModule.Module): Blockly.utils.toolbox.ToolboxDefinition {
    switch (currentModule.moduleType) {
        case storageModule.MODULE_TYPE_ROBOT:
        case storageModule.MODULE_TYPE_MECHANISM:
            return {
                kind: 'categoryToolbox',
                contents: [
                    getHardwareCategory(currentModule),
                    { kind: 'sep' },
                    ...common.getToolboxItems(shownPythonToolboxCategories),
                    eventCategory(),
                ]
            };
        case storageModule.MODULE_TYPE_OPMODE:
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