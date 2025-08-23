import * as Blockly from 'blockly/core';
import * as storageModule from '../storage/module';
import * as common from './toolbox_common'
import { Editor } from '../editor/editor';
import { getHardwareCategory } from './hardware_category';
import { getCategory as getEventCategory } from './event_category';

export function getToolboxJSON(
    shownPythonToolboxCategories: Set<string> | null,
    editor: Editor): Blockly.utils.toolbox.ToolboxDefinition {

  switch (editor.getCurrentModuleType()) {
    case storageModule.ModuleType.ROBOT:
    case storageModule.ModuleType.MECHANISM:
      return {
        kind: 'categoryToolbox',
        contents: [
          getHardwareCategory(editor),
          { kind: 'sep' },
          ...common.getToolboxItems(shownPythonToolboxCategories, editor),
          getEventCategory(editor),
        ]
      };
    case storageModule.ModuleType.OPMODE:
      return {
        kind: 'categoryToolbox',
        contents: [
          getHardwareCategory(editor),
          { kind: 'sep' },
          ...common.getToolboxItems(shownPythonToolboxCategories, editor)
        ]
      };
    default:
      return {
        kind: 'categoryToolbox',
        contents: []
      };
  }
}
