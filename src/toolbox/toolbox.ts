import * as Blockly from 'blockly/core';
import * as storageModule from '../storage/module';
import * as toolboxItems from './items';
import * as common from './toolbox_common'
import { Editor } from '../editor/editor';
import { getHardwareCategory } from './hardware_category';
import { getCategory as getEventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null,
    editor: Editor): Blockly.utils.toolbox.ToolboxDefinition {

  const toolbox: Blockly.utils.toolbox.ToolboxDefinition = {
    kind: 'categoryToolbox',
    contents: []
  };

  switch (editor.getCurrentModuleType()) {
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
