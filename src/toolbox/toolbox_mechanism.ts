import * as common from './toolbox_common'
import { category as hardwareComponentCategory } from './hardware_component_category';
import { category as eventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null) {

    return {
        kind: 'categoryToolbox',
        contents: [
           hardwareComponentCategory,
           eventCategory,
           { kind: 'sep' },
           ...common.getToolboxItems(shownPythonToolboxCategories)
        ]
    };
}
