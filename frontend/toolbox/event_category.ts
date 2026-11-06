// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import * as storageNames from '../storage/names';
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles';
import { createCustomEventBlock } from '../blocks/mrc_event';
import { addFireEventBlocks } from '../blocks/mrc_call_python_function';
import { Editor } from '../editor/editor';

const CUSTOM_CATEGORY_EVENTS = 'MRC_EVENTS';

export function getCategory(editor: Editor): toolboxItems.Category {
  const blocklyWorkspace = editor.getBlocklyWorkspace();

  // If this category hasn't been register yet, do it now.
  if (!blocklyWorkspace.getToolboxCategoryCallback(CUSTOM_CATEGORY_EVENTS)) {
    const category = new EventsCategory();
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_EVENTS, category.eventsFlyout.bind(category));
  }
  return {
    kind: 'category',
    categorystyle: MRC_CATEGORY_STYLE_METHODS,
    name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
    custom: CUSTOM_CATEGORY_EVENTS,
  };
}

class EventsCategory {
  public eventsFlyout(workspace: Blockly.WorkspaceSvg) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (!editor) {
      throw new Error('No editor for blockly workspace');
    }

    const contents: toolboxItems.ContentsType[] = [];

    const eventsFromWorkspace = editor.getEventsFromWorkspace();
    const eventNames: string[] = [];
    eventsFromWorkspace.forEach(event => {
      eventNames.push(event.name);
    });

    // Add a block that lets the user define a new event.
    contents.push(
        new toolboxItems.Label(Blockly.Msg['CUSTOM_EVENTS_LABEL']),
        createCustomEventBlock(storageNames.makeUniqueName('my_event', eventNames)));

    // Get blocks for firing events defined in the current workspace.
    addFireEventBlocks(eventsFromWorkspace, contents);

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}
