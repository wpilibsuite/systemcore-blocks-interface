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

const CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT = 'EVENT_HANDLERS_ROBOT';
const CUSTOM_CATEGORY_EVENT_HANDLERS_MECHANISM_PREFIX = 'EVENT_HANDLERS_MECHANISM_';

function getCustomValue(mechanismInRobot: storageModuleContent.MechanismInRobot | null): string {
  return (mechanismInRobot === null)
      ? CUSTOM_CATEGORY_EVENT_HANDLERS_ROBOT
      : CUSTOM_CATEGORY_EVENT_HANDLERS_MECHANISM_PREFIX + mechanismInRobot.name;
}

export function registerRobotEventHandlersCategory(blocklyWorkspace: Blockly.WorkspaceSvg): void {
  new EventHandlersCategory(blocklyWorkspace, null);
}

export function getRobotEventHandlersCategory(): toolboxItems.Category {
  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
    custom: getCustomValue(null),
  };
}

export function registerMechanismEventHandlersCategory(
    blocklyWorkspace: Blockly.WorkspaceSvg, mechanismInRobot: storageModuleContent.MechanismInRobot): void {
  new EventHandlersCategory(blocklyWorkspace, mechanismInRobot);
}

export function getMechanismEventHandlersCategory(
    mechanismInRobot: storageModuleContent.MechanismInRobot): toolboxItems.Category {
  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
    custom: getCustomValue(mechanismInRobot),
  };
}

class EventHandlersCategory {
  mechanismInRobot: storageModuleContent.MechanismInRobot | null;

  constructor(
      blocklyWorkspace: Blockly.WorkspaceSvg,
      mechanismInRobot: storageModuleContent.MechanismInRobot | null) {
    this.mechanismInRobot = mechanismInRobot;
    if (mechanismInRobot === null) {
      blocklyWorkspace.registerToolboxCategoryCallback(
          getCustomValue(mechanismInRobot),
          this.robotEventHandlersFlyout.bind(this));
    } else {
      blocklyWorkspace.registerToolboxCategoryCallback(
          getCustomValue(mechanismInRobot),
          this.mechanismEventHandlersFlyout.bind(this));
    }
  }

  public robotEventHandlersFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      // Get the list of events from the robot.
      const eventsFromRobot = editor.getEventsFromRobot();
      // Remove events if there is already a corresponding handler in the workspace.
      const eventHandlerBlocks = editor.getRobotEventHandlersAlreadyInWorkspace();
      const eventBlockIds: string[] = [];
      eventHandlerBlocks.forEach(eventHandlerBlock => {
        eventBlockIds.push(eventHandlerBlock.getEventBlockId());
      });
      const eventsToShow = eventsFromRobot.filter(event => {
        return !eventBlockIds.includes(event.blockId);
      });
      addRobotEventHandlerBlocks(eventsToShow, contents);
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }

  public mechanismEventHandlersFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor && this.mechanismInRobot) {
      // Get the list of events from the mechanism.
      const mechanism = editor.getMechanism(this.mechanismInRobot);
      if (mechanism) {
        const eventsFromMechanism = editor.getEventsFromMechanism(mechanism);
        // Remove events if there is already a corresponding handler in the workspace.
        const eventHandlerBlocks = editor.getMechanismEventHandlersAlreadyInWorkspace(
            this.mechanismInRobot);
        const eventBlockIds: string[] = [];
        eventHandlerBlocks.forEach(eventHandlerBlock => {
          eventBlockIds.push(eventHandlerBlock.getEventBlockId());
        });
        const eventsToShow = eventsFromMechanism.filter(event => {
          return !eventBlockIds.includes(event.blockId);
        });
        addMechanismEventHandlerBlocks(this.mechanismInRobot, eventsToShow, contents);
        if (contents.length === 0) {
          const label : toolboxItems.Label = new toolboxItems.Label(Blockly.Msg['NO_MECHANISM_CONTENTS']);
          contents.push(label);
        }
      }
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}
