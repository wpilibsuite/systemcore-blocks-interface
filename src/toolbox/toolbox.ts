import * as Blockly from 'blockly/core';
import * as storageModule from '../storage/module';
import * as toolboxItems from './items';
import * as common from './toolbox_common'
import { Editor } from '../editor/editor';
import { getHardwareCategory } from './hardware_category';
import { getCategory as getEventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null,
    editor: Editor): Blockly.utils.toolbox.ToolboxInfo {

  const toolbox: Blockly.utils.toolbox.ToolboxInfo = {
    kind: 'categoryToolbox',
    contents: []
  };

  switch (editor.getModuleType()) {
    case storageModule.ModuleType.ROBOT:
    case storageModule.ModuleType.MECHANISM:
      toolbox.contents.push(getHardwareCategory(editor));
      toolbox.contents.push(new toolboxItems.Sep());
      toolbox.contents.push(...common.getToolboxItems(shownPythonToolboxCategories, editor));
      toolbox.contents.push(getEventCategory(editor));
      break;
    case storageModule.ModuleType.OPMODE:
      toolbox.contents.push(getHardwareCategory(editor));
      toolbox.contents.push(new toolboxItems.Sep());
      toolbox.contents.push(...common.getToolboxItems(shownPythonToolboxCategories, editor));
      break;
  }

  // Blockly has trouble with categories are created with new toolboxItem.Category(...).
  // This trouble is prevented by stringifying and parsing.
  return JSON.parse(JSON.stringify(toolbox));
}

/**
 * Collects the expanded/collapsed state of categories in the previous toolbox and applies them
 * to the new toolbox.
 */
export function applyExpandedCategories(
    previousToolbox: Blockly.IToolbox,
    newToolbox: Blockly.utils.toolbox.ToolboxInfo) {
  const expanded: {[categoryPath: string]: boolean} = {};
  recursivelyCollectExpandedCategories((previousToolbox as any).getToolboxItems(), expanded, '', null);
  recursivelyApplyExpandedCategories(newToolbox.contents, expanded, '');
}

/**
 * Collects the expanded/collapsed state for all collapsible items.
 */
function recursivelyCollectExpandedCategories(
    items: Blockly.IToolboxItem[],
    expanded: {[categoryPath: string]: boolean},
    parentPath: string,
    parent: Blockly.IToolboxItem | null) {
  items
      .filter(item => item.getParent() == parent)
      .filter(item => item.isCollapsible())
      .forEach(item => {
        const collapsibleItem = item as Blockly.ICollapsibleToolboxItem;
        const path = makePath(parentPath, collapsibleItem.getName());
        expanded[path] = collapsibleItem.isExpanded();
        recursivelyCollectExpandedCategories(
            collapsibleItem.getChildToolboxItems(), expanded, path, item);
      });
}

/**
 * Applies previously collected expanded/collapsed state to the given toolbox categories.
 */
function recursivelyApplyExpandedCategories(
    contents: toolboxItems.ContentsType[],
    expanded: {[categoryPath: string]: boolean},
    parentPath: string) {
  contents
      .filter(item => item.kind === 'category')
      .forEach(item => {
        const category = item as toolboxItems.Category;
        const path = makePath(parentPath, category.name);
        if (path in expanded) {
          if (expanded[path]) {
            category.expanded = true;
          } else {
            delete category.expanded;
          }
        }
        if (category.contents) {
          recursivelyApplyExpandedCategories(category.contents, expanded, path);
        }
      });
}

/**
 * Returns a string that combines the given parentPath with the given child.
 */
function makePath(parentPath: string, child: string) {
  if (parentPath) {
    return parentPath + '\u2705' + child;
  }
  return child;
}
