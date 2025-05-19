import * as common from './toolbox_common'
import { category as hardwareComponentCategory } from './hardware_component_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null) {

    return {
        kind: 'categoryToolbox',
        contents: [
           hardwareComponentCategory,
           { kind: 'sep' },
           ...common.getToolboxItems(shownPythonToolboxCategories)
        ]
    };
}
