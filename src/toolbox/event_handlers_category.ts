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
import { addRobotEventHandlerBlocks } from '../blocks/mrc_event_handler';
import { Editor } from '../editor/editor';

// The robot event handlers category is shown when the user is editing an opmode.
// It allows the user to create event handlers for events previously defined in the Robot.

// The event handlers category is a custom category because it must be updated dynamically.
// As the user places event handler blocks on the blockly workspace, we update the category so it
// doesn't contain blocks for the event handlers that have already been added to the blockly
// workspace.

const CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT = 'EVENT_HANDLERS_ROBOT';

export const getRobotEventHandlersCategory = () => ({
  kind: 'category',
  name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
  custom: CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT,
});

export class RobotEventHandlersCategory {
  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(
        CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT, this.robotEventHandlersFlyout.bind(this));
  }

  public robotEventHandlersFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Get the list of events from the robot and add the blocks for handling events.

    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      const eventsFromRobot = editor.getEventsFromRobot();
      // Remove events if there is already a corresponding handler in the workspace.
      const eventHandlerNames = editor.getEventHandlerNamesFromWorkspace();
      const eventsToShow = eventsFromRobot.filter(event => {
        return !eventHandlerNames.includes(event.name);
      });
      addRobotEventHandlerBlocks(eventsToShow, contents);
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}
