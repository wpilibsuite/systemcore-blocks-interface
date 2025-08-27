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
import * as storageModuleContent from '../storage/module_content';
import { addMechanismEventHandlerBlocks, addRobotEventHandlerBlocks } from '../blocks/mrc_event_handler';
import { Editor } from '../editor/editor';

// The event handlers category is shown when the user is editing an opmode.
// It allows the user to create event handlers for events previously defined in the Robot or in a
// mechanism.

// The event handlers category is a custom category because it must be updated dynamically.
// As the user places event handler blocks on the blockly workspace, we update the category so it
// doesn't contain blocks for the event handlers that have already been added to the blockly
// workspace.

const CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT = 'MRC_EVENT_HANDLERS_ROBOT';
const CUSTOM_CATEGORY_EVENT_HANDLERS_MECHANISM_PREFIX = 'MRC_EVENT_HANDLERS_MECHANISM_';

function getCustomValue(mechanismInRobot: storageModuleContent.MechanismInRobot | null): string {
  // If the event is defined in the robot, mechanismInRobot is null.
  return (mechanismInRobot === null)
      ? CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT
      : CUSTOM_CATEGORY_EVENT_HANDLERS_MECHANISM_PREFIX + mechanismInRobot.mechanismId;
}

export function getRobotEventHandlersCategory(editor: Editor): toolboxItems.Category {
  const blocklyWorkspace = editor.getBlocklyWorkspace();

  // If this category hasn't been register yet, do it now.
  const customValue = getCustomValue(null);
  if (!blocklyWorkspace.getToolboxCategoryCallback(customValue)) {
    const category = new EventHandlersCategory(null);
    blocklyWorkspace.registerToolboxCategoryCallback(customValue, category.robotEventHandlersFlyout.bind(category));
  }
  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
    custom: customValue,
  };
}

export function getMechanismEventHandlersCategory(
    editor: Editor,
    mechanismInRobot: storageModuleContent.MechanismInRobot): toolboxItems.Category {
  const blocklyWorkspace = editor.getBlocklyWorkspace();

  // If this category hasn't been register yet, do it now.
  const customValue = getCustomValue(mechanismInRobot);
  if (!blocklyWorkspace.getToolboxCategoryCallback(customValue)) {
    const category = new EventHandlersCategory(mechanismInRobot);
    blocklyWorkspace.registerToolboxCategoryCallback(customValue, category.mechanismEventHandlersFlyout.bind(category));
  }
  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
    custom: customValue,
  };
}

class EventHandlersCategory {
  // If the event is defined in the robot, mechanismInRobot is null.
  mechanismInRobot: storageModuleContent.MechanismInRobot | null;

  constructor(mechanismInRobot: storageModuleContent.MechanismInRobot | null) {
    this.mechanismInRobot = mechanismInRobot;
  }

  public robotEventHandlersFlyout(workspace: Blockly.WorkspaceSvg) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (!editor) {
      throw new Error('No editor for blockly workspace');
    }

    const contents: toolboxItems.ContentsType[] = [];

    // Get the list of events from the robot.
    const eventsFromRobot = editor.getEventsFromRobot();
    // Remove events if there is already a corresponding handler in the workspace.
    const eventHandlerBlocks = editor.getRobotEventHandlersAlreadyInWorkspace();
    const eventIds: string[] = [];
    eventHandlerBlocks.forEach(eventHandlerBlock => {
      eventIds.push(eventHandlerBlock.getEventId());
    });
    const eventsToShow = eventsFromRobot.filter(event => {
      return !eventIds.includes(event.eventId);
    });
    addRobotEventHandlerBlocks(eventsToShow, contents);

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }

  public mechanismEventHandlersFlyout(workspace: Blockly.WorkspaceSvg) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (!editor) {
      throw new Error('No editor for blockly workspace');
    }
    if (!this.mechanismInRobot) {
      throw new Error('mechanismInRobot is null');
    }

    const contents: toolboxItems.ContentsType[] = [];

    // Get the list of events from the mechanism.
    const mechanism = editor.getMechanism(this.mechanismInRobot);
    if (mechanism) {
      const eventsFromMechanism = editor.getEventsFromMechanism(mechanism);
      // Remove events if there is already a corresponding handler in the workspace.
      const eventHandlerBlocks = editor.getMechanismEventHandlersAlreadyInWorkspace(
          this.mechanismInRobot);
      const eventIds: string[] = [];
      eventHandlerBlocks.forEach(eventHandlerBlock => {
        eventIds.push(eventHandlerBlock.getEventId());
      });
      const eventsToShow = eventsFromMechanism.filter(event => {
        return !eventIds.includes(event.eventId);
      });
      addMechanismEventHandlerBlocks(this.mechanismInRobot, eventsToShow, contents);
      if (contents.length === 0) {
        const label : toolboxItems.Label = new toolboxItems.Label(Blockly.Msg['NO_MECHANISM_CONTENTS']);
        contents.push(label);
      }
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}
