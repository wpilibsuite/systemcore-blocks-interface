import * as common from './toolbox_common'
import { category as hardwareComponentCategory } from './add_hardware_component_category';
import { category as eventCategory } from './event_category';
import { category as componentsCategory } from './components_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null) {

    return {
        kind: 'categoryToolbox',
        contents: [
           hardwareComponentCategory,
           componentsCategory,
           eventCategory,
           { kind: 'sep' },
           ...common.getToolboxItems(shownPythonToolboxCategories)
        ]
    };
}
