// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import * as robotPyToolbox from './robotpy_toolbox';
import * as runtimePyToolbox from './runtimepy_toolbox';
import * as toolboxItems from './items';
import { getCategory as getLogicCategory } from './logic_category';
import { getCategory as getLoopCategory } from './loop_category';
import { getCategory as getMathCategory } from './math_category';
import { getCategory as getTextCategory } from './text_category';
import { getCategory as getListsCategory } from './lists_category';
import { getCategory as getMiscCategory } from './misc_category';
import { getCategory as getMethodsCategory } from './methods_category';
import { getCategory as getVariablesCategory } from './variables_category';
import { Editor } from '../editor/editor';


export function getToolboxItems(
    editor: Editor): toolboxItems.ContentsType[] {
  const contents: toolboxItems.ContentsType[] = [];

  const robotPyCategories: toolboxItems.ContentsType[] = robotPyToolbox.getToolboxCategories(
      editor.getShownPythonToolboxCategories(), editor.getShowSimpleClassNames());
  if (robotPyCategories.length) {
    contents.push.apply(contents, robotPyCategories);
    contents.push.apply(contents, [
      {
        kind: 'sep',
      },
    ]);
  }

  const runtimePyCategories: toolboxItems.ContentsType[] = runtimePyToolbox.getToolboxCategories();
  if (runtimePyCategories.length) {
    contents.push.apply(contents, runtimePyCategories);
    contents.push.apply(contents, [
      {
        kind: 'sep',
      },
    ]);
  }

  const libraryCategories: toolboxItems.ContentsType[] = editor.getLibraryToolboxCategories();
  if (libraryCategories.length) {
    contents.push.apply(contents, libraryCategories);
    contents.push.apply(contents, [
      {
        kind: 'sep',
      },
    ]);
  }

  contents.push.apply(
    contents,
    [
      getLogicCategory(),
      getLoopCategory(),
      getMathCategory(),
      getTextCategory(),
      getListsCategory(),
      getMiscCategory(),
      {
        kind: 'sep',
      },
      getVariablesCategory(editor),
      getMethodsCategory(editor),

    ],
  );
  return contents;
}
