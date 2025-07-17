/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import * as commonStorage from '../storage/common_storage';
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles';
import { createCustomEventBlock } from '../blocks/mrc_event';
import { addFireEventBlocks } from '../blocks/mrc_call_python_function';
import { Editor } from '../editor/editor';

const CUSTOM_CATEGORY_EVENTS = 'EVENTS';

export const getCategory = () => ({
  kind: 'category',
  categorystyle: MRC_CATEGORY_STYLE_METHODS,
  name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
  custom: CUSTOM_CATEGORY_EVENTS,
});

export class EventsCategory {
  private currentModule: commonStorage.Module | null = null;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_EVENTS, this.eventsFlyout.bind(this));
  }

  public setCurrentModule(currentModule: commonStorage.Module | null) {
    this.currentModule = currentModule;
  }

  public eventsFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Add a block that lets the user define a new event.
    contents.push(
      {
        kind: 'label',
        text: 'Custom Events',
      },
      createCustomEventBlock()
    );

    // Get blocks for firing methods defined in the current workspace.
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      const eventsFromWorkspace = editor.getEventsFromWorkspace();
      addFireEventBlocks(eventsFromWorkspace, contents);
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}