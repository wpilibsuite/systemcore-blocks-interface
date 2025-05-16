 import * as common from './toolbox_common'
 import {category as robotCategory} from './/robot_category';
 
 export function getToolboxJSON(
     shownPythonToolboxCategories: Set<string> | null) {
 
     return {
         kind: 'categoryToolbox',
         contents: [
            robotCategory,
            { kind: 'sep' },
            ...common.getToolboxItems(shownPythonToolboxCategories)
         ]
     };
 }
 
 /*if (opt_robotBlocks.length) {
    contents.push.apply(
      contents,
      [
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'Project',
          contents: opt_robotBlocks,
        },
      ]);
  }*/