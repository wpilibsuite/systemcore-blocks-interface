// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import { robotPyData } from '../blocks/utils/python';
import * as pythonDataToolbox from './python_data_toolbox';
import * as toolboxItems from './items';


export function getToolboxCategories(
    shownPythonToolboxCategories: Set<string> | null,
    showSimpleClassNames: boolean): toolboxItems.Category[] {
  return pythonDataToolbox.getToolboxCategories(
      robotPyData,
      shownPythonToolboxCategories,
      showSimpleClassNames);
}
