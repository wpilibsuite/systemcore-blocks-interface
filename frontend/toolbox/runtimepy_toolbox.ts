// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import { runtimePyData } from '../blocks/utils/python';
import * as pythonDataToolbox from './python_data_toolbox';
import * as toolboxItems from './items';


export function getToolboxCategories(): toolboxItems.Category[] {
  const shownCategories: Set<string> = new Set();
  shownCategories.add("wpilib_blocks.color");
  const showSimpleClassNames = true;
  
  const categories: toolboxItems.Category[] = [];

  // Move the categories under wpilib_blocks up to the top level.
  for (const category of pythonDataToolbox.getToolboxCategories(runtimePyData, shownCategories, showSimpleClassNames)) {
    if (category.name == 'wpilib_blocks') {
      if (category.contents) {
        for (const child of category.contents) {
          if (child.kind === 'category') {
            categories.push(child as toolboxItems.Category);
          }
        }
      }
    } else {
      categories.push(category);
    }
  }
  return categories;
}
