 import * as common from './toolbox_common'
 import {category as hardwareCategory} from './hardware_category';
 import {category as eventCategory} from './event_category';
 
 export function getToolboxJSON(
     shownPythonToolboxCategories: Set<string> | null) {
 
     return {
         kind: 'categoryToolbox',
         contents: [
            hardwareCategory,
            eventCategory,
            { kind: 'sep' },
            ...common.getToolboxItems(shownPythonToolboxCategories)
         ]
     };
 }
 