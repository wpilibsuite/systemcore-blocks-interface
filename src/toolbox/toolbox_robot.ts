 import * as common from './toolbox_common'
 import {category as hardwareCategory} from './hardware_category';
 
 export function getToolboxJSON(
     shownPythonToolboxCategories: Set<string> | null) {
 
     return {
         kind: 'categoryToolbox',
         contents: [
            hardwareCategory,
            { kind: 'sep' },
            ...common.getToolboxItems(shownPythonToolboxCategories)
         ]
     };
 }
 